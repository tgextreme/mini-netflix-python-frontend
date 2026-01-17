// profile.js - Funcionalidad para la página de perfil

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    if (!api.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    const user = api.getUser();
    
    // Actualizar información del usuario
    if (user) {
        document.getElementById('userName').textContent = user.name || 'Usuario';
        document.getElementById('profileName').textContent = user.name || 'Usuario';
        document.getElementById('profileEmail').textContent = user.email || '';
        
        // Avatar inicial
        const initial = (user.name || 'U').charAt(0).toUpperCase();
        document.getElementById('userAvatar').textContent = initial;
    }

    // Variables del DOM
    const logoutBtn = document.getElementById('logoutBtn');
    const myListGrid = document.getElementById('myListGrid');
    const continueWatchingGrid = document.getElementById('continueWatchingGrid');
    const historyList = document.getElementById('historyList');
    const profilesList = document.getElementById('profilesList');
    const addProfileBtn = document.getElementById('addProfileBtn');

    // Modales
    const contentModal = document.getElementById('contentModal');
    const modalClose = document.getElementById('modalClose');
    const playBtn = document.getElementById('playBtn');
    const removeFromListBtn = document.getElementById('removeFromListBtn');

    const profileModal = document.getElementById('profileModal');
    const profileModalClose = document.getElementById('profileModalClose');
    const createProfileForm = document.getElementById('createProfileForm');

    let selectedTitle = null;

    // Cargar datos
    await loadMyList();
    await loadContinueWatching();
    await loadWatchHistory();
    await loadProfiles();

    // Event Listeners
    logoutBtn.addEventListener('click', () => api.logout());

    addProfileBtn.addEventListener('click', () => {
        profileModal.classList.add('show');
    });

    modalClose.addEventListener('click', () => {
        contentModal.classList.remove('show');
    });

    contentModal.addEventListener('click', (e) => {
        if (e.target === contentModal) {
            contentModal.classList.remove('show');
        }
    });

    profileModalClose.addEventListener('click', () => {
        profileModal.classList.remove('show');
    });

    profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal) {
            profileModal.classList.remove('show');
        }
    });

    playBtn.addEventListener('click', () => {
        if (selectedTitle) {
            window.location.href = `watch.html?id=${selectedTitle.id}`;
        }
    });

    removeFromListBtn.addEventListener('click', async () => {
        if (selectedTitle) {
            await removeFromMyList(selectedTitle.id);
            contentModal.classList.remove('show');
        }
    });

    createProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await createNewProfile();
    });

    // Funciones - Mi Lista
    async function loadMyList() {
        const loading = document.getElementById('loadingMyList');
        const empty = document.getElementById('emptyMyList');
        
        loading.style.display = 'flex';
        
        try {
            const response = await api.getMyList();
            const titles = response.titles || response || [];
            
            if (titles.length === 0) {
                empty.style.display = 'block';
                myListGrid.style.display = 'none';
            } else {
                empty.style.display = 'none';
                myListGrid.style.display = 'grid';
                displayTitles(myListGrid, titles);
            }
        } catch (error) {
            console.error('Error al cargar Mi Lista:', error);
            empty.style.display = 'block';
        } finally {
            loading.style.display = 'none';
        }
    }

    async function removeFromMyList(titleId) {
        try {
            await api.removeFromMyList(titleId);
            showNotification('Eliminado de Mi Lista');
            await loadMyList();
        } catch (error) {
            console.error('Error al eliminar:', error);
            showNotification('Error al eliminar', true);
        }
    }

    // Funciones - Continuar Viendo
    async function loadContinueWatching() {
        const loading = document.getElementById('loadingContinue');
        const empty = document.getElementById('emptyContinue');
        
        loading.style.display = 'flex';
        
        try {
            const response = await api.getContinueWatching(20);
            const items = response.items || response || [];
            
            if (items.length === 0) {
                empty.style.display = 'block';
                continueWatchingGrid.style.display = 'none';
            } else {
                empty.style.display = 'none';
                continueWatchingGrid.style.display = 'grid';
                
                // Extraer títulos de los items
                const titles = items.map(item => ({
                    ...item.title,
                    progress: item.progress_percentage
                }));
                displayTitles(continueWatchingGrid, titles, true);
            }
        } catch (error) {
            console.error('Error al cargar continuar viendo:', error);
            empty.style.display = 'block';
        } finally {
            loading.style.display = 'none';
        }
    }

    // Funciones - Historial
    async function loadWatchHistory() {
        const loading = document.getElementById('loadingHistory');
        const empty = document.getElementById('emptyHistory');
        
        loading.style.display = 'flex';
        
        try {
            const response = await api.getWatchHistory();
            const history = response.history || response || [];
            
            if (history.length === 0) {
                empty.style.display = 'block';
                historyList.innerHTML = '';
            } else {
                empty.style.display = 'none';
                displayHistory(history);
            }
        } catch (error) {
            console.error('Error al cargar historial:', error);
            empty.style.display = 'block';
        } finally {
            loading.style.display = 'none';
        }
    }

    function displayHistory(history) {
        historyList.innerHTML = '';
        
        history.forEach(item => {
            const entry = document.createElement('div');
            entry.style.cssText = `
                padding: 15px;
                background: var(--card-bg);
                border-radius: var(--border-radius);
                margin-bottom: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
                transition: var(--transition);
            `;
            
            entry.addEventListener('mouseenter', () => {
                entry.style.background = '#3a3a3a';
            });
            
            entry.addEventListener('mouseleave', () => {
                entry.style.background = 'var(--card-bg)';
            });
            
            const title = item.title || {};
            const date = new Date(item.watched_at || item.created_at).toLocaleDateString('es-ES');
            const progress = item.progress_percentage || 0;
            
            entry.innerHTML = `
                <div>
                    <h4 style="margin-bottom: 5px;">${title.title || 'Título desconocido'}</h4>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">
                        Visto el ${date} • ${progress}% completado
                    </p>
                </div>
                <button class="btn btn-secondary" style="width: auto; padding: 8px 16px;">
                    Ver
                </button>
            `;
            
            entry.addEventListener('click', () => {
                if (title.id) {
                    window.location.href = `watch.html?id=${title.id}`;
                }
            });
            
            historyList.appendChild(entry);
        });
    }

    // Funciones - Perfiles
    async function loadProfiles() {
        const loading = document.getElementById('loadingProfiles');
        
        loading.style.display = 'flex';
        
        try {
            const profiles = await api.getProfiles();
            displayProfiles(profiles);
        } catch (error) {
            console.error('Error al cargar perfiles:', error);
            profilesList.innerHTML = '<p style="color: var(--text-secondary);">Error al cargar perfiles</p>';
        } finally {
            loading.style.display = 'none';
        }
    }

    function displayProfiles(profiles) {
        profilesList.innerHTML = '';
        
        if (!profiles || profiles.length === 0) {
            profilesList.innerHTML = '<p style="color: var(--text-secondary);">No hay perfiles creados</p>';
            return;
        }
        
        profiles.forEach(profile => {
            const card = document.createElement('div');
            card.style.cssText = `
                padding: 20px;
                background: var(--card-bg);
                border-radius: var(--border-radius);
                text-align: center;
                cursor: pointer;
                transition: var(--transition);
            `;
            
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'scale(1.05)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'scale(1)';
            });
            
            const icon = profile.is_kids ? '👶' : '👤';
            const initial = (profile.name || 'P').charAt(0).toUpperCase();
            
            card.innerHTML = `
                <div style="width: 80px; height: 80px; margin: 0 auto 15px; background: var(--primary-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem;">
                    ${icon}
                </div>
                <h3 style="margin-bottom: 5px;">${profile.name}</h3>
                <p style="color: var(--text-secondary); font-size: 0.85rem;">
                    ${profile.is_kids ? 'Perfil infantil' : 'Perfil principal'}
                </p>
            `;
            
            card.addEventListener('click', () => {
                selectProfile(profile);
            });
            
            profilesList.appendChild(card);
        });
    }

    function selectProfile(profile) {
        api.saveProfileId(profile.id);
        showNotification(`Perfil cambiado a: ${profile.name}`);
        
        // Recargar datos con el nuevo perfil
        setTimeout(async () => {
            await loadMyList();
            await loadContinueWatching();
            await loadWatchHistory();
        }, 500);
    }

    async function createNewProfile() {
        const name = document.getElementById('profileNameInput').value.trim();
        const isKids = document.getElementById('isKidsCheckbox').checked;
        
        if (!name) return;
        
        try {
            await api.createProfile(name, isKids);
            showNotification('Perfil creado exitosamente');
            profileModal.classList.remove('show');
            createProfileForm.reset();
            await loadProfiles();
        } catch (error) {
            console.error('Error al crear perfil:', error);
            showNotification('Error al crear perfil', true);
        }
    }

    // Funciones generales
    function displayTitles(container, titles, showProgress = false) {
        container.innerHTML = '';
        
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
                ${showProgress ? `
                    <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 5px; background: rgba(255,255,255,0.3);">
                        <div style="height: 100%; background: var(--primary-color); width: ${title.progress || 0}%;"></div>
                    </div>
                ` : ''}
            </div>
            <div class="card-info">
                <h3>${title.title}</h3>
                <p>${year} • ${title.genre || 'General'}</p>
                ${showProgress ? `<p style="color: var(--primary-color); font-size: 0.85rem;">${Math.round(title.progress || 0)}% visto</p>` : ''}
            </div>
        `;
        
        card.addEventListener('click', () => showTitleModal(title));
        
        return card;
    }

    function showTitleModal(title) {
        selectedTitle = title;
        
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
        
        contentModal.classList.add('show');
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
