// Configuración centralizada de la aplicación

const CONFIG = {
    // API Configuration
    API: {
        BASE_URL: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
            ? 'http://127.0.0.1:3000' 
            : 'https://your-production-api.com',
        TIMEOUT: 30000, // 30 segundos
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000, // 1 segundo
    },

    // App Settings
    APP: {
        NAME: 'RustFlix',
        VERSION: '2.0.0',
        LANGUAGE: 'es',
        THEME: 'dark',
    },

    // Storage Keys
    STORAGE: {
        TOKEN: 'token',
        USER: 'user',
        PROFILE_ID: 'profile_id',
        LANGUAGE: 'language',
        THEME: 'theme',
        SUBTITLES_PREFERENCE: 'subtitles_preference',
    },

    // Video Player Settings
    PLAYER: {
        AUTOPLAY: true,
        VOLUME_DEFAULT: 0.7,
        PLAYBACK_RATES: [0.5, 0.75, 1, 1.25, 1.5, 2],
        SUBTITLE_SIZE_DEFAULT: 'medium',
        PROGRESS_UPDATE_INTERVAL: 10000, // 10 segundos
        MIN_WATCH_TIME_SECONDS: 30, // Tiempo mínimo para registrar visto
    },

    // Pagination
    PAGINATION: {
        ITEMS_PER_PAGE: 20,
        MAX_PAGES_SHOWN: 5,
    },

    // Search
    SEARCH: {
        MIN_QUERY_LENGTH: 2,
        DEBOUNCE_DELAY: 500, // ms
    },

    // UI Settings
    UI: {
        TOAST_DURATION: 3000, // ms
        MODAL_ANIMATION_DURATION: 300, // ms
        LOADING_MIN_DISPLAY: 500, // ms mínimo para mostrar loading
    },

    // Validation
    VALIDATION: {
        EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        PASSWORD_MIN_LENGTH: 6,
        PASSWORD_MAX_LENGTH: 128,
        NAME_MIN_LENGTH: 2,
        NAME_MAX_LENGTH: 100,
    },

    // Content Types
    CONTENT_TYPES: {
        MOVIE: 'movie',
        SERIES: 'series',
    },

    // User Roles
    ROLES: {
        USER: 'user',
        ADMIN: 'admin',
    },

    // Ratings
    RATINGS: {
        MIN: 1,
        MAX: 5,
        DEFAULT: 0,
    },

    // File Upload (para futuros features)
    UPLOAD: {
        MAX_SIZE_MB: 10,
        ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
        ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm'],
        ALLOWED_SUBTITLE_TYPES: ['text/vtt', 'text/srt'],
    },

    // Error Messages (Centralizados)
    ERRORS: {
        NETWORK: 'Error de conexión. Por favor verifica tu internet.',
        UNAUTHORIZED: 'Sesión expirada. Por favor inicia sesión nuevamente.',
        FORBIDDEN: 'No tienes permisos para realizar esta acción.',
        NOT_FOUND: 'El recurso solicitado no fue encontrado.',
        SERVER_ERROR: 'Error del servidor. Por favor intenta más tarde.',
        VALIDATION: 'Los datos proporcionados no son válidos.',
        GENERIC: 'Ocurrió un error inesperado. Por favor intenta nuevamente.',
    },

    // Success Messages
    SUCCESS: {
        LOGIN: '¡Bienvenido!',
        REGISTER: 'Cuenta creada exitosamente.',
        PASSWORD_RESET_REQUEST: 'Se ha enviado un email con instrucciones.',
        PASSWORD_RESET: 'Contraseña actualizada correctamente.',
        ADD_TO_LIST: 'Agregado a Mi Lista.',
        REMOVE_FROM_LIST: 'Eliminado de Mi Lista.',
        RATING_SAVED: 'Calificación guardada.',
        CONTENT_CREATED: 'Contenido creado exitosamente.',
        CONTENT_UPDATED: 'Contenido actualizado exitosamente.',
        CONTENT_DELETED: 'Contenido eliminado exitosamente.',
    },

    // Feature Flags (para habilitar/deshabilitar features)
    FEATURES: {
        ENABLE_PWA: true,
        ENABLE_ANALYTICS: false,
        ENABLE_ERROR_TRACKING: false,
        ENABLE_OFFLINE_MODE: true,
        ENABLE_SUBTITLES: true,
        ENABLE_RECOMMENDATIONS: true,
        ENABLE_SOCIAL_SHARE: false,
        ENABLE_DOWNLOAD: false,
    },

    // Debug Mode
    DEBUG: window.location.hostname === 'localhost',

    // Analytics (para futura integración)
    ANALYTICS: {
        GOOGLE_ANALYTICS_ID: '',
        TRACK_PAGE_VIEWS: true,
        TRACK_EVENTS: true,
    },

    // SEO & Meta
    SEO: {
        DEFAULT_TITLE: 'RustFlix - Tu plataforma de streaming',
        DEFAULT_DESCRIPTION: 'Disfruta de las mejores películas y series en RustFlix',
        DEFAULT_IMAGE: '/assets/og-image.jpg',
        DEFAULT_KEYWORDS: 'streaming, películas, series, rustflix',
    },
};

// Función helper para obtener configuración
function getConfig(path) {
    const keys = path.split('.');
    let value = CONFIG;
    
    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return undefined;
        }
    }
    
    return value;
}

// Log de configuración en modo debug
if (CONFIG.DEBUG) {
    console.log('🔧 CONFIG loaded:', CONFIG);
}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, getConfig };
}
