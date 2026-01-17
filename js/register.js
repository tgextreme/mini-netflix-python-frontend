// Manejo de registro de usuarios

document.addEventListener('DOMContentLoaded', () => {
    // Verificar si ya está autenticado
    if (api.isAuthenticated()) {
        window.location.href = 'home.html';
        return;
    }

    const registerForm = document.getElementById('registerForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Obtener valores del formulario
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validaciones
        if (!name || !email || !password || !confirmPassword) {
            showError('Por favor completa todos los campos');
            return;
        }

        if (name.length < 2) {
            showError('El nombre debe tener al menos 2 caracteres');
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

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('Por favor ingresa un email válido');
            return;
        }

        // Mostrar estado de carga
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');
        hideMessages();

        try {
            // Intentar registro
            const response = await api.register(name, email, password);
            
            // Registro exitoso
            console.log('Registro exitoso:', response);
            
            showSuccess('¡Cuenta creada exitosamente! Redirigiendo...');
            
            // Redirigir después de 1.5 segundos
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1500);
            
        } catch (error) {
            console.error('Error en registro:', error);
            
            // Mostrar mensaje de error apropiado
            let errorMsg = 'Error al crear la cuenta';
            
            if (error.status === 409) {
                errorMsg = 'Este email ya está registrado';
            } else if (error.status === 400) {
                errorMsg = error.message || 'Datos de registro inválidos';
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
    const inputs = registerForm.querySelectorAll('input');
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
