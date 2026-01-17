# 📋 Endpoints Requeridos en el Backend

Este documento lista todos los endpoints que el backend debe implementar para soportar las nuevas funcionalidades del frontend.

## 🆕 Nuevos Endpoints Requeridos

### 1. Series y Episodios

#### Obtener Temporadas de una Serie
```
GET /api/titles/{title_id}/seasons
```
**Response:**
```json
{
  "seasons": [
    {
      "id": 1,
      "title_id": 123,
      "season_number": 1,
      "title": "Temporada 1",
      "episode_count": 10,
      "release_year": 2024
    }
  ]
}
```

#### Obtener Temporada Específica
```
GET /api/titles/{title_id}/seasons/{season_number}
```
**Response:**
```json
{
  "id": 1,
  "title_id": 123,
  "season_number": 1,
  "title": "Temporada 1",
  "description": "Primera temporada...",
  "episode_count": 10,
  "release_year": 2024
}
```

#### Obtener Episodios de una Temporada
```
GET /api/titles/{title_id}/seasons/{season_number}/episodes
```
**Response:**
```json
{
  "episodes": [
    {
      "id": 101,
      "title_id": 123,
      "season_number": 1,
      "episode_number": 1,
      "title": "Piloto",
      "description": "Primer episodio...",
      "duration_minutes": 45,
      "video_url": "https://...",
      "thumbnail_url": "https://...",
      "air_date": "2024-01-15",
      "series_title": "Nombre de la Serie"
    }
  ]
}
```

#### Obtener Episodio Específico
```
GET /api/titles/{title_id}/seasons/{season_number}/episodes/{episode_number}
```
**Response:**
```json
{
  "id": 101,
  "title_id": 123,
  "season_number": 1,
  "episode_number": 1,
  "title": "Piloto",
  "description": "Primer episodio...",
  "duration_minutes": 45,
  "video_url": "https://...",
  "thumbnail_url": "https://...",
  "air_date": "2024-01-15",
  "series_title": "Nombre de la Serie"
}
```

---

### 2. Subtítulos

#### Obtener Subtítulos para un Título
```
GET /api/subtitles/{title_id}
GET /api/subtitles/{title_id}/episode/{episode_id}
```
**Response:**
```json
{
  "subtitles": [
    {
      "id": 1,
      "language": "es",
      "language_name": "Español",
      "url": "https://example.com/subtitles/es.vtt"
    },
    {
      "id": 2,
      "language": "en",
      "language_name": "English",
      "url": "https://example.com/subtitles/en.vtt"
    }
  ]
}
```

**Nota:** Los subtítulos deben estar en formato WebVTT (.vtt)

---

### 3. Recuperación de Contraseña

#### Solicitar Restablecimiento
```
POST /api/users/password-reset/request
```
**Request Body:**
```json
{
  "email": "user@example.com"
}
```
**Response:**
```json
{
  "message": "Si el email existe, recibirás un enlace de recuperación",
  "success": true
}
```

**Acción del Backend:**
- Generar token único (UUID)
- Guardar token con expiración (ej: 1 hora)
- Enviar email con enlace: `https://frontend.com/reset-password.html?token={token}`

#### Confirmar Restablecimiento
```
POST /api/users/password-reset/confirm
```
**Request Body:**
```json
{
  "token": "uuid-token-here",
  "new_password": "newpassword123"
}
```
**Response:**
```json
{
  "message": "Contraseña actualizada exitosamente",
  "success": true
}
```

#### Cambiar Contraseña (Usuario Autenticado)
```
POST /api/users/change-password
Authorization: Bearer {token}
```
**Request Body:**
```json
{
  "current_password": "oldpassword",
  "new_password": "newpassword123"
}
```
**Response:**
```json
{
  "message": "Contraseña cambiada exitosamente",
  "success": true
}
```

---

### 4. Administración - Contenido

#### Crear Título (Admin)
```
POST /api/admin/titles
Authorization: Bearer {admin_token}
```
**Request Body:**
```json
{
  "title": "Nueva Película",
  "type": "movie",
  "description": "Descripción...",
  "genre": "Acción",
  "release_year": 2024,
  "duration_minutes": 120,
  "content_rating": "PG-13",
  "video_url": "https://...",
  "thumbnail_url": "https://..."
}
```

#### Actualizar Título (Admin)
```
PUT /api/admin/titles/{title_id}
Authorization: Bearer {admin_token}
```
**Request Body:** (mismo formato que crear)

#### Eliminar Título (Admin)
```
DELETE /api/admin/titles/{title_id}
Authorization: Bearer {admin_token}
```

#### Crear Episodio (Admin)
```
POST /api/admin/titles/{title_id}/seasons/{season_number}/episodes
Authorization: Bearer {admin_token}
```
**Request Body:**
```json
{
  "episode_number": 1,
  "title": "Piloto",
  "description": "Primer episodio",
  "duration_minutes": 45,
  "video_url": "https://...",
  "thumbnail_url": "https://...",
  "air_date": "2024-01-15"
}
```

#### Actualizar Episodio (Admin)
```
PUT /api/admin/titles/{title_id}/seasons/{season_number}/episodes/{episode_number}
Authorization: Bearer {admin_token}
```

#### Eliminar Episodio (Admin)
```
DELETE /api/admin/titles/{title_id}/seasons/{season_number}/episodes/{episode_number}
Authorization: Bearer {admin_token}
```

---

### 5. Administración - Usuarios

#### Listar Todos los Usuarios (Admin)
```
GET /api/admin/users?limit=10&offset=0&order_by=created_desc
Authorization: Bearer {admin_token}
```
**Response:**
```json
{
  "users": [
    {
      "id": 1,
      "email": "user@example.com",
      "name": "Usuario",
      "is_admin": false,
      "created_at": "2024-01-01T00:00:00Z",
      "last_login": "2024-01-15T12:00:00Z"
    }
  ],
  "total": 100,
  "limit": 10,
  "offset": 0
}
```

#### Obtener Usuario Específico (Admin)
```
GET /api/admin/users/{user_id}
Authorization: Bearer {admin_token}
```

#### Actualizar Usuario (Admin)
```
PUT /api/admin/users/{user_id}
Authorization: Bearer {admin_token}
```
**Request Body:**
```json
{
  "name": "Nuevo Nombre",
  "is_admin": false,
  "is_active": true
}
```

#### Eliminar Usuario (Admin)
```
DELETE /api/admin/users/{user_id}
Authorization: Bearer {admin_token}
```

---

### 6. Administración - Estadísticas

#### Estadísticas Generales (Admin)
```
GET /api/admin/stats
Authorization: Bearer {admin_token}
```
**Response:**
```json
{
  "total_users": 1500,
  "total_movies": 200,
  "total_series": 50,
  "total_episodes": 500,
  "views_today": 3500,
  "views_week": 25000,
  "views_month": 100000,
  "average_rating": 4.2,
  "total_in_lists": 5000,
  "active_users_today": 450
}
```

#### Estadísticas de Visualización (Admin)
```
GET /api/admin/stats/views?limit=10&order_by=views_desc&period=week
Authorization: Bearer {admin_token}
```
**Response:**
```json
{
  "content": [
    {
      "title_id": 123,
      "title": "Película Popular",
      "type": "movie",
      "views": 5000,
      "unique_viewers": 3500,
      "average_watch_time": 85.5
    }
  ]
}
```

---

## 🔐 Consideraciones de Seguridad

### Roles de Usuario
El modelo User debe incluir un campo para identificar administradores:
```python
class User(Base):
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True)
    password_hash = Column(String)
    name = Column(String)
    is_admin = Column(Boolean, default=False)  # ← IMPORTANTE
    created_at = Column(DateTime, default=datetime.utcnow)
```

### Middleware de Autorización
Crear decoradores/middleware para proteger rutas admin:
```python
def require_admin(func):
    def wrapper(*args, **kwargs):
        if not current_user.is_admin:
            raise HTTPException(status_code=403, detail="No autorizado")
        return func(*args, **kwargs)
    return wrapper
```

### Tokens de Recuperación
```python
class PasswordResetToken(Base):
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    token = Column(String, unique=True)  # UUID
    expires_at = Column(DateTime)  # 1 hora desde creación
    used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
```

---

## 📧 Configuración de Email

Para recuperación de contraseña, configurar SMTP:

```python
# .env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-app-password
EMAIL_FROM=noreply@rustflix.com
FRONTEND_URL=http://localhost:3000
```

Template de email:
```
Asunto: Recuperación de Contraseña - RustFlix

Hola,

Has solicitado restablecer tu contraseña.

Haz clic en el siguiente enlace para crear una nueva contraseña:
{FRONTEND_URL}/reset-password.html?token={TOKEN}

Este enlace expira en 1 hora.

Si no solicitaste esto, ignora este email.

Saludos,
Equipo RustFlix
```

---

## ✅ Checklist de Implementación Backend

### Series y Episodios
- [ ] Crear tabla `seasons`
- [ ] Crear tabla `episodes`
- [ ] Implementar GET `/api/titles/{id}/seasons`
- [ ] Implementar GET `/api/titles/{id}/seasons/{season}`
- [ ] Implementar GET `/api/titles/{id}/seasons/{season}/episodes`
- [ ] Implementar GET `/api/titles/{id}/seasons/{season}/episodes/{episode}`

### Subtítulos
- [ ] Crear tabla `subtitles`
- [ ] Implementar GET `/api/subtitles/{title_id}`
- [ ] Configurar almacenamiento de archivos .vtt
- [ ] Implementar carga de archivos de subtítulos

### Recuperación de Contraseña
- [ ] Crear tabla `password_reset_tokens`
- [ ] Configurar SMTP
- [ ] Implementar POST `/api/users/password-reset/request`
- [ ] Implementar POST `/api/users/password-reset/confirm`
- [ ] Implementar POST `/api/users/change-password`
- [ ] Crear template de email
- [ ] Tarea de limpieza de tokens expirados

### Panel Admin
- [ ] Agregar campo `is_admin` a User
- [ ] Crear middleware de autorización admin
- [ ] Implementar CRUD de títulos (admin)
- [ ] Implementar CRUD de episodios (admin)
- [ ] Implementar endpoints de usuarios (admin)
- [ ] Implementar endpoints de estadísticas (admin)
- [ ] Agregar índices de BD para estadísticas

---

## 🧪 Testing

### Pruebas de API
```bash
# Series
curl http://localhost:8000/api/titles/1/seasons
curl http://localhost:8000/api/titles/1/seasons/1/episodes

# Subtítulos
curl http://localhost:8000/api/subtitles/1

# Admin (requiere token)
curl -H "Authorization: Bearer {token}" http://localhost:8000/api/admin/stats
```

---

**Nota:** Todos estos endpoints deben estar documentados en Swagger/OpenAPI una vez implementados.
