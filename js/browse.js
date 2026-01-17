// browse.js - Funcionalidad para la página de exploración

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    if (!api.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    const user = api.getUser();
    if (user && user.name) {
        document.getElementById('userName').textContent = user.name;
    }

    // Variables del DOM
    const contentGrid = document.getElementById('contentGrid');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const noResults = document.getElementById('noResults');
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const logoutBtn = document.getElementById('logoutBtn');

    // Modal
    const modal = document.getElementById('contentModal');
    const modalClose = document.getElementById('modalClose');
    const playBtn = document.getElementById('playBtn');
    const addToListBtn = document.getElementById('addToListBtn');

    let currentFilter = 'all';
    let currentTitles = [];
    let selectedTitle = null;

    // Cargar contenido inicial
    await loadTitles();

    // Event Listeners
    logoutBtn.addEventListener('click', () => api.logout());

    filterBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            await loadTitles();
        });
    });

    // Búsqueda con debounce y autosugestión
    let searchTimeout;
    let suggestionsContainer;
    
    // Crear contenedor de sugerencias
    const searchWrapper = document.createElement('div');
    searchWrapper.style.position = 'relative';
    searchInput.parentNode.insertBefore(searchWrapper, searchInput);
    searchWrapper.appendChild(searchInput);
    
    suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions';
    suggestionsContainer.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--card-bg);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        max-height: 400px;
        overflow-y: auto;
        z-index: 1000;
        display: none;
    `;
    searchWrapper.appendChild(suggestionsContainer);
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        
        if (query.length >= 2) {
            // Mostrar sugerencias
            searchTimeout = setTimeout(async () => {
                await showSuggestions(query);
            }, 300);
        } else if (query.length === 0) {
            hideSuggestions();
            await loadTitles();
        } else {
            hideSuggestions();
        }
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query.length > 0) {
                hideSuggestions();
                searchTitles(query);
            }
        }
    });
    
    // Cerrar sugerencias al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!searchWrapper.contains(e.target)) {
            hideSuggestions();
        }
    });

    async function showSuggestions(query) {
        try {
            const response = await api.searchSuggest(query, 10);
            const suggestions = response.suggestions || [];
            
            if (suggestions.length === 0) {
                hideSuggestions();
                return;
            }
            
            suggestionsContainer.innerHTML = suggestions.map(suggestion => `
                <div class="suggestion-item" data-id="${suggestion.id}" style="
                    padding: 12px 20px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    transition: background 0.2s;
                ">
                    ${suggestion.poster_url ? `
                        <img src="${suggestion.poster_url}" 
                             alt="${suggestion.text}"
                             style="width: 40px; height: 60px; object-fit: cover; border-radius: 4px;">
                    ` : `<div style="width: 40px; height: 60px; background: var(--primary-color); border-radius: 4px; display: flex; align-items: center; justify-content: center;">🎬</div>`}
                    <div>
                        <div style="color: white; font-weight: 500;">${suggestion.text}</div>
                        <div style="color: var(--text-secondary); font-size: 0.85rem;">${suggestion.type}</div>
                    </div>
                </div>
            `).join('');
            
            // Agregar event listeners a las sugerencias
            suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('mouseenter', (e) => {
                    e.target.style.background = 'rgba(255,255,255,0.1)';
                });
                item.addEventListener('mouseleave', (e) => {
                    e.target.style.background = 'transparent';
                });
                item.addEventListener('click', () => {
                    const id = item.dataset.id;
                    window.location.href = `watch.html?id=${id}`;
                });
            });
            
            suggestionsContainer.style.display = 'block';
        } catch (error) {
            console.error('Error al obtener sugerencias:', error);
            hideSuggestions();
        }
    }
    
    function hideSuggestions() {
        suggestionsContainer.style.display = 'none';
        suggestionsContainer.innerHTML = '';
    }

    modalClose.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    playBtn.addEventListener('click', () => {
        if (selectedTitle) {
            window.location.href = `watch.html?id=${selectedTitle.id}`;
        }
    });

    addToListBtn.addEventListener('click', async () => {
        if (selectedTitle) {
            await toggleMyList(selectedTitle.id);
        }
    });

    // Funciones
    async function loadTitles() {
        showLoading(true);
        
        try {
            const params = {};
            if (currentFilter !== 'all') {
                params.type = currentFilter;
            }
            
            const response = await api.getTitles(params);
            currentTitles = response.titles || response || [];
            displayTitles(currentTitles);
        } catch (error) {
            console.error('Error al cargar títulos:', error);
            showError('Error al cargar el contenido');
        } finally {
            showLoading(false);
        }
    }

    async function searchTitles(query) {
        showLoading(true);
        
        try {
            const filters = {};
            if (currentFilter !== 'all') {
                filters.type = currentFilter;
            }
            
            const response = await api.searchTitles(query, filters);
            currentTitles = response.titles || response || [];
            displayTitles(currentTitles);
        } catch (error) {
            console.error('Error en la búsqueda:', error);
            showError('Error al buscar contenido');
        } finally {
            showLoading(false);
        }
    }

    function displayTitles(titles) {
        contentGrid.innerHTML = '';
        
        if (!titles || titles.length === 0) {
            noResults.style.display = 'block';
            return;
        }
        
        noResults.style.display = 'none';
        
        titles.forEach(title => {
            const card = createTitleCard(title);
            contentGrid.appendChild(card);
        });
    }

    function createTitleCard(title) {
        const card = document.createElement('div');
        card.className = 'content-card';
        card.style.cursor = 'pointer';
        
        const imageUrl = title.thumbnail_url || title.poster_url || '';
        const titleType = title.type === 'movie' ? '🎬' : '📺';
        const year = title.release_year || new Date(title.release_date).getFullYear() || '';
        
        card.innerHTML = `
            <div class="card-image" style="background: ${imageUrl ? `url(${imageUrl})` : 'var(--card-bg)'} center/cover;">
                ${!imageUrl ? `<div class="placeholder-icon">${titleType}</div>` : ''}
            </div>
            <div class="card-info">
                <h3>${title.title}</h3>
                <p>${year} • ${title.genre || 'General'}</p>
            </div>
        `;
        
        card.addEventListener('click', () => showTitleModal(title));
        
        return card;
    }

    async function showTitleModal(title) {
        selectedTitle = title;
        
        // Si es una serie, redirigir a la página de detalles de serie
        if (title.type === 'series') {
            window.location.href = `series.html?id=${title.id}`;
            return;
        }
        
        // Actualizar contenido del modal
        document.getElementById('modalTitle').textContent = title.title;
        
        const year = title.release_year || new Date(title.release_date).getFullYear() || '';
        const rating = title.content_rating || 'NR';
        const duration = title.duration_minutes ? `${title.duration_minutes} min` : '';
        
        document.getElementById('modalMeta').innerHTML = `
            <span>${year}</span>
            <span>${rating}</span>
            ${duration ? `<span>${duration}</span>` : ''}
            <span>${title.genre || 'General'}</span>
        `;
        
        document.getElementById('modalDescription').textContent = 
            title.description || 'Sin descripción disponible.';
        
        // Imagen de fondo
        const imageUrl = title.thumbnail_url || title.poster_url || '';
        if (imageUrl) {
            document.getElementById('modalHeader').style.background = 
                `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url(${imageUrl}) center/cover`;
        } else {
            document.getElementById('modalHeader').style.background = 'var(--card-bg)';
        }
        
        // Verificar si está en Mi Lista
        try {
            const inList = await api.isInMyList(title.id);
            addToListBtn.innerHTML = inList.in_list ? '✓ En Mi Lista' : '➕ Mi Lista';
        } catch (error) {
            console.error('Error al verificar lista:', error);
        }
        
        modal.classList.add('show');
    }

    async function toggleMyList(titleId) {
        try {
            const inList = await api.isInMyList(titleId);
            
            if (inList.in_list) {
                await api.removeFromMyList(titleId);
                addToListBtn.innerHTML = '➕ Mi Lista';
                showSuccess('Eliminado de Mi Lista');
            } else {
                await api.addToMyList(titleId);
                addToListBtn.innerHTML = '✓ En Mi Lista';
                showSuccess('Añadido a Mi Lista');
            }
        } catch (error) {
            console.error('Error al actualizar lista:', error);
            showError('Error al actualizar Mi Lista');
        }
    }

    function showLoading(show) {
        loadingSpinner.style.display = show ? 'flex' : 'none';
        contentGrid.style.display = show ? 'none' : 'grid';
    }

    function showError(message) {
        // Podrías implementar un sistema de notificaciones toast aquí
        console.error(message);
        alert(message);
    }

    function showSuccess(message) {
        // Podrías implementar un sistema de notificaciones toast aquí
        console.log(message);
    }
});
