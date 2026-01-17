// API Client para comunicarse con el backend FastAPI

// Usar CONFIG si está disponible, sino fallback al puerto 3000
const API_BASE_URL = typeof CONFIG !== 'undefined' ? CONFIG.API.BASE_URL : 'http://localhost:3000';

class ApiClient {
    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    // Obtener el token del localStorage
    getToken() {
        return localStorage.getItem('token');
    }

    // Guardar el token en localStorage
    saveToken(token) {
        localStorage.setItem('token', token);
    }

    // Eliminar el token
    removeToken() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('profile_id');
    }

    // Guardar datos del usuario
    saveUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    // Obtener datos del usuario
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    // Guardar ID del perfil activo
    saveProfileId(profileId) {
        localStorage.setItem('profile_id', profileId);
    }

    // Obtener ID del perfil activo
    getProfileId() {
        return localStorage.getItem('profile_id');
    }

    // Verificar si el usuario está autenticado
    isAuthenticated() {
        return !!this.getToken();
    }

    // Realizar una petición HTTP
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        // Agregar token de autenticación si existe
        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(url, config);
            
            // Si no hay contenido, devolver objeto vacío
            if (response.status === 204) {
                return {};
            }

            const data = await response.json();

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.detail || data.message || 'Error en la petición',
                    data,
                };
            }

            return data;
        } catch (error) {
            if (error.status) {
                throw error;
            }
            throw {
                status: 0,
                message: 'Error de conexión con el servidor',
                data: null,
            };
        }
    }

    // ============ AUTENTICACIÓN ============
    async register(email, password, name = null) {
        const data = await this.request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, name }),
        });
        
        if (data.access_token) {
            this.saveToken(data.access_token);
            this.saveUser(data.user);
        }
        
        return data;
    }

    async login(email, password) {
        const data = await this.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        
        // El backend devuelve 'token' no 'access_token'
        if (data.token) {
            this.saveToken(data.token);
            
            // Guardar usuario inicial del login
            if (data.user) {
                this.saveUser(data.user);
                console.log('[API] Usuario guardado desde login:', data.user);
            }
            
            // Actualizar datos del usuario desde el servidor para asegurar que tenemos todos los campos
            try {
                const userData = await this.getMe();
                this.saveUser(userData);
                console.log('[API] Usuario actualizado desde /me:', userData);
            } catch (error) {
                console.warn('No se pudo actualizar datos del usuario:', error);
            }
        }
        
        return data;
    }

    async getMe() {
        return await this.request('/api/auth/me', {
            method: 'GET',
        });
    }

    logout() {
        this.removeToken();
        window.location.href = 'index.html';
    }

    // ============ PERFILES ============
    async getProfiles() {
        return await this.request('/api/profiles', {
            method: 'GET',
        });
    }

    async createProfile(name, isKids = false, pin = null) {
        return await this.request('/api/profiles', {
            method: 'POST',
            body: JSON.stringify({ name, is_kids: isKids, pin }),
        });
    }

    async updateProfile(profileId, data) {
        return await this.request(`/api/profiles/${profileId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteProfile(profileId) {
        return await this.request(`/api/profiles/${profileId}`, {
            method: 'DELETE',
        });
    }

    // ============ HOME / FEED ============
    async getHomeFeed() {
        return await this.request('/api/home/feed', {
            method: 'GET',
        });
    }

    async getHero() {
        return await this.request('/api/home/hero', {
            method: 'GET',
        });
    }

    async getCarousel(carouselId, limit = 20, offset = 0) {
        return await this.request(`/api/home/carousels/${carouselId}?limit=${limit}&offset=${offset}`, {
            method: 'GET',
        });
    }

    // ============ TÍTULOS (PELÍCULAS/SERIES) ============
    async getTitles(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/api/titles?${queryString}` : '/api/titles';
        return await this.request(endpoint, {
            method: 'GET',
        });
    }

    async getTitle(id) {
        return await this.request(`/api/titles/${id}`, {
            method: 'GET',
        });
    }

    async searchTitles(query, filters = {}) {
        const params = { q: query, ...filters };
        const queryString = new URLSearchParams(params).toString();
        return await this.request(`/api/search/results?${queryString}`, {
            method: 'GET',
        });
    }

    async searchSuggest(query, limit = 10) {
        return await this.request(`/api/search/suggest?q=${encodeURIComponent(query)}&limit=${limit}`, {
            method: 'GET',
        });
    }

    async getTrendingTitles(limit = 10) {
        return await this.request(`/api/titles/trending?limit=${limit}`, {
            method: 'GET',
        });
    }

    async getNewReleases(limit = 10) {
        return await this.request(`/api/titles/new-releases?limit=${limit}`, {
            method: 'GET',
        });
    }

    async getPopularTitles(limit = 10) {
        return await this.request(`/api/titles/popular?limit=${limit}`, {
            method: 'GET',
        });
    }

    async getTitleRecommendations(titleId, limit = 10) {
        return await this.request(`/api/titles/${titleId}/recommendations?limit=${limit}`, {
            method: 'GET',
        });
    }

    // ============ MI LISTA ============
    async getMyList() {
        return await this.request('/api/home/my-list', {
            method: 'GET',
        });
    }

    async addToMyList(titleId) {
        return await this.request(`/api/home/my-list/${titleId}`, {
            method: 'POST',
        });
    }

    async removeFromMyList(titleId) {
        return await this.request(`/api/home/my-list/${titleId}`, {
            method: 'DELETE',
        });
    }

    async isInMyList(titleId) {
        try {
            const myList = await this.getMyList();
            return myList.some(item => item.id === titleId);
        } catch (error) {
            return false;
        }
    }

    // ============ HISTORIAL DE VISUALIZACIÓN Y PLAYBACK ============
    async getContinueWatching(limit = 10) {
        return await this.request(`/api/home/continue-watching?limit=${limit}`, {
            method: 'GET',
        });
    }

    async getWatchHistory(limit = 50, offset = 0) {
        return await this.request(`/api/playback/history?limit=${limit}&offset=${offset}`, {
            method: 'GET',
        });
    }

    async getWatchProgress(titleId, episodeId = null) {
        const params = episodeId ? `?episode_id=${episodeId}` : '';
        return await this.request(`/api/playback/progress/${titleId}${params}`, {
            method: 'GET',
        });
    }

    async startPlayback(titleId, episodeId = null, progressSeconds = 0, durationSeconds = null) {
        return await this.request('/api/playback/start', {
            method: 'POST',
            body: JSON.stringify({
                title_id: titleId,
                episode_id: episodeId,
                progress_seconds: progressSeconds,
                duration_seconds: durationSeconds,
            }),
        });
    }

    async updateProgress(titleId, episodeId = null, progressSeconds = 0, durationSeconds = null) {
        return await this.request('/api/playback/progress', {
            method: 'POST',
            body: JSON.stringify({
                title_id: titleId,
                episode_id: episodeId,
                progress_seconds: progressSeconds,
                duration_seconds: durationSeconds,
            }),
        });
    }

    async stopPlayback(titleId, episodeId = null, progressSeconds = 0, durationSeconds = null) {
        return await this.request('/api/playback/stop', {
            method: 'POST',
            body: JSON.stringify({
                title_id: titleId,
                episode_id: episodeId,
                progress_seconds: progressSeconds,
                duration_seconds: durationSeconds,
            }),
        });
    }

    async sendHeartbeat(titleId, episodeId = null, progressSeconds = 0, durationSeconds = null) {
        return await this.request('/api/playback/heartbeat', {
            method: 'POST',
            body: JSON.stringify({
                title_id: titleId,
                episode_id: episodeId,
                progress_seconds: progressSeconds,
                duration_seconds: durationSeconds,
            }),
        });
    }

    async getNextEpisode(episodeId) {
        return await this.request(`/api/playback/next-episode/${episodeId}`, {
            method: 'GET',
        });
    }

    async getPlaybackManifest(titleId, episodeId = null, quality = 'auto') {
        const params = new URLSearchParams({ quality });
        if (episodeId) params.append('episode_id', episodeId);
        return await this.request(`/api/playback/manifest/${titleId}?${params.toString()}`, {
            method: 'GET',
        });
    }

    // ============ CALIFICACIONES ============
    async rateTitle(titleId, rating) {
        const profileId = this.getProfileId();
        return await this.request('/api/ratings', {
            method: 'POST',
            body: JSON.stringify({
                profile_id: profileId,
                title_id: titleId,
                rating: rating,
            }),
        });
    }

    async getRating(titleId) {
        const profileId = this.getProfileId();
        return await this.request(`/api/ratings/${titleId}?profile_id=${profileId}`, {
            method: 'GET',
        });
    }

    // ============ PREFERENCIAS ============
    async getPreferences() {
        const profileId = this.getProfileId();
        return await this.request(`/api/preferences/${profileId}`, {
            method: 'GET',
        });
    }

    async updatePreferences(preferences) {
        const profileId = this.getProfileId();
        return await this.request(`/api/preferences/${profileId}`, {
            method: 'PUT',
            body: JSON.stringify(preferences),
        });
    }

    // ============ EPISODIOS Y TEMPORADAS ============
    async getSeasons(titleId) {
        return await this.request(`/api/titles/${titleId}/seasons`, {
            method: 'GET',
        });
    }

    async getSeason(titleId, seasonNumber) {
        return await this.request(`/api/titles/${titleId}/seasons/${seasonNumber}`, {
            method: 'GET',
        });
    }

    async getEpisodes(titleId, seasonNumber) {
        return await this.request(`/api/titles/${titleId}/seasons/${seasonNumber}/episodes`, {
            method: 'GET',
        });
    }

    async getEpisode(titleId, seasonNumber, episodeNumber) {
        return await this.request(`/api/titles/${titleId}/seasons/${seasonNumber}/episodes/${episodeNumber}`, {
            method: 'GET',
        });
    }

    // ============ SUBTÍTULOS ============
    async getSubtitles(titleId, episodeId = null) {
        const endpoint = episodeId 
            ? `/api/subtitles/${titleId}/episode/${episodeId}`
            : `/api/subtitles/${titleId}`;
        return await this.request(endpoint, {
            method: 'GET',
        });
    }

    // ============ RECUPERACIÓN DE CONTRASEÑA ============
    async requestPasswordReset(email) {
        return await this.request('/api/users/password-reset/request', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    }

    async resetPassword(token, newPassword) {
        return await this.request('/api/users/password-reset/confirm', {
            method: 'POST',
            body: JSON.stringify({ token, new_password: newPassword }),
        });
    }

    async changePassword(currentPassword, newPassword) {
        return await this.request('/api/users/change-password', {
            method: 'POST',
            body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
        });
    }

    // ============ ADMIN - GESTIÓN DE CONTENIDO ============
    async createTitle(titleData) {
        return await this.request('/api/admin/titles', {
            method: 'POST',
            body: JSON.stringify(titleData),
        });
    }

    async updateTitle(titleId, titleData) {
        return await this.request(`/api/admin/titles/${titleId}`, {
            method: 'PUT',
            body: JSON.stringify(titleData),
        });
    }

    async deleteTitle(titleId) {
        return await this.request(`/api/admin/titles/${titleId}`, {
            method: 'DELETE',
        });
    }

    async createEpisode(titleId, seasonNumber, episodeData) {
        return await this.request(`/api/admin/titles/${titleId}/seasons/${seasonNumber}/episodes`, {
            method: 'POST',
            body: JSON.stringify(episodeData),
        });
    }

    async updateEpisode(titleId, seasonNumber, episodeNumber, episodeData) {
        return await this.request(`/api/admin/titles/${titleId}/seasons/${seasonNumber}/episodes/${episodeNumber}`, {
            method: 'PUT',
            body: JSON.stringify(episodeData),
        });
    }

    async deleteEpisode(titleId, seasonNumber, episodeNumber) {
        return await this.request(`/api/admin/titles/${titleId}/seasons/${seasonNumber}/episodes/${episodeNumber}`, {
            method: 'DELETE',
        });
    }

    // ============ ADMIN - GESTIÓN DE USUARIOS ============
    async getAllUsers(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/api/admin/users?${queryString}` : '/api/admin/users';
        return await this.request(endpoint, {
            method: 'GET',
        });
    }

    async getUserById(userId) {
        return await this.request(`/api/admin/users/${userId}`, {
            method: 'GET',
        });
    }

    async updateUser(userId, userData) {
        return await this.request(`/api/admin/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    }

    async deleteUser(userId) {
        return await this.request(`/api/admin/users/${userId}`, {
            method: 'DELETE',
        });
    }

    // ============ ADMIN - ESTADÍSTICAS ============
    async getAdminStats() {
        return await this.request('/api/admin/stats', {
            method: 'GET',
        });
    }

    async getViewStats(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/api/admin/stats/views?${queryString}` : '/api/admin/stats/views';
        return await this.request(endpoint, {
            method: 'GET',
        });
    }

    // ============ ADMIN - UPLOAD MEDIA ============
    async uploadVideo(file, titleId = null, onProgress = null) {
        const formData = new FormData();
        formData.append('file', file);
        if (titleId) {
            formData.append('title_id', titleId);
        }

        return await this.uploadWithProgress('/admin/media/upload/video', formData, onProgress);
    }

    async uploadImage(file, imageType = 'poster', titleId = null, onProgress = null) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('image_type', imageType);
        if (titleId) {
            formData.append('title_id', titleId);
        }

        return await this.uploadWithProgress('/admin/media/upload/image', formData, onProgress);
    }

    async uploadWithProgress(endpoint, formData, onProgress = null) {
        const url = `${this.baseUrl}${endpoint}`;
        const token = this.getToken();

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            // Eventos de progreso
            if (onProgress) {
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        onProgress(percentComplete, e.loaded, e.total);
                    }
                });
            }

            // Evento de carga completada
            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        resolve(data);
                    } catch (e) {
                        reject(new Error('Error al parsear respuesta'));
                    }
                } else {
                    try {
                        const error = JSON.parse(xhr.responseText);
                        reject({
                            status: xhr.status,
                            message: error.detail || error.message || 'Error en la petición',
                            data: error
                        });
                    } catch (e) {
                        reject({
                            status: xhr.status,
                            message: 'Error en la petición',
                            data: null
                        });
                    }
                }
            });

            // Evento de error
            xhr.addEventListener('error', () => {
                reject({
                    status: 0,
                    message: 'Error de conexión con el servidor',
                    data: null
                });
            });

            // Configurar y enviar
            xhr.open('POST', url);
            if (token) {
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            }
            xhr.send(formData);
        });
    }

    async deleteMedia(filePath) {
        return await this.request(`/admin/media/delete/${encodeURIComponent(filePath)}`, {
            method: 'DELETE',
        });
    }

    async getMediaStats() {
        return await this.request('/admin/media/stats', {
            method: 'GET',
        });
    }

    // ============ UTILIDADES ============
    isAdmin() {
        const user = this.getUser();
        const result = user && (user.is_admin || user.role === 'admin');
        console.log('[API] isAdmin check:', { user, result });
        return result;
    }
}

// Exportar una instancia única del cliente API
const api = new ApiClient();
