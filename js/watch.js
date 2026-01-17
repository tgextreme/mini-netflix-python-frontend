// watch.js - Funcionalidad para la página de reproducción

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    if (!api.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    // Obtener ID del título desde URL
    const urlParams = new URLSearchParams(window.location.search);
    const titleId = urlParams.get('id');
    const seasonNumber = urlParams.get('season');
    const episodeNumber = urlParams.get('episode');

    if (!titleId) {
        showError();
        return;
    }

    const isEpisode = seasonNumber && episodeNumber;

    // Variables del DOM
    const loadingSpinner = document.getElementById('loadingSpinner');
    const videoSection = document.getElementById('videoSection');
    const errorMessage = document.getElementById('errorMessage');
    const videoPlayer = document.getElementById('videoPlayer');
    const videoSource = document.getElementById('videoSource');
    const backBtn = document.getElementById('backBtn');
    const addToListBtn = document.getElementById('addToListBtn');
    const rateBtn = document.getElementById('rateBtn');

    // Modal de calificación
    const ratingModal = document.getElementById('ratingModal');
    const ratingModalClose = document.getElementById('ratingModalClose');
    const ratingStars = document.querySelectorAll('.rating-star');
    const submitRating = document.getElementById('submitRating');

    let currentTitle = null;
    let selectedRating = 0;
    let watchProgressInterval = null;

    // Cargar datos del título
    await loadTitle();

    // Event Listeners
    backBtn.addEventListener('click', () => {
        window.history.back();
    });

    addToListBtn.addEventListener('click', async () => {
        await toggleMyList();
    });

    rateBtn.addEventListener('click', () => {
        ratingModal.classList.add('show');
    });

    ratingModalClose.addEventListener('click', () => {
        ratingModal.classList.remove('show');
    });

    ratingModal.addEventListener('click', (e) => {
        if (e.target === ratingModal) {
            ratingModal.classList.remove('show');
        }
    });

    // Sistema de estrellas
    ratingStars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.rating);
            updateStars(selectedRating);
        });

        star.addEventListener('mouseenter', () => {
            const rating = parseInt(star.dataset.rating);
            updateStars(rating, true);
        });
    });

    document.getElementById('ratingStars').addEventListener('mouseleave', () => {
        updateStars(selectedRating);
    });

    submitRating.addEventListener('click', async () => {
        if (selectedRating > 0) {
            await submitRatingToApi();
        }
    });

    // Seguimiento de progreso de visualización
    let playbackSession = null;

    videoPlayer.addEventListener('loadedmetadata', async () => {
        // Intentar cargar el progreso previo
        try {
            const episodeId = isEpisode ? currentTitle.id : null;
            const progress = await api.getWatchProgress(titleId, episodeId);
            if (progress && progress.progress_seconds) {
                videoPlayer.currentTime = progress.progress_seconds;
            }
        } catch (error) {
            console.log('No hay progreso previo');
        }
    });

    videoPlayer.addEventListener('play', async () => {
        // Iniciar sesión de playback
        try {
            const episodeId = isEpisode ? currentTitle.id : null;
            playbackSession = await api.startPlayback(
                titleId,
                episodeId,
                Math.floor(videoPlayer.currentTime),
                Math.floor(videoPlayer.duration)
            );
            console.log('Sesión de reproducción iniciada:', playbackSession.session_id);
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        }

        // Enviar heartbeat cada 10 segundos
        watchProgressInterval = setInterval(async () => {
            await sendProgressHeartbeat();
        }, 10000);
    });

    videoPlayer.addEventListener('pause', async () => {
        if (watchProgressInterval) {
            clearInterval(watchProgressInterval);
            watchProgressInterval = null;
        }
        await sendProgressUpdate();
    });

    videoPlayer.addEventListener('ended', async () => {
        if (watchProgressInterval) {
            clearInterval(watchProgressInterval);
            watchProgressInterval = null;
        }
        await stopPlaybackSession();
        
        // Si es un episodio, verificar si hay siguiente episodio
        if (isEpisode) {
            await showNextEpisodePrompt();
        }
    });

    // Guardar progreso antes de salir
    window.addEventListener('beforeunload', async () => {
        if (watchProgressInterval) {
            clearInterval(watchProgressInterval);
        }
        await stopPlaybackSession();
    });

    // Funciones
    async function loadTitle() {
        try {
            if (isEpisode) {
                // Cargar episodio específico
                currentTitle = await api.getEpisode(titleId, seasonNumber, episodeNumber);
                currentTitle.series_id = titleId;
                currentTitle.season_number = seasonNumber;
                currentTitle.episode_number = episodeNumber;
            } else {
                currentTitle = await api.getTitle(titleId);
            }
            await displayTitle(currentTitle);
            
            // Verificar si está en Mi Lista
            try {
                const inList = await api.isInMyList(titleId);
                addToListBtn.innerHTML = inList.in_list ? '✓ En Mi Lista' : '➕ Añadir a Mi Lista';
            } catch (error) {
                console.error('Error al verificar lista:', error);
            }

            // Cargar calificación existente
            try {
                const rating = await api.getRating(titleId);
                if (rating && rating.rating) {
                    selectedRating = rating.rating;
                    updateStars(selectedRating);
                }
            } catch (error) {
                console.log('No hay calificación previa');
            }
            
            loadingSpinner.style.display = 'none';
            videoSection.style.display = 'block';
        } catch (error) {
            console.error('Error al cargar título:', error);
            showError();
        }
    }

    async function displayTitle(title) {
        // Mostrar título apropiado para episodios o películas
        if (isEpisode) {
            document.getElementById('titleName').textContent = 
                `${title.series_title || 'Serie'} - T${seasonNumber}:E${episodeNumber} - ${title.title || `Episodio ${episodeNumber}`}`;
        } else {
            document.getElementById('titleName').textContent = title.title;
        }
        
        const year = title.release_year || new Date(title.release_date || title.air_date).getFullYear() || '';
        const rating = title.content_rating || 'NR';
        const duration = title.duration_minutes ? `${title.duration_minutes} min` : '';
        const genre = title.genre || 'General';
        
        document.getElementById('titleMeta').innerHTML = `
            ${year ? `<span style="margin-right: 15px;">${year}</span>` : ''}
            <span style="margin-right: 15px;">${rating}</span>
            ${duration ? `<span style="margin-right: 15px;">${duration}</span>` : ''}
            <span>${genre}</span>
        `;
        
        document.getElementById('titleDescription').textContent = 
            title.description || 'Sin descripción disponible.';
        
        // Cargar video (en producción, esto vendría del backend)
        if (title.video_url) {
            videoSource.src = title.video_url;
            videoPlayer.load();
        } else {
            // Video de demostración
            videoSource.src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
            videoPlayer.load();
        }

        // Cargar subtítulos si están disponibles
        await loadSubtitles(title);
    }

    async function toggleMyList() {
        try {
            const inList = await api.isInMyList(titleId);
            
            if (inList.in_list) {
                await api.removeFromMyList(titleId);
                addToListBtn.innerHTML = '➕ Añadir a Mi Lista';
                showNotification('Eliminado de Mi Lista');
            } else {
                await api.addToMyList(titleId);
                addToListBtn.innerHTML = '✓ En Mi Lista';
                showNotification('Añadido a Mi Lista');
            }
        } catch (error) {
            console.error('Error al actualizar lista:', error);
            showNotification('Error al actualizar Mi Lista', true);
        }
    }

    async function saveWatchProgress() {
        if (!videoPlayer.duration || !videoPlayer.currentTime) return;
        
        try {
            const episodeId = isEpisode ? currentTitle.id : null;
            
            await api.updateProgress(
                titleId,
                episodeId,
                Math.floor(videoPlayer.currentTime),
                Math.floor(videoPlayer.duration)
            );
            console.log('Progreso guardado');
        } catch (error) {
            console.error('Error al guardar progreso:', error);
        }
    }

    async function sendProgressHeartbeat() {
        if (!videoPlayer.duration || !videoPlayer.currentTime) return;
        
        try {
            const episodeId = isEpisode ? currentTitle.id : null;
            
            await api.sendHeartbeat(
                titleId,
                episodeId,
                Math.floor(videoPlayer.currentTime),
                Math.floor(videoPlayer.duration)
            );
        } catch (error) {
            console.error('Error al enviar heartbeat:', error);
        }
    }

    async function sendProgressUpdate() {
        if (!videoPlayer.duration || !videoPlayer.currentTime) return;
        
        try {
            const episodeId = isEpisode ? currentTitle.id : null;
            
            await api.updateProgress(
                titleId,
                episodeId,
                Math.floor(videoPlayer.currentTime),
                Math.floor(videoPlayer.duration)
            );
        } catch (error) {
            console.error('Error al actualizar progreso:', error);
        }
    }

    async function stopPlaybackSession() {
        if (!videoPlayer.duration || !videoPlayer.currentTime) return;
        
        try {
            const episodeId = isEpisode ? currentTitle.id : null;
            
            await api.stopPlayback(
                titleId,
                episodeId,
                Math.floor(videoPlayer.currentTime),
                Math.floor(videoPlayer.duration)
            );
            console.log('Sesión de reproducción finalizada');
        } catch (error) {
            console.error('Error al finalizar sesión:', error);
        }
    }

    async function showNextEpisodePrompt() {
        if (!isEpisode || !currentTitle.id) return;
        
        try {
            const nextEpisode = await api.getNextEpisode(currentTitle.id);
            
            if (nextEpisode && nextEpisode.episode_id) {
                // Mostrar overlay para siguiente episodio
                const overlay = document.createElement('div');
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    flex-direction: column;
                `;
                
                overlay.innerHTML = `
                    <h2 style="color: white; margin-bottom: 20px;">Siguiente episodio</h2>
                    <h3 style="color: var(--primary-color); margin-bottom: 10px;">${nextEpisode.title}</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 30px;">
                        Temporada ${nextEpisode.season_number}, Episodio ${nextEpisode.episode_number}
                    </p>
                    <div style="display: flex; gap: 20px;">
                        <button id="playNextBtn" class="btn btn-primary">
                            ▶ Reproducir
                        </button>
                        <button id="goBackBtn" class="btn btn-secondary">
                            Volver
                        </button>
                    </div>
                `;
                
                document.body.appendChild(overlay);
                
                document.getElementById('playNextBtn').addEventListener('click', () => {
                    window.location.href = `watch.html?id=${titleId}&season=${nextEpisode.season_number}&episode=${nextEpisode.episode_number}`;
                });
                
                document.getElementById('goBackBtn').addEventListener('click', () => {
                    overlay.remove();
                    window.history.back();
                });
            }
        } catch (error) {
            console.error('Error al obtener siguiente episodio:', error);
        }
    }

    async function loadSubtitles(title) {
        try {
            const episodeId = isEpisode ? currentTitle.id : null;
            const response = await api.getSubtitles(titleId, episodeId);
            const subtitles = response.subtitles || [];

            // Limpiar tracks existentes
            const existingTracks = videoPlayer.querySelectorAll('track');
            existingTracks.forEach(track => track.remove());

            // Agregar nuevos tracks de subtítulos
            subtitles.forEach((subtitle, index) => {
                const track = document.createElement('track');
                track.kind = 'subtitles';
                track.label = subtitle.language_name || subtitle.language;
                track.srclang = subtitle.language;
                track.src = subtitle.url;
                
                // Hacer el primer track default
                if (index === 0) {
                    track.default = true;
                }
                
                videoPlayer.appendChild(track);
            });

            if (subtitles.length > 0) {
                console.log(`${subtitles.length} pistas de subtítulos cargadas`);
            }
        } catch (error) {
            console.log('No hay subtítulos disponibles o error al cargarlos:', error);
        }
    }

    function updateStars(rating, hover = false) {
        ratingStars.forEach((star, index) => {
            if (index < rating) {
                star.textContent = '★';
                star.style.color = hover ? 'var(--warning-color)' : 'var(--primary-color)';
            } else {
                star.textContent = '☆';
                star.style.color = 'var(--text-secondary)';
            }
        });
    }

    async function submitRatingToApi() {
        if (selectedRating === 0) return;
        
        try {
            await api.rateTitle(titleId, selectedRating);
            showNotification('Calificación enviada');
            ratingModal.classList.remove('show');
        } catch (error) {
            console.error('Error al enviar calificación:', error);
            showNotification('Error al enviar calificación', true);
        }
    }

    function showError() {
        loadingSpinner.style.display = 'none';
        errorMessage.style.display = 'block';
    }

    function showNotification(message, isError = false) {
        // Implementación simple de notificación
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

// Agregar estilos de animación
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    .rating-star {
        cursor: pointer;
        user-select: none;
        transition: all 0.2s ease;
    }
    .rating-star:hover {
        transform: scale(1.2);
    }
`;
document.head.appendChild(style);
