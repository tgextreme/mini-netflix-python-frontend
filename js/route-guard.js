// route-guard.js - Sistema de protección y redirección de rutas

/**
 * Configuración de rutas y sus requisitos de autenticación
 */
const ROUTES_CONFIG = {
    // Rutas públicas (no requieren autenticación)
    public: [
        'index.html',
        'register.html',
        'forgot-password.html',
        'reset-password.html',
        ''  // raíz
    ],
    
    // Rutas que requieren autenticación de usuario
    authenticated: [
        'home.html',
        'browse.html',
        'series.html',
        'watch.html',
        'profile.html',
        'my-list.html'
    ],
    
    // Rutas que requieren rol de administrador (bajo /admin/)
    admin: [
        'admin/index.html',
        'admin/content.html',
        'admin/users.html',
        'admin/',
        // También soportar rutas antiguas para redirección
        'admin.html',
        'admin-content.html',
        'admin-users.html'
    ]
};

/**
 * Obtiene la página actual del path
 * @returns {string} Nombre de la página actual con path completo para admin
 */
function getCurrentPage() {
    const path = window.location.pathname;
    // Si es admin, mantener el path completo (admin/index.html, admin/content.html, etc)
    if (path.includes('/admin/')) {
        return path.replace(/^\//, ''); // Quitar el / inicial
    }
    const page = path.split('/').pop() || 'index.html';
    return page;
}

/**
 * Verifica si una página es pública
 * @param {string} page Nombre de la página
 * @returns {boolean}
 */
function isPublicPage(page) {
    return ROUTES_CONFIG.public.includes(page) || page === '';
}

/**
 * Verifica si una página requiere autenticación
 * @param {string} page Nombre de la página
 * @returns {boolean}
 */
function isAuthenticatedPage(page) {
    return ROUTES_CONFIG.authenticated.includes(page);
}

/**
 * Verifica si una página requiere rol de admin
 * @param {string} page Nombre de la página
 * @returns {boolean}
 */
function isAdminPage(page) {
    return ROUTES_CONFIG.admin.includes(page);
}

/**
 * Redirige a la página correcta según el estado de autenticación y rol
 * @param {string} targetPage Página de destino (opcional)
 */
function redirectToAppropiatePage(targetPage = null) {
    const currentPage = getCurrentPage();
    const isAuthenticated = api && api.isAuthenticated();
    const isAdmin = api && api.isAdmin();
    
    console.log('[RouteGuard] Verificando acceso:', {
        currentPage,
        isAuthenticated,
        isAdmin,
        targetPage
    });
    
    // Si hay una página de destino específica, redirigir ahí
    if (targetPage) {
        window.location.href = targetPage;
        return;
    }
    
    // Si está en una página pública y está autenticado, redirigir según rol
    if (isPublicPage(currentPage) && isAuthenticated) {
        const redirectPage = isAdmin ? '/admin/' : 'home.html';
        console.log(`[RouteGuard] Usuario autenticado en página pública. Redirigiendo a ${redirectPage}`);
        window.location.href = redirectPage;
        return;
    }
    
    // Si está en una página de admin sin permisos
    if (isAdminPage(currentPage)) {
        if (!isAuthenticated) {
            console.log('[RouteGuard] Página admin sin autenticación. Redirigiendo a login');
            window.location.href = 'index.html';
            return;
        }
        if (!isAdmin) {
            console.log('[RouteGuard] Página admin sin permisos. Redirigiendo a home');
            window.location.href = 'home.html';
            return;
        }
    }
    
    // Si está en una página autenticada sin login
    if (isAuthenticatedPage(currentPage) && !isAuthenticated) {
        console.log('[RouteGuard] Página autenticada sin login. Redirigiendo a login');
        window.location.href = 'index.html';
        return;
    }
}

/**
 * Redirige después de un login exitoso según el rol del usuario
 */
function redirectAfterLogin() {
    const isAdmin = api && api.isAdmin();
    const targetPage = isAdmin ? '/admin/' : 'home.html';
    
    console.log(`[RouteGuard] Login exitoso. Redirigiendo a ${targetPage}`);
    window.location.href = targetPage;
}

/**
 * Inicializa el sistema de protección de rutas
 * Debe ser llamado en todas las páginas
 */
function initRouteGuard() {
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            redirectToAppropiatePage();
        });
    } else {
        redirectToAppropiatePage();
    }
}

/**
 * Verifica permisos de admin y muestra alerta si no tiene acceso
 * Actualiza los datos del usuario si es necesario
 * @returns {boolean} True si tiene permisos de admin
 */
async function requireAdmin() {
    if (!api || !api.isAuthenticated()) {
        alert('Debes iniciar sesión para acceder a esta página');
        window.location.href = '/index.html';
        return false;
    }
    
    // Si el usuario no tiene el campo role, actualizarlo desde el servidor
    const user = api.getUser();
    if (!user || !user.role) {
        try {
            const userData = await api.getMe();
            api.saveUser(userData);
        } catch (error) {
            console.error('Error al actualizar datos del usuario:', error);
        }
    }
    
    if (!api.isAdmin()) {
        alert('No tienes permisos de administrador para acceder a esta página');
        window.location.href = '/home.html';
        return false;
    }
    
    return true;
}

/**
 * Verifica que el usuario esté autenticado
 * @returns {boolean} True si está autenticado
 */
function requireAuth() {
    if (!api || !api.isAuthenticated()) {
        alert('Debes iniciar sesión para acceder a esta página');
        window.location.href = '/index.html';
        return false;
    }
    
    return true;
}

// Exportar funciones
if (typeof window !== 'undefined') {
    window.RouteGuard = {
        init: initRouteGuard,
        redirectAfterLogin,
        redirectToAppropiatePage,
        requireAdmin,
        requireAuth,
        isPublicPage,
        isAuthenticatedPage,
        isAdminPage
    };
}
