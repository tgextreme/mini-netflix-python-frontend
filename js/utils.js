// Utility Functions - Helpers comunes

class Utils {
    // Debounce - Retrasar ejecución de función
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle - Limitar frecuencia de ejecución
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Formatear tiempo (segundos a HH:MM:SS)
    static formatTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        
        if (h > 0) {
            return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    // Formatear duración (minutos a horas y minutos)
    static formatDuration(minutes) {
        if (minutes < 60) {
            return `${minutes}min`;
        }
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
    }

    // Formatear fecha
    static formatDate(dateString, format = 'short') {
        const date = new Date(dateString);
        
        if (format === 'short') {
            return date.toLocaleDateString('es', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } else if (format === 'long') {
            return date.toLocaleDateString('es', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } else if (format === 'relative') {
            return this.getRelativeTime(date);
        }
        
        return date.toLocaleDateString('es');
    }

    // Tiempo relativo (hace 2 días, hace 1 hora, etc.)
    static getRelativeTime(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffSecs < 60) return 'hace un momento';
        if (diffMins < 60) return `hace ${diffMins} min`;
        if (diffHours < 24) return `hace ${diffHours}h`;
        if (diffDays < 7) return `hace ${diffDays} días`;
        if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} semanas`;
        if (diffDays < 365) return `hace ${Math.floor(diffDays / 30)} meses`;
        return `hace ${Math.floor(diffDays / 365)} años`;
    }

    // Truncar texto
    static truncate(text, maxLength, suffix = '...') {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength - suffix.length) + suffix;
    }

    // Generar ID único
    static generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Parsear query string
    static parseQueryString(queryString = window.location.search) {
        const params = new URLSearchParams(queryString);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    }

    // Crear query string desde objeto
    static createQueryString(params) {
        return new URLSearchParams(params).toString();
    }

    // Scroll suave a elemento
    static smoothScrollTo(elementId, offset = 0) {
        const element = document.getElementById(elementId);
        if (element) {
            const top = element.offsetTop - offset;
            window.scrollTo({
                top,
                behavior: 'smooth'
            });
        }
    }

    // Copiar al clipboard
    static async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Error copiando al clipboard:', err);
            return false;
        }
    }

    // Detectar dispositivo móvil
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Detectar tipo de dispositivo
    static getDeviceType() {
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    }

    // Shuffle array
    static shuffle(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // Agrupar array por propiedad
    static groupBy(array, key) {
        return array.reduce((result, item) => {
            const group = item[key];
            if (!result[group]) {
                result[group] = [];
            }
            result[group].push(item);
            return result;
        }, {});
    }

    // Sleep/wait
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Retry con exponential backoff
    static async retry(fn, maxAttempts = 3, delay = 1000) {
        for (let i = 0; i < maxAttempts; i++) {
            try {
                return await fn();
            } catch (error) {
                if (i === maxAttempts - 1) throw error;
                await this.sleep(delay * Math.pow(2, i));
            }
        }
    }

    // Lazy load images
    static lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    // Download file
    static downloadFile(url, filename) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // Format file size
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    // Get contrast color (blanco o negro según background)
    static getContrastColor(hexColor) {
        const r = parseInt(hexColor.substr(1, 2), 16);
        const g = parseInt(hexColor.substr(3, 2), 16);
        const b = parseInt(hexColor.substr(5, 2), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? '#000000' : '#FFFFFF';
    }

    // Local storage con expiration
    static setLocalStorageWithExpiry(key, value, ttl) {
        const now = new Date();
        const item = {
            value: value,
            expiry: now.getTime() + ttl,
        };
        localStorage.setItem(key, JSON.stringify(item));
    }

    static getLocalStorageWithExpiry(key) {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return null;
        
        const item = JSON.parse(itemStr);
        const now = new Date();
        
        if (now.getTime() > item.expiry) {
            localStorage.removeItem(key);
            return null;
        }
        return item.value;
    }
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Utils };
}
