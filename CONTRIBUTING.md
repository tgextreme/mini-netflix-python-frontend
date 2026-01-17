# 🤝 Guía de Contribución - RustFlix Frontend

¡Gracias por tu interés en contribuir a RustFlix! Esta guía te ayudará a empezar.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo Puedo Contribuir?](#cómo-puedo-contribuir)
- [Configuración del Entorno](#configuración-del-entorno)
- [Estándares de Código](#estándares-de-código)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Mejoras](#sugerir-mejoras)

## 📜 Código de Conducta

Este proyecto se adhiere a un código de conducta. Al participar, se espera que mantengas este código.

- 🤝 Sé respetuoso y profesional
- 🌍 Acepta diferentes perspectivas
- 💬 Proporciona feedback constructivo
- 🚫 No se tolera acoso ni discriminación

## 🎯 ¿Cómo Puedo Contribuir?

### Reportar Bugs 🐛

Si encuentras un bug:

1. **Verifica** que no esté ya reportado en Issues
2. **Crea** un nuevo issue con:
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si aplica
   - Información del navegador/sistema

**Template de Bug Report:**
```markdown
**Descripción:**
Descripción clara y concisa del bug.

**Pasos para Reproducir:**
1. Ir a '...'
2. Hacer click en '...'
3. Scroll hasta '...'
4. Ver error

**Comportamiento Esperado:**
Qué debería pasar.

**Screenshots:**
Si aplica, agrega screenshots.

**Entorno:**
- OS: [ej: Windows 10]
- Navegador: [ej: Chrome 120]
- Versión: [ej: 2.0.0]
```

### Sugerir Mejoras 💡

Para sugerir una nueva funcionalidad:

1. **Verifica** que no esté ya sugerida
2. **Crea** un issue con label "enhancement"
3. **Describe** la funcionalidad y su beneficio
4. **Proporciona** ejemplos o mockups si es posible

### Contribuir con Código 💻

1. **Fork** el repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

## 🛠️ Configuración del Entorno

### Prerrequisitos

- Python 3.8+ o Node.js 14+
- Git
- Navegador moderno (Chrome, Firefox, Edge, Safari)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/rustflix-frontend.git
cd rustflix-frontend

# Iniciar servidor de desarrollo
python -m http.server 3000
# O con Node.js
npx http-server -p 3000
```

### Estructura del Proyecto

```
mini-netflix-python-frontend/
├── assets/              # Assets (imágenes, iconos, etc.)
├── css/                 # Estilos
│   └── styles.css
├── js/                  # JavaScript
│   ├── api.js          # Cliente API
│   ├── config.js       # Configuración
│   ├── i18n.js         # Internacionalización
│   ├── security.js     # Seguridad
│   ├── analytics.js    # Analytics
│   ├── pwa-helper.js   # PWA
│   └── [páginas].js    # Lógica de páginas
├── *.html              # Páginas HTML
├── manifest.json       # PWA manifest
└── service-worker.js   # Service Worker
```

## 📝 Estándares de Código

### JavaScript

#### Estilo General

```javascript
// ✅ BUENO
const userName = 'John Doe';
function getUserName() {
    return userName;
}

// ❌ MALO
var user_name = 'John Doe';
function get_user_name() {
    return user_name;
}
```

#### Convenciones de Nomenclatura

- **Variables y funciones**: `camelCase`
- **Clases**: `PascalCase`
- **Constantes**: `UPPER_SNAKE_CASE`
- **Archivos**: `kebab-case.js`

```javascript
// Variables
const userName = 'John';
let userAge = 25;

// Funciones
function calculateTotal() { }
const handleClick = () => { };

// Clases
class UserManager { }

// Constantes
const API_BASE_URL = 'http://localhost:8000';
const MAX_RETRIES = 3;
```

#### Funciones Asíncronas

```javascript
// ✅ BUENO - async/await
async function loadData() {
    try {
        const data = await api.getData();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// ❌ EVITAR - callbacks anidados
function loadData(callback) {
    api.getData(function(data) {
        callback(data);
    });
}
```

#### Manejo de Errores

```javascript
// ✅ BUENO
try {
    const result = await someOperation();
    return result;
} catch (error) {
    errorHandler.logError(error);
    showError(error.message);
    return null;
}

// ❌ MALO - silenciar errores
try {
    await someOperation();
} catch (error) {
    // Nada
}
```

### HTML

#### Semántico y Accesible

```html
<!-- ✅ BUENO -->
<nav role="navigation" aria-label="Main navigation">
    <button 
        aria-label="Close menu" 
        onclick="closeMenu()"
        class="btn-close"
    >
        ×
    </button>
</nav>

<!-- ❌ MALO -->
<div class="nav">
    <div onclick="closeMenu()">×</div>
</div>
```

#### Atributos data-*

```html
<!-- Para i18n -->
<h1 data-i18n="home.welcome"></h1>

<!-- Para JavaScript -->
<button data-action="delete" data-id="123">Delete</button>
```

### CSS

#### Uso de Variables CSS

```css
/* ✅ BUENO */
.button {
    background-color: var(--primary-color);
    border-radius: var(--border-radius);
    transition: var(--transition);
}

/* ❌ MALO */
.button {
    background-color: #e50914;
    border-radius: 8px;
    transition: all 0.3s ease;
}
```

#### BEM para Clases

```css
/* Bloque */
.card { }

/* Elemento */
.card__title { }
.card__image { }

/* Modificador */
.card--featured { }
.card__title--large { }
```

## 🔄 Proceso de Pull Request

### Antes de Crear un PR

1. ✅ Asegúrate que tu código funciona
2. ✅ Sigue los estándares de código
3. ✅ Actualiza la documentación si es necesario
4. ✅ Prueba en múltiples navegadores
5. ✅ Verifica que no hay errores en la consola

### Template de Pull Request

```markdown
## Descripción
Describe brevemente los cambios realizados.

## Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentación

## ¿Cómo se ha Probado?
Describe las pruebas realizadas.

## Checklist
- [ ] Mi código sigue el estilo del proyecto
- [ ] He revisado mi propio código
- [ ] He comentado código complejo
- [ ] He actualizado la documentación
- [ ] No hay warnings nuevos
- [ ] Funciona en Chrome, Firefox y Safari

## Screenshots (si aplica)
Agrega screenshots si hay cambios visuales.
```

### Revisión de Código

Tu PR será revisado considerando:

- ✅ **Funcionalidad**: ¿Funciona como se espera?
- ✅ **Código**: ¿Es limpio y mantenible?
- ✅ **Performance**: ¿Impacta negativamente?
- ✅ **Seguridad**: ¿Introduce vulnerabilidades?
- ✅ **Accesibilidad**: ¿Es accesible?
- ✅ **Responsive**: ¿Funciona en móviles?

## 🧪 Testing

### Testing Manual

Prueba en:
- ✅ Chrome (última versión)
- ✅ Firefox (última versión)
- ✅ Safari (última versión)
- ✅ Edge (última versión)
- ✅ Chrome Mobile
- ✅ Safari iOS

### Checklist de Testing

- [ ] Login/Registro funciona
- [ ] Navegación funciona
- [ ] Videos se reproducen
- [ ] Responsive en móvil
- [ ] Sin errores en consola
- [ ] Sin warnings en consola
- [ ] Funciona sin internet (PWA)

## 📚 Recursos Útiles

### Documentación

- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)
- [CSS Tricks](https://css-tricks.com/)
- [Web.dev](https://web.dev/)

### Herramientas

- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)
- [Firefox Developer Tools](https://developer.mozilla.org/en-US/docs/Tools)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Can I Use](https://caniuse.com/)

## ❓ Preguntas

Si tienes preguntas:

1. Revisa la [documentación](README.md)
2. Busca en [Issues](https://github.com/tu-usuario/rustflix/issues)
3. Crea un nuevo issue con label "question"

## 📜 Licencia

Al contribuir, aceptas que tus contribuciones se licencian bajo la misma licencia del proyecto (MIT).

---

¡Gracias por contribuir a RustFlix! 🎬✨
