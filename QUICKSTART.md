# 🚀 Guía de Inicio Rápido - RustFlix Frontend v2.0

## ✅ Requisitos Previos

- **Backend**: Debe estar corriendo en `http://localhost:8000`
- **Python 3** o **Node.js** instalado (para servidor HTTP)
- **Navegador moderno**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

---

## 📦 Instalación

### 1. Clonar o ubicar el proyecto
```bash
cd /home/usuario/proyectos/NetFlix/mini-netflix-python-frontend
```

### 2. No requiere instalación de dependencias
Este es un proyecto frontend puro (HTML/CSS/JS vanilla), no necesita npm install.

---

## 🏃 Ejecutar el Proyecto

### Opción 1: Python (Recomendado)
```bash
python -m http.server 3000
# o
python3 -m http.server 3000
```

### Opción 2: Node.js
```bash
npx http-server -p 3000 -c-1
```

### Opción 3: NPM Scripts
```bash
npm start     # Python server
npm run serve # http-server (Node)
npm run dev   # live-server con hot reload
```

### Opción 4: PHP
```bash
php -S localhost:3000
```

---

## 🌐 Acceder a la Aplicación

Una vez iniciado el servidor, abre tu navegador en:

```
http://localhost:3000
```

---

## 👥 Cuentas de Prueba

### Usuario Regular
```
Email: user@example.com
Contraseña: password123
```

### Administrador (para panel admin)
```
Email: admin@example.com
Contraseña: admin123
```

> **Nota**: Estas cuentas deben existir en tu backend. Si no, créalas mediante el endpoint de registro.

---

## 📄 Páginas Disponibles

### Páginas Públicas (sin autenticación)
- **Login**: `http://localhost:3000/index.html`
- **Registro**: `http://localhost:3000/register.html`
- **Recuperar Contraseña**: `http://localhost:3000/forgot-password.html`
- **Restablecer Contraseña**: `http://localhost:3000/reset-password.html?token=XXX`

### Páginas Autenticadas (requieren login)
- **Home/Dashboard**: `http://localhost:3000/home.html`
- **Explorar Catálogo**: `http://localhost:3000/browse.html`
- **Detalles de Serie**: `http://localhost:3000/series.html?id=123`
- **Reproductor**: `http://localhost:3000/watch.html?id=123`
- **Reproductor (Episodio)**: `http://localhost:3000/watch.html?id=123&season=1&episode=1`
- **Perfil**: `http://localhost:3000/profile.html`

### Páginas Admin (requieren rol de administrador)
- **Dashboard Admin**: `http://localhost:3000/admin.html`
- **Gestión de Contenido**: `http://localhost:3000/admin-content.html`

---

## 🧪 Probar las Nuevas Funcionalidades

### 1. Gestión de Series y Episodios

**a) Ver una serie:**
1. Ve a `home.html` o `browse.html`
2. Haz clic en cualquier serie (icono 📺)
3. Serás redirigido a `series.html`
4. Verás las temporadas y episodios disponibles

**b) Reproducir un episodio:**
1. En `series.html`, selecciona una temporada
2. Haz clic en un episodio
3. Se abrirá el reproductor con el episodio específico

**c) Verificar URL de episodio:**
```
http://localhost:3000/watch.html?id=123&season=1&episode=5
```

### 2. Sistema de Subtítulos

**a) En el reproductor:**
1. Reproduce cualquier video
2. Los subtítulos se cargan automáticamente si están disponibles
3. Usa el selector nativo del navegador (botón CC) para cambiar idioma

**b) Probar manualmente:**
- Los subtítulos aparecen como `<track>` elements en el HTML5 video
- Inspecciona el video player en DevTools para verlos

### 3. Recuperación de Contraseña

**a) Solicitar reset:**
1. En `index.html`, haz clic en "¿Olvidaste tu contraseña?"
2. Ingresa tu email
3. El backend enviará un email con token

**b) Restablecer:**
1. Copia el token del email (o logs del backend)
2. Ve a: `http://localhost:3000/reset-password.html?token=TU_TOKEN`
3. Ingresa nueva contraseña
4. Serás redirigido al login

**c) URL de ejemplo:**
```
http://localhost:3000/reset-password.html?token=abc123-def456-ghi789
```

### 4. Panel de Administración

**a) Acceder al dashboard:**
1. Inicia sesión con cuenta de administrador
2. Ve a `http://localhost:3000/admin.html`
3. Verás estadísticas del sistema

**b) Gestionar contenido:**
1. En admin, navega a "Contenido"
2. Verás lista de todas las películas/series
3. Puedes:
   - ➕ Crear nuevo título
   - ✏️ Editar existente
   - 🗑️ Eliminar título
   - 🔍 Buscar y filtrar

---

## 🔍 Testing Checklist

### Funcionalidades Básicas
- [ ] Registrar nueva cuenta
- [ ] Iniciar sesión
- [ ] Ver catálogo en home
- [ ] Buscar contenido
- [ ] Reproducir película
- [ ] Añadir a Mi Lista
- [ ] Ver perfil
- [ ] Cerrar sesión

### Nuevas Funcionalidades (v2.0)
- [ ] Ver detalles de una serie
- [ ] Navegar entre temporadas
- [ ] Reproducir un episodio
- [ ] Ver subtítulos en reproductor
- [ ] Cambiar idioma de subtítulos
- [ ] Solicitar recuperación de contraseña
- [ ] Restablecer contraseña con token
- [ ] Acceder al panel admin
- [ ] Ver estadísticas en dashboard
- [ ] Crear nuevo título como admin
- [ ] Editar título existente
- [ ] Eliminar título

---

## 🐛 Troubleshooting

### Error: "No se pudo conectar con el servidor"
**Causa**: Backend no está corriendo o URL incorrecta
**Solución**:
1. Verifica que el backend esté en `http://localhost:8000`
2. Si está en otra URL, edita `js/api.js`:
   ```javascript
   const API_BASE_URL = 'http://tu-url:puerto';
   ```

### Error: "No autorizado" en páginas admin
**Causa**: Usuario no tiene rol de administrador
**Solución**:
1. En el backend, actualiza el usuario:
   ```sql
   UPDATE users SET is_admin = true WHERE email = 'tu@email.com';
   ```

### Error: Subtítulos no aparecen
**Causa**: Backend no devuelve subtítulos o formato incorrecto
**Solución**:
1. Verifica endpoint: `GET /api/subtitles/{title_id}`
2. Los subtítulos deben ser formato WebVTT (.vtt)
3. Revisa la consola del navegador para errores

### Error: No se puede reproducir video
**Causa**: URL del video inválida o CORS
**Solución**:
1. Verifica que `video_url` sea válida en el backend
2. Si es video externo, verifica CORS
3. Para testing, usa el video de demostración incluido

### Error 404 en archivos
**Causa**: Servidor HTTP no está sirviendo correctamente
**Solución**:
1. Verifica que estés en el directorio correcto
2. Reinicia el servidor
3. Prueba con otro método de servidor (Python → Node)

---

## 📱 Testing en Dispositivos Móviles

### 1. En la misma red
```bash
# Inicia el servidor con tu IP local
python -m http.server 3000 --bind 0.0.0.0
```

Luego accede desde móvil:
```
http://TU_IP_LOCAL:3000
```

### 2. Verificar responsive
- Abre DevTools (F12)
- Activa modo responsive (Ctrl+Shift+M)
- Prueba diferentes tamaños:
  - Mobile: 375x667 (iPhone)
  - Tablet: 768x1024 (iPad)
  - Desktop: 1920x1080

---

## 🔐 Configuración de Seguridad

### Para Desarrollo (HTTP)
Ya está configurado, no requiere cambios.

### Para Producción (HTTPS)
1. Actualiza `API_BASE_URL` en `js/api.js` a tu dominio HTTPS
2. Configura CORS en el backend
3. Usa certificado SSL válido
4. Configura Content Security Policy

---

## 📊 Monitoreo

### Console Logs
Abre DevTools (F12) → Console para ver:
- Estado de autenticación
- Respuestas de API
- Errores de carga
- Progreso de reproducción

### Network Tab
DevTools → Network para inspeccionar:
- Requests a la API
- Status codes
- Tiempos de respuesta
- Payload de requests/responses

---

## 📚 Documentación Adicional

- **CHANGELOG.md** - Todas las funcionalidades implementadas
- **BACKEND_REQUIREMENTS.md** - Endpoints que debe implementar el backend
- **SUMMARY.md** - Resumen visual de mejoras
- **FRONTEND_README.md** - Documentación completa del frontend

---

## 🆘 Soporte

Si encuentras problemas:

1. **Revisa la consola del navegador** para errores JavaScript
2. **Revisa Network tab** para ver si las APIs responden
3. **Verifica que el backend esté corriendo** y accesible
4. **Consulta la documentación** en los archivos .md
5. **Verifica la configuración** en `js/api.js`

---

## ✅ Checklist Pre-Producción

Antes de desplegar en producción:

- [ ] Actualizar `API_BASE_URL` a producción
- [ ] Configurar HTTPS
- [ ] Minificar CSS/JS
- [ ] Optimizar imágenes
- [ ] Configurar CORS correctamente
- [ ] Testing en múltiples navegadores
- [ ] Testing responsive
- [ ] Testing de seguridad
- [ ] Backup de base de datos
- [ ] Monitoreo configurado

---

**¡Listo para usar! 🎉**

Navega a `http://localhost:3000` y comienza a explorar todas las nuevas funcionalidades.
