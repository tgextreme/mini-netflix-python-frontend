// home.js - Funcionalidad para la página principal

let isRedirecting = false;

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    if (!api.isAuthenticated()) {
        if (!isRedirecting) {
            isRedirecting = true;
            window.location.href = 'index.html';
        }
        return;
    }

    // Validar que el token sea válido
    try {
        await api.getMe();
    } catch (error) {
        console.error('Token inválido:', error);
        if (!isRedirecting) {
            isRedirecting = true;
            api.removeToken();
            window.location.href = 'index.html';
        }
        return;
    }

    const user = api.getUser();
    if (user && user.name) {
        document.getElementById('userName').textContent = user.name;
    }

    // Variables del DOM
    const trendingContent = document.getElementById('trendingContent');
    const continueWatching = document.getElementById('continueWatching');
    const recommendedContent = document.getElementById('recommendedContent');
    const myListContent = document.getElementById('myListContent');
    const logoutBtn = document.getElementById('logoutBtn');
    const heroSection = document.getElementById('heroSection');
    const heroPlayBtn = document.getElementById('heroPlayBtn');
    const heroInfoBtn = document.getElementById('heroInfoBtn');

    // Modal
    const modal = document.getElementById('contentModal');
    const modalClose = document.getElementById('modalClose');
    const playBtn = document.getElementById('playBtn');
    const addToListBtn = document.getElementById('addToListBtn');

    let selectedTitle = null;
    let featuredTitle = null;

    // Cargar contenido
    await loadFeaturedContent();
    await loadTrending();
    await loadContinueWatching();
    await loadRecommendations();
    await loadMyList();

    // Event Listeners
    logoutBtn.addEventListener('click', () => api.logout());

    heroPlayBtn.addEventListener('click', () => {
        if (featuredTitle) {
            window.location.href = `watch.html?id=${featuredTitle.id}`;
        }
    });

    heroInfoBtn.addEventListener('click', () => {
        if (featuredTitle) {
            showTitleModal(featuredTitle);
        }
    });

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
    async function loadFeaturedContent() {
        try {
            // Obtener contenido hero del endpoint específico
            const hero = await api.getHero();
            
            if (hero && hero.title) {
                featuredTitle = {
                    id: hero.title_id,
                    title: hero.title,
                    description: hero.synopsis,
                    thumbnail_url: hero.backdrop_url,
                    poster_url: hero.poster_url,
                    type: hero.title_type,
                    content_rating: hero.content_rating,
                    genres: hero.genres
                };
                updateHeroSection(featuredTitle);
                return;
            }
        } catch (error) {
            console.error('Error al cargar hero:', error);
        }
        
        // Fallback: usar trending
        try {
            const response = await api.getTrendingTitles(1);
            const titles = response.titles || response || [];
            
            if (titles.length > 0) {
                featuredTitle = titles[0];
                updateHeroSection(featuredTitle);
            }
        } catch (error) {
            console.error('Error al cargar contenido destacado:', error);
        }
    }

    function updateHeroSection(title) {
        document.getElementById('heroTitle').textContent = title.title;
        document.getElementById('heroDescription').textContent = 
            title.description || 'Disfruta de las mejores películas y series en streaming';
        
        // Actualizar imagen de fondo si está disponible
        const imageUrl = title.thumbnail_url || title.poster_url;
        if (imageUrl) {
            heroSection.style.background = `
                linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.8)),
                url(${imageUrl}) center/cover
            `;
        }
    }

    async function loadTrending() {
        const loading = document.getElementById('loadingTrending');
        loading.style.display = 'flex';
        
        try {
            const response = await api.getTrendingTitles(10);
            const titles = response.titles || response || [];
            displayTitles(trendingContent, titles);
        } catch (error) {
            console.error('Error al cargar tendencias:', error);
            trendingContent.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 40px;">Error al cargar tendencias</p>';
        } finally {
            loading.style.display = 'none';
        }
    }

    async function loadContinueWatching() {
        const loading = document.getElementById('loadingContinue');
        const empty = document.getElementById('emptyContinue');
        
        loading.style.display = 'flex';
        
        try {
            const response = await api.getContinueWatching(10);
            const items = response.items || response || [];
            
            if (items.length === 0) {
                empty.style.display = 'block';
                continueWatching.style.display = 'none';
            } else {
                empty.style.display = 'none';
                continueWatching.style.display = 'grid';
                
                // Extraer títulos con progreso
                const titles = items.map(item => ({
                    ...item.title,
                    progress: item.progress_percentage
                }));
                displayTitles(continueWatching, titles, true);
            }
        } catch (error) {
            console.error('Error al cargar continuar viendo:', error);
            empty.style.display = 'block';
        } finally {
            loading.style.display = 'none';
        }
    }

    async function loadRecommendations() {
        const loading = document.getElementById('loadingRecommended');
        loading.style.display = 'flex';
        
        try {
            // Intentar obtener recomendaciones del home feed
            const feed = await api.getHomeFeed();
            const titles = feed.carousels?.find(c => c.id === 'recommended')?.items || [];
            displayTitles(recommendedContent, titles);
        } catch (error) {
            console.error('Error al cargar recomendaciones:', error);
            // Si falla, cargar títulos generales
            try {
                const response = await api.getTitles({ limit: 10 });
                const titles = response.titles || response || [];
                displayTitles(recommendedContent, titles);
            } catch (err) {
                recommendedContent.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 40px;">Error al cargar recomendaciones</p>';
            }
        } finally {
            loading.style.display = 'none';
        }
    }

    async function loadMyList() {
        const loading = document.getElementById('loadingMyList');
        const empty = document.getElementById('emptyMyList');
        
        loading.style.display = 'flex';
        
        try {
            const response = await api.getMyList();
            const titles = response.titles || response || [];
            
            if (titles.length === 0) {
                empty.style.display = 'block';
                myListContent.style.display = 'none';
            } else {
                empty.style.display = 'none';
                myListContent.style.display = 'grid';
                displayTitles(myListContent, titles);
            }
        } catch (error) {
            console.error('Error al cargar Mi Lista:', error);
            empty.style.display = 'block';
        } finally {
            loading.style.display = 'none';
        }
    }

    function displayTitles(container, titles, showProgress = false) {
        container.innerHTML = '';
        
        if (!titles || titles.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 40px; grid-column: 1/-1;">No hay contenido disponible</p>';
            return;
        }
        
        titles.forEach(title => {
            const card = createTitleCard(title, showProgress);
            container.appendChild(card);
        });
    }

    function createTitleCard(title, showProgress = false) {
        const card = document.createElement('div');
        card.className = 'content-card';
        card.style.cursor = 'pointer';
        card.style.position = 'relative';
        
        const imageUrl = title.thumbnail_url || title.poster_url || '';
        const titleType = title.type === 'movie' ? '🎬' : '📺';
        const year = title.release_year || new Date(title.release_date).getFullYear() || '';
        
        card.innerHTML = `
            <div class="card-image" style="background: ${imageUrl ? `url(${imageUrl})` : 'var(--card-bg)'} center/cover;">
                ${!imageUrl ? `<div class="placeholder-icon">${titleType}</div>` : ''}
                ${showProgress && title.progress ? `
                    <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 5px; background: rgba(255,255,255,0.3);">
                        <div style="height: 100%; background: var(--primary-color); width: ${title.progress}%;"></div>
                    </div>
                ` : ''}
            </div>
            <div class="card-info">
                <h3>${title.title}</h3>
                <p>${year} • ${title.genre || 'General'}</p>
                ${showProgress && title.progress ? `<p style="color: var(--primary-color); font-size: 0.85rem; margin-top: 5px;">${Math.round(title.progress)}% visto</p>` : ''}
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
                showNotification('Eliminado de Mi Lista');
                await loadMyList(); // Recargar Mi Lista
            } else {
                await api.addToMyList(titleId);
                addToListBtn.innerHTML = '✓ En Mi Lista';
                showNotification('Añadido a Mi Lista');
                await loadMyList(); // Recargar Mi Lista
            }
        } catch (error) {
            console.error('Error al actualizar lista:', error);
            showNotification('Error al actualizar Mi Lista', true);
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
});

// Agregar estilos de animación si no existen
if (!document.querySelector('style[data-animations]')) {
    const style = document.createElement('style');
    style.setAttribute('data-animations', 'true');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

async function loadContent() {
    // Aquí se puede implementar la carga de títulos, series, películas, etc.
    // Por ahora solo mostramos placeholders
    
    try {
        // Intentar cargar títulos (endpoint aún no implementado en el backend)
        // const titles = await api.getTitles();
        // renderTitles(titles);
        
        console.log('Contenido placeholder cargado');
    } catch (error) {
        console.error('Error al cargar contenido:', error);
    }
}

function renderTitles(titles) {
    // Función para renderizar títulos cuando estén disponibles
    const popularContent = document.getElementById('popularContent');
    
    if (!titles || titles.length === 0) {
        return;
    }

    popularContent.innerHTML = titles.map(title => `
        <div class="content-card" onclick="viewTitle('${title.id}')">
            <div class="card-image">
                ${title.thumbnail_url 
                    ? `<img src="${title.thumbnail_url}" alt="${title.title}">` 
                    : '<div class="placeholder-icon">🎬</div>'
                }
            </div>
            <div class="card-info">
                <h3>${title.title}</h3>
                <p>${title.description || 'Sin descripción'}</p>
            </div>
        </div>
    `).join('');
}

function viewTitle(titleId) {
    console.log('Ver título:', titleId);
    // Implementar navegación a la página de detalles del título
    // window.location.href = `watch.html?id=${titleId}`;
}
