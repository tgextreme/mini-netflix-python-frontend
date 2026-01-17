// Manejo de autenticación - Página de Login

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar si ya está autenticado y si el token es válido
    if (api.isAuthenticated()) {
        try {
            // Intentar obtener información del usuario para validar el token
            await api.getMe();
            // Si llega aquí, el token es válido, redirigir según rol
            const user = api.getUser();
            const isAdmin = api.isAdmin();
            console.log('[Auth] Usuario ya autenticado:', user);
            console.log('[Auth] Es admin:', isAdmin);
            
            const redirectUrl = isAdmin ? '/admin/' : '/home.html';
            console.log('[Auth] Redirigiendo a:', redirectUrl);
            window.location.href = redirectUrl;
            return;
        } catch (error) {
            // Token inválido o expirado, limpiarlo
            console.log('Token inválido, limpiando...');
            api.removeToken();
            // Continuar con el formulario de login
        }
    }

    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Obtener valores del formulario
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Validación básica
        if (!email || !password) {
            showError('Por favor completa todos los campos');
            return;
        }

        // Mostrar estado de carga
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');
        hideError();

        try {
            // Intentar login
            const response = await api.login(email, password);
            
            // Login exitoso
            console.log('Login exitoso:', response);
            
            // Esperar un poco para asegurar que el usuario se actualizó
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Verificar el rol del usuario
            const user = api.getUser();
            const isAdmin = api.isAdmin();
            console.log('[Auth] Usuario después de login:', user);
            console.log('[Auth] Es admin:', isAdmin);
            
            // FORZAR REDIRECCIÓN DIRECTA sin depender de RouteGuard
            const redirectUrl = isAdmin ? '/admin/' : '/home.html';
            console.log('[Auth] Redirigiendo a:', redirectUrl);
            window.location.href = redirectUrl;
            
        } catch (error) {
            console.error('Error en login:', error);
            
            // Mostrar mensaje de error apropiado
            let errorMsg = 'Error al iniciar sesión';
            
            if (error.status === 401) {
                errorMsg = 'Email o contraseña incorrectos';
            } else if (error.status === 400) {
                errorMsg = 'Datos de inicio de sesión inválidos';
            } else if (error.status === 0) {
                errorMsg = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
            } else if (error.message) {
                errorMsg = error.message;
            }
            
            showError(errorMsg);
            
        } finally {
            // Quitar estado de carga
            submitBtn.classList.remove('loading');
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
    }

    function hideError() {
        errorMessage.classList.remove('show');
    }

    // Limpiar errores cuando el usuario empiece a escribir
    document.getElementById('email').addEventListener('input', hideError);
    document.getElementById('password').addEventListener('input', hideError);
});
