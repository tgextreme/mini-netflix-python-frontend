// Security and Error Handling Utilities

class SecurityHelper {
    // Sanitizar HTML para prevenir XSS
    static sanitizeHTML(html) {
        const temp = document.createElement('div');
        temp.textContent = html;
        return temp.innerHTML;
    }

    // Escapar caracteres especiales
    static escapeHTML(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;',
        };
        return String(text).replace(/[&<>"'/]/g, (s) => map[s]);
    }

    // Validar email
    static isValidEmail(email) {
        return CONFIG.VALIDATION.EMAIL_REGEX.test(email);
    }

    // Validar contraseña
    static isValidPassword(password) {
        return password.length >= CONFIG.VALIDATION.PASSWORD_MIN_LENGTH &&
               password.length <= CONFIG.VALIDATION.PASSWORD_MAX_LENGTH;
    }

    // Generar token CSRF (para formularios)
    static generateCSRFToken() {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    // Verificar token CSRF
    static verifyCSRFToken(token, storedToken) {
        return token === storedToken;
    }

    // Rate limiting simple (lado cliente)
    static createRateLimiter(maxAttempts, windowMs) {
        const attempts = new Map();
        
        return (key) => {
            const now = Date.now();
            const userAttempts = attempts.get(key) || [];
            
            // Limpiar intentos antiguos
            const recentAttempts = userAttempts.filter(
                time => now - time < windowMs
            );
            
            if (recentAttempts.length >= maxAttempts) {
                const oldestAttempt = Math.min(...recentAttempts);
                const waitTime = windowMs - (now - oldestAttempt);
                return {
                    allowed: false,
                    waitTime: Math.ceil(waitTime / 1000),
                };
            }
            
            recentAttempts.push(now);
            attempts.set(key, recentAttempts);
            
            return {
                allowed: true,
                remaining: maxAttempts - recentAttempts.length,
            };
        };
    }

    // Detectar contenido malicioso en URLs
    static isSafeURL(url) {
        try {
            const parsed = new URL(url);
            // Solo permitir HTTP y HTTPS
            return ['http:', 'https:'].includes(parsed.protocol);
        } catch {
            return false;
        }
    }

    // Generar hash simple (NO usar para passwords reales)
    static async simpleHash(text) {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
}

class ErrorHandler {
    constructor() {
        this.errors = [];
        this.maxErrors = 100;
        this.listeners = [];
        
        this.setupGlobalHandlers();
    }

    setupGlobalHandlers() {
        // Capturar errores de JavaScript
        window.addEventListener('error', (event) => {
            this.logError({
                type: 'javascript',
                message: event.message,
                filename: event.filename,
                line: event.lineno,
                column: event.colno,
                stack: event.error?.stack,
                timestamp: new Date().toISOString(),
            });
        });

        // Capturar promesas rechazadas no manejadas
        window.addEventListener('unhandledrejection', (event) => {
            this.logError({
                type: 'promise',
                message: event.reason?.message || String(event.reason),
                stack: event.reason?.stack,
                timestamp: new Date().toISOString(),
            });
        });

        // Capturar errores de recursos no cargados
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.logError({
                    type: 'resource',
                    message: `Failed to load: ${event.target.src || event.target.href}`,
                    element: event.target.tagName,
                    timestamp: new Date().toISOString(),
                });
            }
        }, true);
    }

    logError(error) {
        this.errors.push(error);
        
        // Mantener solo los últimos N errores
        if (this.errors.length > this.maxErrors) {
            this.errors.shift();
        }

        // Log en consola en modo debug
        if (CONFIG.DEBUG) {
            console.error('Error logged:', error);
        }

        // Notificar a listeners
        this.notifyListeners(error);

        // Aquí podrías enviar a un servicio de tracking como Sentry
        // this.sendToErrorTracking(error);
    }

    addListener(callback) {
        this.listeners.push(callback);
    }

    removeListener(callback) {
        this.listeners = this.listeners.filter(cb => cb !== callback);
    }

    notifyListeners(error) {
        this.listeners.forEach(callback => {
            try {
                callback(error);
            } catch (err) {
                console.error('Error in error listener:', err);
            }
        });
    }

    getErrors() {
        return [...this.errors];
    }

    clearErrors() {
        this.errors = [];
    }

    // Crear un boundary para capturar errores en secciones específicas
    createErrorBoundary(element, fallbackHTML) {
        const originalContent = element.innerHTML;
        
        try {
            return {
                reset: () => {
                    element.innerHTML = originalContent;
                },
                showError: (error) => {
                    this.logError(error);
                    element.innerHTML = fallbackHTML || `
                        <div class="error-boundary">
                            <h3>Algo salió mal</h3>
                            <p>Lo sentimos, ocurrió un error al cargar esta sección.</p>
                            <button onclick="location.reload()">Recargar página</button>
                        </div>
                    `;
                },
            };
        } catch (error) {
            this.logError(error);
            return null;
        }
    }

    // Formatear error para mostrar al usuario
    formatUserError(error) {
        if (error.status === 401) {
            return CONFIG.ERRORS.UNAUTHORIZED;
        } else if (error.status === 403) {
            return CONFIG.ERRORS.FORBIDDEN;
        } else if (error.status === 404) {
            return CONFIG.ERRORS.NOT_FOUND;
        } else if (error.status >= 500) {
            return CONFIG.ERRORS.SERVER_ERROR;
        } else if (error.status === 0) {
            return CONFIG.ERRORS.NETWORK;
        }
        
        return error.message || CONFIG.ERRORS.GENERIC;
    }

    // Wrapper para funciones async con manejo de errores
    static async asyncTryCatch(fn, errorCallback) {
        try {
            return await fn();
        } catch (error) {
            if (errorCallback) {
                errorCallback(error);
            } else {
                errorHandler.logError({
                    type: 'async',
                    message: error.message,
                    stack: error.stack,
                    timestamp: new Date().toISOString(),
                });
            }
            throw error;
        }
    }
}

class ValidationHelper {
    // Validar formulario
    static validateForm(formData, rules) {
        const errors = {};
        
        for (const [field, rule] of Object.entries(rules)) {
            const value = formData[field];
            
            if (rule.required && !value) {
                errors[field] = `${field} es requerido`;
                continue;
            }
            
            if (rule.minLength && value.length < rule.minLength) {
                errors[field] = `${field} debe tener al menos ${rule.minLength} caracteres`;
                continue;
            }
            
            if (rule.maxLength && value.length > rule.maxLength) {
                errors[field] = `${field} debe tener máximo ${rule.maxLength} caracteres`;
                continue;
            }
            
            if (rule.pattern && !rule.pattern.test(value)) {
                errors[field] = `${field} tiene un formato inválido`;
                continue;
            }
            
            if (rule.custom && !rule.custom(value)) {
                errors[field] = rule.customMessage || `${field} es inválido`;
            }
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors,
        };
    }

    // Mostrar errores en formulario
    static showFormErrors(formElement, errors) {
        // Limpiar errores anteriores
        formElement.querySelectorAll('.field-error').forEach(el => el.remove());
        formElement.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        
        // Mostrar nuevos errores
        for (const [field, message] of Object.entries(errors)) {
            const input = formElement.querySelector(`[name="${field}"]`);
            if (input) {
                input.classList.add('error');
                
                const errorDiv = document.createElement('div');
                errorDiv.className = 'field-error';
                errorDiv.textContent = message;
                input.parentNode.appendChild(errorDiv);
            }
        }
    }
}

// Inicializar error handler global
const errorHandler = new ErrorHandler();

// Rate limiter para login
const loginRateLimiter = SecurityHelper.createRateLimiter(5, 15 * 60 * 1000); // 5 intentos en 15 minutos

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SecurityHelper,
        ErrorHandler,
        ValidationHelper,
        errorHandler,
        loginRateLimiter,
    };
}
