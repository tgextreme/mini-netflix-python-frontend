// series.js - Funcionalidad para la página de detalles de serie

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

    // Obtener ID de la serie desde URL
    const urlParams = new URLSearchParams(window.location.search);
    const seriesId = urlParams.get('id');

    if (!seriesId) {
        showError();
        return;
    }

    // Variables del DOM
    const loadingSpinner = document.getElementById('loadingSpinner');
    const seriesContent = document.getElementById('seriesContent');
    const errorMessage = document.getElementById('errorMessage');
    const logoutBtn = document.getElementById('logoutBtn');
    const playFirstBtn = document.getElementById('playFirstBtn');
    const addToListBtn = document.getElementById('addToListBtn');
    const seasonSelect = document.getElementById('seasonSelect');
    const episodesList = document.getElementById('episodesList');
    const loadingEpisodes = document.getElementById('loadingEpisodes');
    const noEpisodes = document.getElementById('noEpisodes');

    let currentSeries = null;
    let seasons = [];
    let currentSeasonNumber = 1;

    // Cargar datos de la serie
    await loadSeries();

    // Event Listeners
    logoutBtn.addEventListener('click', () => api.logout());

    playFirstBtn.addEventListener('click', () => {
        if (seasons.length > 0) {
            playEpisode(seriesId, 1, 1);
        }
    });

    addToListBtn.addEventListener('click', async () => {
        await toggleMyList();
    });

    seasonSelect.addEventListener('change', async (e) => {
        currentSeasonNumber = parseInt(e.target.value);
        await loadEpisodes(currentSeasonNumber);
    });

    // Funciones
    async function loadSeries() {
        try {
            currentSeries = await api.getTitle(seriesId);
            
            if (currentSeries.type !== 'series') {
                // Si es una película, redirigir a watch.html
                window.location.href = `watch.html?id=${seriesId}`;
                return;
            }

            displaySeries(currentSeries);
            
            // Cargar temporadas
            try {
                const seasonsData = await api.getSeasons(seriesId);
                seasons = seasonsData.seasons || [];
                displaySeasons(seasons);
                
                if (seasons.length > 0) {
                    await loadEpisodes(currentSeasonNumber);
                }
            } catch (error) {
                console.error('Error al cargar temporadas:', error);
                // Si no hay temporadas en el backend, mostrar mensaje
                noEpisodes.style.display = 'block';
            }
            
            // Verificar si está en Mi Lista
            try {
                const inList = await api.isInMyList(seriesId);
                addToListBtn.innerHTML = inList.in_list ? '✓ En Mi Lista' : '➕ Mi Lista';
            } catch (error) {
                console.error('Error al verificar lista:', error);
            }
            
            loadingSpinner.style.display = 'none';
            seriesContent.style.display = 'block';
        } catch (error) {
            console.error('Error al cargar serie:', error);
            showError();
        }
    }

    function displaySeries(series) {
        document.getElementById('seriesTitle').textContent = series.title;
        
        const year = series.release_year || new Date(series.release_date).getFullYear() || '';
        const rating = series.content_rating || 'NR';
        const genre = series.genre || 'General';
        const seasonsCount = seasons.length || '?';
        
        document.getElementById('seriesMeta').innerHTML = `
            <span style="margin-right: 15px;">${year}</span>
            <span style="margin-right: 15px;">${rating}</span>
            <span style="margin-right: 15px;">${genre}</span>
            <span>${seasonsCount} Temporadas</span>
        `;
        
        document.getElementById('seriesDescription').textContent = 
            series.description || 'Sin descripción disponible.';
        
        // Imagen de fondo del hero
        const imageUrl = series.thumbnail_url || series.poster_url;
        if (imageUrl) {
            document.getElementById('seriesHero').style.background = `
                linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.8)),
                url(${imageUrl}) center/cover
            `;
        }
    }

    function displaySeasons(seasons) {
        seasonSelect.innerHTML = '';
        
        if (!seasons || seasons.length === 0) {
            seasonSelect.innerHTML = '<option value="1">Temporada 1</option>';
            return;
        }
        
        seasons.forEach(season => {
            const option = document.createElement('option');
            option.value = season.season_number;
            option.textContent = `Temporada ${season.season_number}`;
            if (season.season_number === currentSeasonNumber) {
                option.selected = true;
            }
            seasonSelect.appendChild(option);
        });
    }

    async function loadEpisodes(seasonNumber) {
        loadingEpisodes.style.display = 'flex';
        episodesList.innerHTML = '';
        noEpisodes.style.display = 'none';
        
        try {
            const response = await api.getEpisodes(seriesId, seasonNumber);
            const episodes = response.episodes || [];
            
            if (episodes.length === 0) {
                noEpisodes.style.display = 'block';
            } else {
                displayEpisodes(episodes);
            }
        } catch (error) {
            console.error('Error al cargar episodios:', error);
            noEpisodes.style.display = 'block';
        } finally {
            loadingEpisodes.style.display = 'none';
        }
    }

    function displayEpisodes(episodes) {
        episodesList.innerHTML = '';
        
        episodes.forEach((episode, index) => {
            const episodeCard = createEpisodeCard(episode, index + 1);
            episodesList.appendChild(episodeCard);
        });
    }

    function createEpisodeCard(episode, number) {
        const card = document.createElement('div');
        card.className = 'episode-card';
        card.style.cursor = 'pointer';
        
        const thumbnail = episode.thumbnail_url || '';
        const duration = episode.duration_minutes ? `${episode.duration_minutes} min` : '';
        
        card.innerHTML = `
            <div class="episode-number">${number}</div>
            <div class="episode-thumbnail" style="background: ${thumbnail ? `url(${thumbnail})` : 'var(--card-bg)'} center/cover;">
                ${!thumbnail ? '<div class="placeholder-icon">▶️</div>' : ''}
                <div class="episode-play-overlay">
                    <span class="play-icon">▶️</span>
                </div>
            </div>
            <div class="episode-info">
                <div class="episode-header">
                    <h3 class="episode-title">${episode.title || `Episodio ${number}`}</h3>
                    <span class="episode-duration">${duration}</span>
                </div>
                <p class="episode-description">${episode.description || 'Sin descripción disponible.'}</p>
            </div>
        `;
        
        card.addEventListener('click', () => {
            playEpisode(seriesId, currentSeasonNumber, episode.episode_number);
        });
        
        return card;
    }

    function playEpisode(seriesId, seasonNumber, episodeNumber) {
        window.location.href = `watch.html?id=${seriesId}&season=${seasonNumber}&episode=${episodeNumber}`;
    }

    async function toggleMyList() {
        try {
            const inList = await api.isInMyList(seriesId);
            
            if (inList.in_list) {
                await api.removeFromMyList(seriesId);
                addToListBtn.innerHTML = '➕ Mi Lista';
                showNotification('Eliminado de Mi Lista');
            } else {
                await api.addToMyList(seriesId);
                addToListBtn.innerHTML = '✓ En Mi Lista';
                showNotification('Añadido a Mi Lista');
            }
        } catch (error) {
            console.error('Error al actualizar lista:', error);
            showNotification('Error al actualizar Mi Lista', true);
        }
    }

    function showError() {
        loadingSpinner.style.display = 'none';
        errorMessage.style.display = 'block';
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
