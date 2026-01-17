// Analytics Helper - Para futura integración con Google Analytics, Mixpanel, etc.

class Analytics {
    constructor() {
        this.enabled = CONFIG.FEATURES.ENABLE_ANALYTICS;
        this.events = [];
        this.sessionId = this.generateSessionId();
        this.userId = null;
        
        if (this.enabled) {
            this.init();
        }
    }

    init() {
        console.log('📊 Analytics initialized');
        
        // Cargar Google Analytics si está configurado
        if (CONFIG.ANALYTICS.GOOGLE_ANALYTICS_ID) {
            this.loadGoogleAnalytics();
        }
        
        // Track page view inicial
        if (CONFIG.ANALYTICS.TRACK_PAGE_VIEWS) {
            this.trackPageView();
        }
        
        // Track navegación
        this.setupNavigationTracking();
    }

    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    loadGoogleAnalytics() {
        // Implementar carga de GA4
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.ANALYTICS.GOOGLE_ANALYTICS_ID}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', CONFIG.ANALYTICS.GOOGLE_ANALYTICS_ID);
    }

    setupNavigationTracking() {
        // Track navegación con History API
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        history.pushState = (...args) => {
            originalPushState.apply(history, args);
            this.trackPageView();
        };
        
        history.replaceState = (...args) => {
            originalReplaceState.apply(history, args);
            this.trackPageView();
        };
        
        window.addEventListener('popstate', () => {
            this.trackPageView();
        });
    }

    setUserId(userId) {
        this.userId = userId;
        if (window.gtag) {
            gtag('set', { user_id: userId });
        }
    }

    trackPageView(page = window.location.pathname) {
        if (!this.enabled) return;
        
        const event = {
            type: 'page_view',
            page,
            title: document.title,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
        };
        
        this.events.push(event);
        
        if (window.gtag) {
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
                page_path: page,
            });
        }
        
        if (CONFIG.DEBUG) {
            console.log('📊 Page view:', event);
        }
    }

    trackEvent(category, action, label = '', value = 0) {
        if (!this.enabled) return;
        
        const event = {
            type: 'event',
            category,
            action,
            label,
            value,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
        };
        
        this.events.push(event);
        
        if (window.gtag) {
            gtag('event', action, {
                event_category: category,
                event_label: label,
                value: value,
            });
        }
        
        if (CONFIG.DEBUG) {
            console.log('📊 Event:', event);
        }
    }

    // Eventos predefinidos
    trackContentView(contentId, contentType, contentTitle) {
        this.trackEvent('Content', 'view', `${contentType}:${contentTitle}`, contentId);
    }

    trackContentPlay(contentId, contentType, contentTitle) {
        this.trackEvent('Content', 'play', `${contentType}:${contentTitle}`, contentId);
    }

    trackContentComplete(contentId, contentType, watchTime) {
        this.trackEvent('Content', 'complete', contentType, watchTime);
    }

    trackSearch(query, results) {
        this.trackEvent('Search', 'query', query, results);
    }

    trackAddToList(contentId, contentTitle) {
        this.trackEvent('List', 'add', contentTitle, contentId);
    }

    trackRemoveFromList(contentId, contentTitle) {
        this.trackEvent('List', 'remove', contentTitle, contentId);
    }

    trackRating(contentId, rating) {
        this.trackEvent('Rating', 'submit', String(contentId), rating);
    }

    trackLogin(method = 'email') {
        this.trackEvent('Auth', 'login', method);
    }

    trackRegister(method = 'email') {
        this.trackEvent('Auth', 'register', method);
    }

    trackError(errorType, errorMessage) {
        this.trackEvent('Error', errorType, errorMessage);
    }

    // Obtener todos los eventos
    getEvents() {
        return [...this.events];
    }

    // Limpiar eventos
    clearEvents() {
        this.events = [];
    }
}

// Inicializar analytics
const analytics = new Analytics();

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Analytics, analytics };
}
