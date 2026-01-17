# 🧪 Testing Guide - RustFlix

Guía para realizar testing manual y automatizado del frontend.

## 🎯 Tipos de Testing

### 1. Testing Manual

#### Checklist General

##### Autenticación
- [ ] Login con credenciales válidas funciona
- [ ] Login con credenciales inválidas muestra error
- [ ] Registro de nuevo usuario funciona
- [ ] Validación de email funciona
- [ ] Validación de contraseña (mínimo 6 caracteres)
- [ ] Recuperación de contraseña funciona
- [ ] Reset de contraseña funciona
- [ ] Logout funciona correctamente
- [ ] Token expira y redirige a login

##### Navegación
- [ ] Menú de navegación funciona
- [ ] Links internos funcionan
- [ ] Botón de retroceso funciona
- [ ] URLs directas funcionan
- [ ] Redirección a login si no autenticado

##### Contenido
- [ ] Lista de películas carga correctamente
- [ ] Lista de series carga correctamente
- [ ] Detalles de contenido se muestran
- [ ] Búsqueda funciona
- [ ] Filtros funcionan (películas/series)
- [ ] Paginación funciona (si aplica)

##### Reproductor
- [ ] Video se reproduce
- [ ] Play/Pause funciona
- [ ] Control de volumen funciona
- [ ] Pantalla completa funciona
- [ ] Subtítulos se muestran
- [ ] Cambio de subtítulos funciona
- [ ] Progreso se guarda
- [ ] Continuar viendo funciona

##### Mi Lista
- [ ] Agregar a Mi Lista funciona
- [ ] Eliminar de Mi Lista funciona
- [ ] Mi Lista se carga correctamente
- [ ] Persistencia de Mi Lista

##### Admin (si rol admin)
- [ ] Dashboard admin carga
- [ ] Estadísticas se muestran
- [ ] CRUD de contenido funciona
- [ ] Gestión de usuarios funciona

#### Responsive Testing

##### Móvil (320px - 767px)
- [ ] Login se ve bien
- [ ] Navegación móvil funciona
- [ ] Cards de contenido responsivas
- [ ] Reproductor funciona
- [ ] Menú hamburguesa funciona

##### Tablet (768px - 1024px)
- [ ] Layout se adapta
- [ ] Grid de contenido apropiado
- [ ] Navegación funciona

##### Desktop (1025px+)
- [ ] Layout completo funciona
- [ ] Sidebar visible
- [ ] Grid multi-columna

#### Navegadores

- [ ] Chrome (última versión)
- [ ] Firefox (última versión)
- [ ] Safari (última versión)
- [ ] Edge (última versión)
- [ ] Chrome Mobile
- [ ] Safari iOS

#### Performance

- [ ] Tiempo de carga inicial < 3s
- [ ] Tiempo de navegación < 1s
- [ ] Videos cargan rápidamente
- [ ] Sin lag al scroll
- [ ] Imágenes optimizadas

#### Accesibilidad

- [ ] Navegación por teclado funciona
- [ ] Tab order es lógico
- [ ] Lectores de pantalla compatibles
- [ ] Contraste de colores adecuado
- [ ] Alt text en imágenes
- [ ] ARIA labels presentes

#### PWA

- [ ] Service Worker registra
- [ ] App instala correctamente
- [ ] Funciona offline (básico)
- [ ] Manifest.json válido
- [ ] Íconos se muestran

### 2. Testing de Errores

#### Manejo de Errores de Red
- [ ] Sin internet muestra mensaje
- [ ] Reconexión automática funciona
- [ ] Errores de API se manejan
- [ ] Timeouts se manejan

#### Validaciones
- [ ] Campos requeridos validan
- [ ] Formato de email valida
- [ ] Longitud de contraseña valida
- [ ] Mensajes de error claros

#### Edge Cases
- [ ] Contenido sin imagen
- [ ] Usuario sin nombre
- [ ] Lista vacía
- [ ] Búsqueda sin resultados
- [ ] Video sin subtítulos

### 3. Testing de Seguridad

- [ ] XSS prevención
- [ ] CSRF tokens (si aplica)
- [ ] Sanitización de inputs
- [ ] URLs validadas
- [ ] Tokens en localStorage seguros

## 🤖 Testing Automatizado (Futuro)

### Unit Tests (Ejemplo con Jest)

```javascript
// test/api.test.js
describe('ApiClient', () => {
    test('login returns token on success', async () => {
        const api = new ApiClient();
        const result = await api.login('test@test.com', 'password');
        expect(result).toHaveProperty('token');
    });

    test('login throws error on invalid credentials', async () => {
        const api = new ApiClient();
        await expect(
            api.login('invalid@test.com', 'wrong')
        ).rejects.toThrow();
    });
});
```

### E2E Tests (Ejemplo con Playwright)

```javascript
// e2e/login.spec.js
test('user can login', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.fill('#email', 'test@test.com');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('http://localhost:3000/home.html');
});
```

## 📊 Reporte de Bugs

Cuando encuentres un bug, documenta:

1. **Pasos para reproducir**
2. **Resultado esperado**
3. **Resultado actual**
4. **Screenshots**
5. **Información del sistema**
6. **Logs de consola**

## 🔧 Herramientas Útiles

- **Chrome DevTools**: Debugging
- **Lighthouse**: Performance y accesibilidad
- **WAVE**: Accesibilidad
- **BrowserStack**: Testing multi-navegador
- **Responsively**: Testing responsive

---

¿Encontraste un bug? ¡Repórtalo en Issues! 🐛
