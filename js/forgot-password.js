// forgot-password.js - Funcionalidad para recuperación de contraseña

document.addEventListener('DOMContentLoaded', () => {
    // Verificar si ya está autenticado
    if (api.isAuthenticated()) {
        window.location.href = 'home.html';
        return;
    }

    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    forgotPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Obtener email del formulario
        const email = document.getElementById('email').value.trim();

        // Validación básica
        if (!email) {
            showError('Por favor ingresa tu email');
            return;
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('Por favor ingresa un email válido');
            return;
        }

        // Mostrar estado de carga
        const submitBtn = forgotPasswordForm.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');
        hideMessages();

        try {
            // Solicitar reset de contraseña
            await api.requestPasswordReset(email);
            
            // Mostrar mensaje de éxito
            showSuccess('¡Enlace enviado! Revisa tu email para restablecer tu contraseña.');
            
            // Limpiar formulario
            forgotPasswordForm.reset();
            
        } catch (error) {
            console.error('Error al solicitar reset:', error);
            
            // Mostrar mensaje de error apropiado
            let errorMsg = 'Error al procesar la solicitud';
            
            if (error.status === 404) {
                errorMsg = 'No existe una cuenta con este email';
            } else if (error.status === 400) {
                errorMsg = error.message || 'Email inválido';
            } else if (error.status === 429) {
                errorMsg = 'Demasiados intentos. Por favor espera unos minutos';
            } else if (error.status === 0) {
                errorMsg = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
            } else if (error.message) {
                errorMsg = error.message;
            }
            
            showError(errorMsg);
        } finally {
            submitBtn.classList.remove('loading');
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
    }

    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.classList.add('show');
    }

    function hideMessages() {
        errorMessage.classList.remove('show');
        successMessage.classList.remove('show');
    }

    // Limpiar mensajes cuando el usuario empiece a escribir
    document.getElementById('email').addEventListener('input', hideMessages);
});
