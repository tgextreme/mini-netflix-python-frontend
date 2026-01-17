// reset-password.js - Funcionalidad para restablecer contraseña

document.addEventListener('DOMContentLoaded', () => {
    // Verificar si ya está autenticado
    if (api.isAuthenticated()) {
        window.location.href = 'home.html';
        return;
    }

    // Obtener token de reset desde URL
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('token');

    if (!resetToken) {
        showError('Token de recuperación inválido o faltante');
        document.getElementById('resetPasswordForm').style.display = 'none';
        return;
    }

    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    resetPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Obtener valores del formulario
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validaciones
        if (!password || !confirmPassword) {
            showError('Por favor completa todos los campos');
            return;
        }

        if (password.length < 6) {
            showError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (password !== confirmPassword) {
            showError('Las contraseñas no coinciden');
            return;
        }

        // Mostrar estado de carga
        const submitBtn = resetPasswordForm.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');
        hideMessages();

        try {
            // Restablecer contraseña
            await api.resetPassword(resetToken, password);
            
            // Mostrar mensaje de éxito
            showSuccess('¡Contraseña restablecida exitosamente! Redirigiendo al login...');
            
            // Redirigir al login después de 2 segundos
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            
        } catch (error) {
            console.error('Error al restablecer contraseña:', error);
            
            // Mostrar mensaje de error apropiado
            let errorMsg = 'Error al restablecer la contraseña';
            
            if (error.status === 400) {
                errorMsg = 'Token inválido o expirado. Por favor solicita uno nuevo.';
            } else if (error.status === 404) {
                errorMsg = 'Usuario no encontrado';
            } else if (error.status === 0) {
                errorMsg = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
            } else if (error.message) {
                errorMsg = error.message;
            }
            
            showError(errorMsg);
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
    const inputs = resetPasswordForm.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', hideMessages);
    });

    // Validar contraseñas en tiempo real
    document.getElementById('confirmPassword').addEventListener('input', () => {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (confirmPassword && password !== confirmPassword) {
            document.getElementById('confirmPassword').style.borderColor = 'var(--error-color)';
        } else {
            document.getElementById('confirmPassword').style.borderColor = 'transparent';
        }
    });
});
