// admin-content.js - Gestión de contenido para administradores

document.addEventListener('DOMContentLoaded', async () => {
    // Proteger ruta - requiere permisos de admin
    if (window.RouteGuard) {
        const hasAccess = await window.RouteGuard.requireAdmin();
        if (!hasAccess) {
            return;
        }
    }
    
    // Verificar autenticación (fallback)
    if (!api.isAuthenticated()) {
        window.location.href = '/index.html';
        return;
    }

    if (!api.isAdmin()) {
        alert('No tienes permisos de administrador');
        window.location.href = '/home.html';
        return;
    }

    const user = api.getUser();
    if (user && user.name) {
        document.getElementById('userName').textContent = user.name;
    }

    // Variables del DOM
    const contentTable = document.getElementById('contentTable');
    const loadingContent = document.getElementById('loadingContent');
    const noContent = document.getElementById('noContent');
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const logoutBtn = document.getElementById('logoutBtn');
    const createTitleBtn = document.getElementById('createTitleBtn');

    // Modal
    const titleModal = document.getElementById('titleModal');
    const modalClose = document.getElementById('modalClose');
    const titleForm = document.getElementById('titleForm');
    const cancelBtn = document.getElementById('cancelBtn');

    let currentFilter = 'all';
    let currentTitles = [];
    let editingTitle = null;

    // Cargar contenido inicial
    await loadContent();

    // Event Listeners
    logoutBtn.addEventListener('click', () => api.logout());

    createTitleBtn.addEventListener('click', () => {
        openTitleModal();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            await loadContent();
        });
    });

    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(async () => {
            const query = e.target.value.trim();
            if (query.length > 0) {
                await searchContent(query);
            } else {
                await loadContent();
            }
        }, 500);
    });

    modalClose.addEventListener('click', () => {
        titleModal.classList.remove('show');
    });

    cancelBtn.addEventListener('click', () => {
        titleModal.classList.remove('show');
    });

    titleModal.addEventListener('click', (e) => {
        if (e.target === titleModal) {
            titleModal.classList.remove('show');
        }
    });

    titleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveTitle();
    });

    // Listeners para upload de archivos
    document.getElementById('videoFileInput').addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            await handleVideoUpload(file);
        }
    });

    document.getElementById('thumbnailFileInput').addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            await handleImageUpload(file);
        }
    });

    // Funciones
    async function loadContent() {
        loadingContent.style.display = 'flex';
        
        try {
            const params = {};
            if (currentFilter !== 'all') {
                params.type = currentFilter;
            }
            
            const response = await api.getTitles(params);
            currentTitles = response.titles || response || [];
            displayContent(currentTitles);
        } catch (error) {
            console.error('Error al cargar contenido:', error);
            noContent.style.display = 'block';
        } finally {
            loadingContent.style.display = 'none';
        }
    }

    async function searchContent(query) {
        loadingContent.style.display = 'flex';
        
        try {
            const filters = {};
            if (currentFilter !== 'all') {
                filters.type = currentFilter;
            }
            
            const response = await api.searchTitles(query, filters);
            currentTitles = response.titles || response || [];
            displayContent(currentTitles);
        } catch (error) {
            console.error('Error en la búsqueda:', error);
            noContent.style.display = 'block';
        } finally {
            loadingContent.style.display = 'none';
        }
    }

    function displayContent(titles) {
        contentTable.innerHTML = '';
        
        if (!titles || titles.length === 0) {
            noContent.style.display = 'block';
            return;
        }
        
        noContent.style.display = 'none';

        // Crear tabla
        const table = document.createElement('div');
        table.style.cssText = 'background: var(--card-bg); border-radius: var(--border-radius); overflow: hidden;';

        // Header
        table.innerHTML = `
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 150px; gap: 15px; padding: 15px; background: var(--secondary-bg); font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <div>Título</div>
                <div>Tipo</div>
                <div>Año</div>
                <div>Duración</div>
                <div>Acciones</div>
            </div>
        `;

        // Rows
        titles.forEach(title => {
            const row = createContentRow(title);
            table.appendChild(row);
        });

        contentTable.appendChild(table);
    }

    function createContentRow(title) {
        const row = document.createElement('div');
        row.style.cssText = 'display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 150px; gap: 15px; padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); align-items: center; transition: var(--transition);';
        
        row.addEventListener('mouseenter', () => {
            row.style.background = 'rgba(255,255,255,0.05)';
        });
        
        row.addEventListener('mouseleave', () => {
            row.style.background = 'transparent';
        });

        const year = title.release_year || new Date(title.release_date).getFullYear() || '-';
        const duration = title.duration_minutes ? `${title.duration_minutes} min` : '-';
        const typeIcon = title.type === 'movie' ? '🎬' : '📺';
        const typeText = title.type === 'movie' ? 'Película' : 'Serie';

        row.innerHTML = `
            <div>
                <h4 style="margin-bottom: 5px;">${title.title}</h4>
                <p style="color: var(--text-secondary); font-size: 0.85rem;">${title.genre || 'Sin género'}</p>
            </div>
            <div>${typeIcon} ${typeText}</div>
            <div>${year}</div>
            <div>${duration}</div>
            <div style="display: flex; gap: 8px;">
                <button class="btn-icon edit-btn" data-id="${title.id}" title="Editar">
                    ✏️
                </button>
                <button class="btn-icon delete-btn" data-id="${title.id}" title="Eliminar">
                    🗑️
                </button>
            </div>
        `;

        // Event listeners para botones
        row.querySelector('.edit-btn').addEventListener('click', () => {
            openTitleModal(title);
        });

        row.querySelector('.delete-btn').addEventListener('click', () => {
            deleteTitle(title);
        });

        return row;
    }

    function openTitleModal(title = null) {
        editingTitle = title;
        
        if (title) {
            // Modo edición
            document.getElementById('modalTitle').textContent = 'Editar Título';
            document.getElementById('titleInput').value = title.title || '';
            document.getElementById('typeSelect').value = title.type || 'movie';
            document.getElementById('descriptionInput').value = title.description || '';
            document.getElementById('genreInput').value = title.genre || '';
            document.getElementById('releaseYearInput').value = title.release_year || '';
            document.getElementById('durationInput').value = title.duration_minutes || '';
            document.getElementById('ratingInput').value = title.content_rating || '';
            document.getElementById('videoUrlInput').value = title.video_url || '';
            document.getElementById('thumbnailUrlInput').value = title.thumbnail_url || '';
        } else {
            // Modo creación
            document.getElementById('modalTitle').textContent = 'Agregar Título';
            titleForm.reset();
        }
        
        titleModal.classList.add('show');
    }

    async function saveTitle() {
        const titleData = {
            title: document.getElementById('titleInput').value.trim(),
            type: document.getElementById('typeSelect').value,
            description: document.getElementById('descriptionInput').value.trim(),
            genre: document.getElementById('genreInput').value.trim(),
            release_year: parseInt(document.getElementById('releaseYearInput').value) || null,
            duration_minutes: parseInt(document.getElementById('durationInput').value) || null,
            content_rating: document.getElementById('ratingInput').value || null,
            video_url: document.getElementById('videoUrlInput').value.trim() || null,
            thumbnail_url: document.getElementById('thumbnailUrlInput').value.trim() || null
        };

        try {
            if (editingTitle) {
                // Actualizar
                await api.updateTitle(editingTitle.id, titleData);
                showNotification('Título actualizado exitosamente');
            } else {
                // Crear
                await api.createTitle(titleData);
                showNotification('Título creado exitosamente');
            }
            
            titleModal.classList.remove('show');
            await loadContent();
        } catch (error) {
            console.error('Error al guardar título:', error);
            showNotification('Error al guardar el título', true);
        }
    }

    async function deleteTitle(title) {
        if (!confirm(`¿Estás seguro de eliminar "${title.title}"?`)) {
            return;
        }

        try {
            await api.deleteTitle(title.id);
            showNotification('Título eliminado exitosamente');
            await loadContent();
        } catch (error) {
            console.error('Error al eliminar título:', error);
            showNotification('Error al eliminar el título', true);
        }
    }

    function showNotification(message, isError = false) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${isError ? 'var(--error-color)' : 'var(--success-color)'};
            color: white;
            padding: 15px 25px;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            z-index: 3000;
            animation: fadeIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    async function handleVideoUpload(file) {
        // Validar tamaño (máximo 500MB)
        const maxSize = 500 * 1024 * 1024; // 500MB
        if (file.size > maxSize) {
            showNotification('El archivo es demasiado grande. Máximo 500MB', true);
            document.getElementById('videoFileInput').value = '';
            return;
        }

        const progressContainer = document.getElementById('videoUploadProgress');
        const progressBar = document.getElementById('videoProgressBar');
        const progressText = document.getElementById('videoProgressText');

        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';
        progressText.textContent = 'Subiendo video...';

        try {
            const result = await api.uploadVideo(file, editingTitle?.id || null, (percent, loaded, total) => {
                progressBar.style.width = `${percent}%`;
                const loadedMB = (loaded / (1024 * 1024)).toFixed(1);
                const totalMB = (total / (1024 * 1024)).toFixed(1);
                progressText.textContent = `Subiendo: ${loadedMB}MB / ${totalMB}MB (${Math.round(percent)}%)`;
            });

            // Actualizar el campo de URL con la URL del video subido
            if (result.file_info && result.file_info.url) {
                const baseUrl = api.baseUrl.replace('/api', '');
                document.getElementById('videoUrlInput').value = baseUrl + result.file_info.url;
            }

            progressText.textContent = '✓ Video subido exitosamente';
            setTimeout(() => {
                progressContainer.style.display = 'none';
            }, 2000);

            showNotification('Video subido exitosamente');
        } catch (error) {
            console.error('Error al subir video:', error);
            progressText.textContent = '✗ Error al subir video';
            progressBar.style.background = 'var(--error-color)';
            showNotification(error.message || 'Error al subir el video', true);
            setTimeout(() => {
                progressContainer.style.display = 'none';
                progressBar.style.background = 'var(--primary-color)';
            }, 3000);
        }

        document.getElementById('videoFileInput').value = '';
    }

    async function handleImageUpload(file) {
        // Validar tamaño (máximo 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            showNotification('La imagen es demasiado grande. Máximo 10MB', true);
            document.getElementById('thumbnailFileInput').value = '';
            return;
        }

        const progressContainer = document.getElementById('thumbnailUploadProgress');
        const progressBar = document.getElementById('thumbnailProgressBar');
        const progressText = document.getElementById('thumbnailProgressText');

        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';
        progressText.textContent = 'Subiendo imagen...';

        try {
            const result = await api.uploadImage(file, 'poster', editingTitle?.id || null, (percent, loaded, total) => {
                progressBar.style.width = `${percent}%`;
                const loadedKB = (loaded / 1024).toFixed(1);
                const totalKB = (total / 1024).toFixed(1);
                progressText.textContent = `Subiendo: ${loadedKB}KB / ${totalKB}KB (${Math.round(percent)}%)`;
            });

            // Actualizar el campo de URL con la URL de la imagen subida
            if (result.file_info && result.file_info.url) {
                const baseUrl = api.baseUrl.replace('/api', '');
                document.getElementById('thumbnailUrlInput').value = baseUrl + result.file_info.url;
            }

            progressText.textContent = '✓ Imagen subida exitosamente';
            setTimeout(() => {
                progressContainer.style.display = 'none';
            }, 2000);

            showNotification('Imagen subida exitosamente');
        } catch (error) {
            console.error('Error al subir imagen:', error);
            progressText.textContent = '✗ Error al subir imagen';
            progressBar.style.background = 'var(--error-color)';
            showNotification(error.message || 'Error al subir la imagen', true);
            setTimeout () => {
                progressContainer.style.display = 'none';
                progressBar.style.background = 'var(--primary-color)';
            }, 3000);
        }

        document.getElementById('thumbnailFileInput').value = '';
    }
});
