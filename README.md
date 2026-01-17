# 🎬 RustFlix Frontend - JavaScript Vanilla

Frontend moderno y completo para RustFlix usando **HTML + CSS + JavaScript puro**.

> **Versión 2.1.0** - Con PWA, i18n, seguridad mejorada, y todas las funcionalidades modernas

## ✨ Novedades v2.1.0

🆕 **Progressive Web App (PWA)** - Instalable y funciona offline  
🆕 **Internacionalización** - Español, English, Português  
🆕 **Configuración Centralizada** - Un solo lugar para toda la config  
🆕 **Seguridad Mejorada** - XSS protection, validación, rate limiting  
🆕 **Analytics** - Sistema de tracking integrado  
🆕 **Assets Profesionales** - Favicon, placeholders, empty states  
🆕 **Build System** - Script de build para producción  
🆕 **Documentación Completa** - Guías técnicas y de contribución

## 📁 Estructura del Proyecto

```
mini-netflix-python-frontend/
├── *.html                  # 11 páginas HTML
├── css/
│   └── styles.css         # Estilos globales (~1200 líneas)
├── js/
│   ├── config.js          # 🆕 Configuración centralizada
│   ├── i18n.js            # 🆕 Internacionalización
│   ├── security.js        # 🆕 Seguridad y error handling
│   ├── analytics.js       # 🆕 Analytics
│   ├── pwa-helper.js      # 🆕 PWA helper
│   ├── utils.js           # 🆕 Utilidades
│   ├── api.js             # Cliente API
│   ├── auth.js            # Autenticación
│   └── [otros].js         # Lógica de páginas
├── assets/                # 🆕 Assets visuales
│   ├── favicon.svg
│   ├── placeholder.svg
│   └── [otros].svg
├── manifest.json          # 🆕 PWA manifest
├── service-worker.js      # 🆕 Service Worker
├── build.sh               # 🆕 Build script
└── docs/                  # 🆕 Documentación completa
```

## 🚀 Características

### Core Features ✅
- ✅ **Sin frameworks** - JavaScript Vanilla puro
- ✅ **Diseño Netflix-style** - UI moderna inspirada en Netflix
- ✅ **Responsive** - Funciona en móviles, tablets y desktop
- ✅ **Autenticación JWT** - Login, registro, password reset
- ✅ **Series y Episodios** - Gestión completa de series
- ✅ **Reproductor Video** - Con subtítulos multi-idioma
- ✅ **Panel Admin** - Dashboard con estadísticas y CRUD
- ✅ **Mi Lista** - Gestión de favoritos
- ✅ **Búsqueda** - Búsqueda en tiempo real

### Nuevas Features v2.1 🆕
- 🆕 **PWA** - Instalable, funciona offline
- 🆕 **i18n** - Español, English, Português
- 🆕 **Seguridad** - XSS protection, validación, rate limiting
- 🆕 **Analytics** - Tracking de eventos
- 🆕 **Config Centralizada** - Fácil de configurar
- 🆕 **Assets** - Favicon, placeholders profesionales
- 🆕 **Error Handling** - Sistema robusto de errores
- 🆕 **Build System** - Listo para producción

## 📦 Cómo Usar

### Inicio Rápido

```bash
# Clonar el repositorio
git clone [tu-repo]
cd mini-netflix-python-frontend

# Iniciar servidor de desarrollo
python3 -m http.server 3000
# o
npm start
```

Luego abre: **http://localhost:3000**

### Opción 1: Servir con Python (Recomendado)

```bash
python3 -m http.server 3000
```

Luego abre: **http://localhost:8080**

### Opción 2: Servir con Node.js

```bash
# Instalar servidor HTTP simple
npm install -g http-server

# Iniciar servidor
http-server -p 8080
```

### Opción 3: Abrir directamente

Simplemente abre `index.html` en tu navegador (puede tener problemas con CORS).

## 🔧 Configuración

### Backend URL

Por defecto, el frontend está configurado para conectarse a:
```
http://localhost:3000
```

Si tu backend está en otra URL, edita [js/api.js](js/api.js#L3):

```javascript
const API_BASE_URL = 'http://tu-servidor:puerto';
```

## 🎨 Páginas

### 1. Login (`index.html`)
- Formulario de inicio de sesión
- Validación de email y contraseña
- Redirige a `home.html` después del login exitoso

### 2. Registro (`register.html`)
- Formulario de creación de cuenta
- Validación de campos
- Confirmación de contraseña
- Crea cuenta y redirige automáticamente

### 3. Home (`home.html`)
- Dashboard principal
- Navbar con menú
- Secciones de contenido
- Botón de logout

## 🔑 Autenticación

El sistema de autenticación funciona así:

1. **Login/Register** → Backend devuelve token JWT
2. **Token guardado** → LocalStorage del navegador
3. **Peticiones API** → Token enviado en header `Authorization: Bearer <token>`
4. **Logout** → Token eliminado del LocalStorage

## 📱 API Client (`js/api.js`)

Métodos disponibles:

```javascript
// Autenticación
await api.register(name, email, password)
await api.login(email, password)
await api.getMe()
api.logout()

// Estado
api.isAuthenticated()
api.getToken()
api.getUser()

// Futuros endpoints
await api.getTitles()
await api.getTitle(id)
await api.getWatchHistory()
```

## 🎯 Próximas Características

- [ ] Página de detalles de películas/series
- [ ] Reproductor de video
- [ ] Historial de visualización
- [ ] Lista de favoritos
- [ ] Búsqueda de contenido
- [ ] Perfil de usuario
- [ ] Múltiples perfiles
- [ ] Categorías y filtros

## 🐛 Solución de Problemas

### Error de CORS

Si ves errores de CORS en la consola:

1. Asegúrate de que el backend tenga CORS habilitado
2. Verifica que el backend esté corriendo en `localhost:3000`
3. Usa un servidor HTTP (no abras el HTML directamente)

### No se conecta al backend

1. Verifica que el backend esté corriendo:
   ```bash
   cd ../Mini-NetFlix-Python
   ./start.sh
   ```

2. Verifica la URL en `js/api.js`

3. Abre la consola del navegador (F12) para ver errores

### El token expira muy rápido

Edita la configuración del backend en `.env`:
```
JWT_EXPIRATION_HOURS=24
```

## 🎨 Personalización

### Cambiar colores

Edita las variables CSS en [css/styles.css](css/styles.css#L1):

```css
:root {
    --primary-color: #e50914;      /* Rojo Netflix */
    --primary-hover: #f40612;
    --dark-bg: #141414;
    --secondary-bg: #1f1f1f;
    /* ... más colores ... */
}
```

### Cambiar el logo

Reemplaza el emoji 🎬 en los archivos HTML con tu logo:

```html
<h1>🎬 RustFlix</h1>
<!-- Cambiar por: -->
<h1><img src="logo.png" alt="RustFlix"></h1>
```

## � Documentación

### Guías Principales
- 📖 [STATUS.md](STATUS.md) - **Estado actual del proyecto**
- 📖 [FEATURES.md](FEATURES.md) - Documentación detallada de features
- 📖 [IMPLEMENTATION.md](IMPLEMENTATION.md) - Detalles técnicos de implementación
- 📖 [CONTRIBUTING.md](CONTRIBUTING.md) - Guía para contribuir
- 📖 [TESTING.md](TESTING.md) - Guía de testing

### Documentación Adicional
- 📖 [FRONTEND_README.md](FRONTEND_README.md) - Documentación completa del frontend
- 📖 [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Estructura del proyecto
- 📖 [BACKEND_REQUIREMENTS.md](BACKEND_REQUIREMENTS.md) - Requisitos del backend
- 📖 [QUICKSTART.md](QUICKSTART.md) - Guía de inicio rápido
- 📖 [CHANGELOG.md](CHANGELOG.md) - Historial de cambios

## 🚀 Build para Producción

```bash
# Ejecutar build script
./build.sh

# Los archivos optimizados estarán en dist/
cd dist && python -m http.server 8080
```

El build script:
- Copia todos los archivos necesarios
- Genera checksums
- Prepara para deployment
- Opcionalmente minifica CSS y JS (si tienes csso y terser instalados)

## 🌟 Características Técnicas

### PWA (Progressive Web App)
- ✅ Instalable en dispositivos
- ✅ Service Worker para cache
- ✅ Funciona offline (básico)
- ✅ Actualizaciones automáticas

### Seguridad
- ✅ Sanitización de HTML (XSS prevention)
- ✅ Validación de inputs
- ✅ Rate limiting
- ✅ CSRF token support
- ✅ Error handling global

### Internacionalización
- 🇪🇸 Español
- 🇬🇧 English
- 🇧🇷 Português

### Analytics
- ✅ Page view tracking
- ✅ Event tracking
- ✅ Google Analytics ready

## 🎯 Compatibilidad

| Navegador | Versión Mínima | Estado |
|-----------|----------------|--------|
| Chrome | 90+ | ✅ |
| Firefox | 88+ | ✅ |
| Safari | 14+ | ✅ |
| Edge | 90+ | ✅ |
| Chrome Mobile | - | ✅ |
| Safari iOS | 14+ | ✅ |

## 🤝 Contribuir

¿Quieres contribuir? ¡Genial! Lee nuestra [Guía de Contribución](CONTRIBUTING.md).

## 🐛 Reportar Issues

Si encuentras un bug o tienes una sugerencia:

1. Revisa los [issues existentes](../../issues)
2. Crea un nuevo issue con descripción detallada
3. Incluye pasos para reproducir
4. Agrega screenshots si es posible

## 📊 Versiones

- **v2.1.0** (Actual) - PWA, i18n, seguridad, analytics
- **v2.0.0** - Series, subtítulos, admin panel
- **v1.0.0** - Versión inicial

## 📄 Licencia

Este proyecto es de código abierto para fines educativos. MIT License.

---

```
╔════════════════════════════════════════════════════════╗
║                                                        ║
║              🎬 RustFlix v2.1.0                       ║
║                                                        ║
║         Frontend Completo y Profesional               ║
║                                                        ║
║   ✅ PWA  ✅ i18n  ✅ Security  ✅ Analytics          ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

**¡Disfruta construyendo tu Netflix clone! 🍿**
