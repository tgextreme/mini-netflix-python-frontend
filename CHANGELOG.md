# 🎬 RustFlix - Mini Netflix Frontend (Versión Completa)

Frontend completo para la aplicación Mini-Netflix con todas las funcionalidades esenciales implementadas.

## 🌟 Características Implementadas

### ✅ **Prioridad Alta (Completado)**

#### 1. **Gestión de Episodios y Temporadas** 📺
- ✅ Página dedicada para detalles de series (`series.html`)
- ✅ Visualización de temporadas y episodios
- ✅ Selector de temporadas
- ✅ Tarjetas de episodios con thumbnails
- ✅ Reproducción de episodios específicos
- ✅ Navegación automática entre episodios
- ✅ API endpoints completos para series/temporadas/episodios

#### 2. **Sistema de Subtítulos** 🗣️
- ✅ Soporte de múltiples idiomas
- ✅ Carga dinámica de subtítulos desde el backend
- ✅ Integración con HTML5 video player
- ✅ Selector de idioma de subtítulos
- ✅ API endpoints para gestión de subtítulos

#### 3. **Recuperación de Contraseña** 🔑
- ✅ Página "Olvidé mi contraseña" (`forgot-password.html`)
- ✅ Página de restablecimiento (`reset-password.html`)
- ✅ Envío de email con token de recuperación
- ✅ Validación de tokens
- ✅ Cambio de contraseña seguro
- ✅ Enlace en página de login

#### 4. **Panel de Administración** 👨‍💼
- ✅ Dashboard con estadísticas (`admin.html`)
- ✅ Gestión completa de contenido (`admin-content.html`)
- ✅ CRUD de películas y series
- ✅ Estadísticas de visualización
- ✅ Lista de usuarios recientes
- ✅ Métricas del sistema
- ✅ Protección por roles de usuario

---

## 📁 Estructura Actualizada del Proyecto

```
mini-netflix-python-frontend/
├── index.html                  # Login
├── register.html               # Registro
├── forgot-password.html        # ⭐ NUEVO: Recuperar contraseña
├── reset-password.html         # ⭐ NUEVO: Restablecer contraseña
├── home.html                   # Página principal
├── browse.html                 # Explorar contenido
├── series.html                 # ⭐ NUEVO: Detalles de serie con episodios
├── watch.html                  # Reproductor (actualizado con subtítulos)
├── profile.html                # Perfil y Mi Lista
├── admin.html                  # ⭐ NUEVO: Panel admin - Dashboard
├── admin-content.html          # ⭐ NUEVO: Panel admin - Contenido
├── css/
│   └── styles.css             # Estilos (actualizado con nuevos componentes)
└── js/
    ├── api.js                 # ⭐ ACTUALIZADO: Nuevos endpoints
    ├── auth.js                # Autenticación
    ├── register.js            # Registro
    ├── forgot-password.js     # ⭐ NUEVO: Recuperación de contraseña
    ├── reset-password.js      # ⭐ NUEVO: Restablecer contraseña
    ├── home.js                # ⭐ ACTUALIZADO: Navegación a series
    ├── browse.js              # ⭐ ACTUALIZADO: Navegación a series
    ├── series.js              # ⭐ NUEVO: Gestión de series/episodios
    ├── watch.js               # ⭐ ACTUALIZADO: Episodios y subtítulos
    ├── profile.js             # Perfil
    ├── admin.js               # ⭐ NUEVO: Dashboard admin
    └── admin-content.js       # ⭐ NUEVO: Gestión de contenido admin
```

---

## 🆕 Nuevos Endpoints de API

### Episodios y Temporadas
```javascript
await api.getSeasons(titleId)
await api.getSeason(titleId, seasonNumber)
await api.getEpisodes(titleId, seasonNumber)
await api.getEpisode(titleId, seasonNumber, episodeNumber)
```

### Subtítulos
```javascript
await api.getSubtitles(titleId, episodeId)
```

### Recuperación de Contraseña
```javascript
await api.requestPasswordReset(email)
await api.resetPassword(token, newPassword)
await api.changePassword(currentPassword, newPassword)
```

### Administración - Contenido
```javascript
await api.createTitle(titleData)
await api.updateTitle(titleId, titleData)
await api.deleteTitle(titleId)
await api.createEpisode(titleId, seasonNumber, episodeData)
await api.updateEpisode(titleId, seasonNumber, episodeNumber, episodeData)
await api.deleteEpisode(titleId, seasonNumber, episodeNumber)
```

### Administración - Usuarios
```javascript
await api.getAllUsers(params)
await api.getUser(userId)
await api.updateUser(userId, userData)
await api.deleteUser(userId)
```

### Administración - Estadísticas
```javascript
await api.getAdminStats()
await api.getViewStats(params)
api.isAdmin() // Verificar permisos
```

---

## 🎯 Flujos de Usuario Principales

### 1. **Recuperación de Contraseña**
1. Usuario hace clic en "¿Olvidaste tu contraseña?" en login
2. Ingresa su email en `forgot-password.html`
3. Backend envía email con token
4. Usuario hace clic en enlace del email → `reset-password.html?token=...`
5. Ingresa nueva contraseña
6. Redirige al login

### 2. **Navegación de Series**
1. Usuario ve una serie en home o browse
2. Hace clic → Redirige a `series.html?id=123`
3. Ve información de la serie, temporadas y episodios
4. Selecciona temporada del dropdown
5. Hace clic en episodio → `watch.html?id=123&season=1&episode=1`
6. Reproduce con subtítulos si están disponibles

### 3. **Administración de Contenido**
1. Admin accede a `admin.html`
2. Ve dashboard con estadísticas
3. Navega a "Contenido" → `admin-content.html`
4. Puede crear, editar o eliminar títulos
5. Para series, puede gestionar episodios por temporada

---

## 🔐 Sistema de Roles

El frontend ahora soporta roles de usuario:

```javascript
// En api.js
isAdmin() {
    const user = this.getUser();
    return user && (user.is_admin || user.role === 'admin');
}
```

Páginas protegidas:
- `admin.html` - Solo administradores
- `admin-content.html` - Solo administradores

---

## 🎨 Nuevos Componentes CSS

### Episodios de Series
```css
.episode-card
.episode-thumbnail
.episode-play-overlay
.season-select
```

### Panel Admin
```css
.stats-grid
.stat-card
.admin-list
.admin-table
.admin-form
.btn-icon
```

---

## 🚀 Cómo Usar las Nuevas Funcionalidades

### Reproducir un Episodio
```javascript
// URL: watch.html?id=123&season=1&episode=5
// El reproductor detecta automáticamente que es un episodio
```

### Agregar Subtítulos
Los subtítulos se cargan automáticamente del backend:
```javascript
// Backend debe devolver:
{
  "subtitles": [
    {
      "language": "es",
      "language_name": "Español",
      "url": "https://url-to-subtitle.vtt"
    }
  ]
}
```

### Crear Contenido como Admin
1. Accede a `admin-content.html`
2. Clic en "➕ Agregar Título"
3. Completa el formulario
4. Guarda

---

## 🐛 Actualizaciones de Debugging

### Verificar si es Admin
```javascript
console.log('Is admin:', api.isAdmin());
```

### Ver Datos de Serie
```javascript
const seasons = await api.getSeasons(titleId);
console.log('Seasons:', seasons);
```

### Probar Recuperación de Contraseña
```javascript
await api.requestPasswordReset('user@example.com');
// Revisa el backend para el token generado
```

---

## 📝 Notas de Backend Requerido

Para que estas funcionalidades funcionen, el backend debe implementar:

### Endpoints de Series/Episodios
```
GET    /api/titles/:id/seasons
GET    /api/titles/:id/seasons/:season
GET    /api/titles/:id/seasons/:season/episodes
GET    /api/titles/:id/seasons/:season/episodes/:episode
```

### Endpoints de Subtítulos
```
GET    /api/subtitles/:titleId
GET    /api/subtitles/:titleId/episode/:episodeId
```

### Endpoints de Recuperación de Contraseña
```
POST   /api/users/password-reset/request
POST   /api/users/password-reset/confirm
POST   /api/users/change-password
```

### Endpoints de Admin
```
POST   /api/admin/titles
PUT    /api/admin/titles/:id
DELETE /api/admin/titles/:id
GET    /api/admin/users
GET    /api/admin/stats
GET    /api/admin/stats/views
```

---

## ✅ Testing Checklist

- [ ] Crear cuenta nueva
- [ ] Olvidar contraseña y recuperarla
- [ ] Ver serie y navegar por episodios
- [ ] Reproducir episodio con subtítulos
- [ ] Acceder como admin
- [ ] Crear/editar/eliminar contenido
- [ ] Ver estadísticas del sistema

---

## 🎉 ¡Funcionalidades Completadas!

Todas las funcionalidades de **Prioridad Alta** han sido implementadas:

✅ Gestión de episodios y temporadas
✅ Sistema de subtítulos
✅ Recuperación de contraseña
✅ Panel de administración básico

El frontend está listo para conectarse con el backend una vez que se implementen los endpoints correspondientes.

---

**Desarrollado con ❤️ para Mini-Netflix**
**Versión 2.0 - Enero 2026**
