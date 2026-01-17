// PWA Helper - Registro y gestión del Service Worker

class PWAHelper {
    constructor() {
        this.registration = null;
        this.isOnline = navigator.onLine;
        this.deferredPrompt = null;
        
        this.init();
    }

    async init() {
        // TEMPORAL: Desregistrar todos los Service Workers para evitar problemas
        if ('serviceWorker' in navigator) {
            try {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (const registration of registrations) {
                    await registration.unregister();
                    console.log('✅ Service Worker desregistrado');
                }
                
                // Limpiar todos los caches
                const cacheNames = await caches.keys();
                for (const cacheName of cacheNames) {
                    await caches.delete(cacheName);
                    console.log('✅ Cache eliminado:', cacheName);
                }
            } catch (error) {
                console.error('❌ Error desregistrando Service Workers:', error);
            }
        }

        // Escuchar cambios de conectividad
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());

        // Capturar evento de instalación
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        // Detectar si ya está instalado
        window.addEventListener('appinstalled', () => {
            console.log('✅ PWA instalada');
            this.deferredPrompt = null;
        });
    }

    handleUpdate() {
        const newWorker = this.registration.installing;
        
        newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Hay una nueva versión disponible
                this.showUpdateNotification();
            }
        });
    }

    showUpdateNotification() {
        const updateBanner = document.createElement('div');
        updateBanner.className = 'update-banner';
        updateBanner.innerHTML = `
            <p>🎉 Nueva versión disponible</p>
            <button onclick="pwaHelper.updateApp()">Actualizar</button>
            <button onclick="this.parentElement.remove()">Ahora no</button>
        `;
        document.body.appendChild(updateBanner);
    }

    updateApp() {
        if (this.registration && this.registration.waiting) {
            this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
        }
    }

    handleOnline() {
        this.isOnline = true;
        console.log('🌐 Conectado a internet');
        
        // Mostrar notificación
        this.showToast('Conectado a internet', 'success');
        
        // Intentar sincronizar datos pendientes
        this.syncPendingData();
    }

    handleOffline() {
        this.isOnline = false;
        console.log('📵 Sin conexión a internet');
        
        // Mostrar notificación
        this.showToast('Modo sin conexión activado', 'info');
    }

    async syncPendingData() {
        // Sincronizar watch progress, ratings, etc.
        if ('sync' in this.registration) {
            try {
                await this.registration.sync.register('sync-watch-progress');
                console.log('🔄 Sincronización registrada');
            } catch (error) {
                console.error('Error registrando sync:', error);
            }
        }
    }

    showInstallButton() {
        const installButton = document.getElementById('installPWA');
        if (installButton) {
            installButton.style.display = 'block';
            installButton.addEventListener('click', () => this.installPWA());
        }
    }

    async installPWA() {
        if (!this.deferredPrompt) {
            return;
        }

        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        
        console.log(`Usuario ${outcome === 'accepted' ? 'aceptó' : 'rechazó'} la instalación`);
        
        this.deferredPrompt = null;
        
        const installButton = document.getElementById('installPWA');
        if (installButton) {
            installButton.style.display = 'none';
        }
    }

    showToast(message, type = 'info') {
        // Crear toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Animar entrada
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Pre-cache URLs importantes
    async precacheURLs(urls) {
        if (this.registration && this.registration.active) {
            this.registration.active.postMessage({
                type: 'CACHE_URLS',
                urls: urls
            });
        }
    }

    // Limpiar caches antiguas
    async clearOldCaches() {
        const cacheNames = await caches.keys();
        const currentVersion = 'v2.0.0';
        
        await Promise.all(
            cacheNames
                .filter(name => !name.includes(currentVersion))
                .map(name => caches.delete(name))
        );
    }

    // Check si estamos en modo standalone (app instalada)
    isStandalone() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone ||
               document.referrer.includes('android-app://');
    }
}

// Inicializar PWA Helper
let pwaHelper;
if (typeof CONFIG !== 'undefined' && CONFIG.FEATURES.ENABLE_PWA) {
    pwaHelper = new PWAHelper();
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PWAHelper };
}
