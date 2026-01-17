# 🎬 RustFlix - Mini Netflix Frontend

Frontend moderno para la aplicación Mini-Netflix construido con HTML5, CSS3 y JavaScript vanilla.

## 🌟 Características Principales

### ✨ Interfaz de Usuario
- Diseño moderno estilo Netflix con tema oscuro
- Totalmente responsive (móvil, tablet, desktop)
- Animaciones suaves y transiciones
- Modales informativos y notificaciones toast

### 🔐 Autenticación
- Sistema completo de login y registro
- Gestión de sesiones con JWT
- Protección de rutas
- Persistencia de sesión

### 🎥 Exploración de Contenido
- Catálogo completo de películas y series
- Búsqueda en tiempo real
- Filtros por tipo (películas/series)
- Contenido en tendencia
- Recomendaciones personalizadas

### ▶️ Reproducción
- Reproductor de video HTML5
- Seguimiento automático de progreso
- Reanudar desde donde lo dejaste
- Sistema de calificaciones con estrellas

### 👤 Gestión de Usuario
- Mi Lista (añadir/eliminar contenido)
- Historial de visualización completo
- Sección "Continuar viendo"
- Soporte para múltiples perfiles
- Perfiles infantiles

## 📁 Estructura del Proyecto

```
mini-netflix-python-frontend/
├── index.html              # Login
├── register.html           # Registro
├── home.html              # Página principal
├── browse.html            # Explorar contenido
├── watch.html             # Reproductor
├── profile.html           # Perfil y Mi Lista
├── css/
│   └── styles.css         # Estilos globales
└── js/
    ├── api.js             # Cliente API
    ├── auth.js            # Autenticación
    ├── register.js        # Registro
    ├── home.js            # Página principal
    ├── browse.js          # Exploración
    ├── watch.js           # Reproductor
    └── profile.js         # Perfil
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Backend corriendo en `http://localhost:8000`
- Navegador web moderno

### Instalación

**Opción 1: Python**
```bash
cd mini-netflix-python-frontend
python -m http.server 3000
```

**Opción 2: Node.js**
```bash
npx http-server -p 3000
```

**Opción 3: PHP**
```bash
php -S localhost:3000
```

Luego abre `http://localhost:3000` en tu navegador.

### Configuración

Si tu backend está en otra URL, edita `js/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000'; // Cambia esto
```

## 📖 Uso

1. **Registro**: Crea una cuenta nueva
2. **Login**: Inicia sesión
3. **Explorar**: Navega el catálogo
4. **Reproducir**: Ve películas y series
5. **Mi Lista**: Guarda tus favoritos
6. **Perfiles**: Crea múltiples perfiles

## 🔌 API Cliente

### Autenticación
```javascript
await api.register(email, password, name);
await api.login(email, password);
await api.logout();
```

### Contenido
```javascript
await api.getTitles(params);
await api.searchTitles(query);
await api.getTrendingTitles(10);
```

### Mi Lista
```javascript
await api.addToMyList(titleId);
await api.removeFromMyList(titleId);
```

### Progreso
```javascript
await api.addWatchProgress(titleId, seconds, total);
await api.getContinueWatching(10);
```

## 🎨 Personalización

### Colores

Edita las variables CSS en `css/styles.css`:

```css
:root {
    --primary-color: #e50914;
    --dark-bg: #141414;
    --text-primary: #ffffff;
    /* ... más variables */
}
```

### Responsive

Breakpoints configurados:
- Móvil: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px

## 🐛 Solución de Problemas

**No conecta al backend**
- Verifica que el backend esté en `localhost:8000`
- Revisa CORS en el backend
- Mira la consola del navegador

**Error de autenticación**
- Limpia localStorage
- Vuelve a iniciar sesión

**Video no reproduce**
- Verifica URL del video
- Comprueba formato (MP4 recomendado)

## 📱 Compatibilidad

### Navegadores
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Tecnologías
- ES6+ JavaScript
- Fetch API
- LocalStorage
- HTML5 Video

## 🔐 Seguridad

- Tokens JWT en LocalStorage
- Validación de formularios
- Sanitización de datos
- HTTPS recomendado en producción

## 🚀 Producción

1. Actualiza `API_BASE_URL` a tu URL de producción
2. Habilita HTTPS
3. Configura CORS
4. Minifica CSS/JS
5. Usa CDN para assets

### Hosting Recomendado
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

## 📄 Licencia

Parte del proyecto Mini-Netflix-Python-Backend.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch
3. Commit tus cambios
4. Push a la branch
5. Abre un Pull Request

---

**Desarrollado con ❤️ para Mini-Netflix**
