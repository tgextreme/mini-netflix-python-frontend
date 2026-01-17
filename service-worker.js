// Service Worker para RustFlix PWA
// Versión: 2.0.3

const CACHE_NAME = 'rustflix-v2.0.3';
const RUNTIME_CACHE = 'rustflix-runtime-v2.0.3';

// Archivos para cachear en instalación
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/home.html',
    '/browse.html',
    '/watch.html',
    '/profile.html',
    '/css/styles.css',
    '/js/api.js',
    '/js/config.js',
    '/js/auth.js',
    '/js/home.js',
    '/js/browse.js',
    '/js/watch.js',
    '/js/profile.js',
    '/assets/favicon.svg',
    '/assets/placeholder.svg',
    '/assets/empty-state.svg',
    '/manifest.json',
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    console.log('[SW] Instalando Service Worker...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Cacheando archivos estáticos');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => {
                console.log('[SW] Instalación completa');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[SW] Error en instalación:', error);
            })
    );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    console.log('[SW] Activando Service Worker...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            // Eliminar caches antiguas
                            return cacheName !== CACHE_NAME && 
                                   cacheName !== RUNTIME_CACHE;
                        })
                        .map((cacheName) => {
                            console.log('[SW] Eliminando cache antigua:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('[SW] Activación completa');
                return self.clients.claim();
            })
    );
});

// Estrategia de fetch
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Ignorar requests que no sean HTTP/HTTPS
    if (!request.url.startsWith('http')) {
        return;
    }

    // Para peticiones de API, NO usar el service worker - dejar que pasen directamente
    if (url.pathname.startsWith('/api/')) {
        return; // No interceptar, dejar que la petición pase normalmente
    }

    // Estrategia para assets estáticos (Cache First, fallback a network)
    if (request.destination === 'image' || 
        request.destination === 'style' || 
        request.destination === 'script') {
        event.respondWith(cacheFirstStrategy(request));
        return;
    }

    // Estrategia para páginas HTML (Network First, fallback a cache)
    if (request.destination === 'document') {
        event.respondWith(networkFirstStrategy(request));
        return;
    }

    // Default: Network First
    event.respondWith(networkFirstStrategy(request));
});

// Network First Strategy
async function networkFirstStrategy(request) {
    try {
        // Intentar red primero
        const networkResponse = await fetch(request);
        
        // Si es exitoso, cachear y devolver
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // Si falla la red, buscar en cache
        console.log('[SW] Red falló, buscando en cache:', request.url);
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Si no hay cache, devolver página offline
        if (request.destination === 'document') {
            return caches.match('/index.html');
        }
        
        throw error;
    }
}

// Cache First Strategy
async function cacheFirstStrategy(request) {
    // Buscar en cache primero
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // Si no está en cache, buscar en red
    try {
        const networkResponse = await fetch(request);
        
        // Cachear para futuras requests
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('[SW] Error en cache first:', error);
        
        // Devolver placeholder si es una imagen
        if (request.destination === 'image') {
            return caches.match('/assets/placeholder.svg');
        }
        
        throw error;
    }
}

// Sincronización en background (para futuras features)
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event.tag);
    
    if (event.tag === 'sync-watch-progress') {
        event.waitUntil(syncWatchProgress());
    }
});

async function syncWatchProgress() {
    // Placeholder para sincronizar progreso de visualización
    console.log('[SW] Sincronizando progreso de visualización...');
}

// Push notifications (para futuras features)
self.addEventListener('push', (event) => {
    console.log('[SW] Push notification recibida');
    
    const options = {
        body: event.data ? event.data.text() : 'Nuevo contenido disponible',
        icon: '/assets/icon-192x192.png',
        badge: '/assets/icon-72x72.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Ver ahora',
                icon: '/assets/icon-check.png'
            },
            {
                action: 'close',
                title: 'Cerrar',
                icon: '/assets/icon-close.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('RustFlix', options)
    );
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification click:', event.action);
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/browse.html')
        );
    }
});

// Mensajes del cliente
self.addEventListener('message', (event) => {
    console.log('[SW] Mensaje recibido:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(RUNTIME_CACHE)
                .then((cache) => cache.addAll(event.data.urls))
        );
    }
});

console.log('[SW] Service Worker cargado');
