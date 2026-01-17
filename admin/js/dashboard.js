// admin.js - Funcionalidad para el panel de administración

document.addEventListener('DOMContentLoaded', async () => {
    console.log('[Dashboard] Iniciando verificación de permisos...');
    console.log('[Dashboard] api.isAuthenticated():', api.isAuthenticated());
    console.log('[Dashboard] api.isAdmin():', api.isAdmin());
    console.log('[Dashboard] User:', api.getUser());
    
    // Verificar autenticación (fallback)
    if (!api.isAuthenticated()) {
        console.log('[Dashboard] Usuario no autenticado, redirigiendo a login');
        window.location.href = '/index.html';
        return;
    }

    // Verificar si es admin (fallback)
    if (!api.isAdmin()) {
        console.log('[Dashboard] Usuario no es admin, redirigiendo a home');
        alert('No tienes permisos de administrador');
        window.location.href = '/home.html';
        return;
    }
    
    console.log('[Dashboard] Acceso concedido, cargando dashboard...');

    const user = api.getUser();
    if (user && user.name) {
        document.getElementById('userName').textContent = user.name;
    }

    // Variables del DOM
    const statsGrid = document.getElementById('statsGrid');
    const loadingStats = document.getElementById('loadingStats');
    const topContentList = document.getElementById('topContentList');
    const loadingViews = document.getElementById('loadingViews');
    const recentUsersList = document.getElementById('recentUsersList');
    const loadingUsers = document.getElementById('loadingUsers');
    const logoutBtn = document.getElementById('logoutBtn');

    // Cargar datos
    await loadStats();
    await loadTopContent();
    await loadRecentUsers();

    // Event Listeners
    logoutBtn.addEventListener('click', () => api.logout());

    // Funciones
    async function loadStats() {
        loadingStats.style.display = 'flex';
        
        try {
            const stats = await api.getAdminStats();
            displayStats(stats);
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
            statsGrid.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 40px; grid-column: 1/-1;">Error al cargar estadísticas</p>';
        } finally {
            loadingStats.style.display = 'none';
        }
    }

    function displayStats(stats) {
        const statCards = [
            {
                icon: '👥',
                title: 'Total Usuarios',
                value: stats.total_users || 0,
                color: '#2196f3'
            },
            {
                icon: '🎬',
                title: 'Total Películas',
                value: stats.total_movies || 0,
                color: '#4caf50'
            },
            {
                icon: '📺',
                title: 'Total Series',
                value: stats.total_series || 0,
                color: '#ff9800'
            },
            {
                icon: '▶️',
                title: 'Reproducciones Hoy',
                value: stats.views_today || 0,
                color: '#e91e63'
            },
            {
                icon: '⭐',
                title: 'Calificación Promedio',
                value: (stats.average_rating || 0).toFixed(1),
                color: '#ffc107'
            },
            {
                icon: '📌',
                title: 'Items en Listas',
                value: stats.total_in_lists || 0,
                color: '#9c27b0'
            }
        ];

        statsGrid.innerHTML = statCards.map(card => `
            <div class="stat-card" style="background: var(--card-bg); padding: 20px; border-radius: var(--border-radius); border-left: 4px solid ${card.color};">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 8px;">${card.title}</p>
                        <h3 style="font-size: 2rem; font-weight: 700;">${card.value}</h3>
                    </div>
                    <div style="font-size: 3rem; opacity: 0.3;">${card.icon}</div>
                </div>
            </div>
        `).join('');
    }

    async function loadTopContent() {
        loadingViews.style.display = 'flex';
        
        try {
            const response = await api.getViewStats({ limit: 10, order_by: 'views_desc' });
            const content = response.content || [];
            displayTopContent(content);
        } catch (error) {
            console.error('Error al cargar contenido más visto:', error);
            topContentList.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 40px;">Error al cargar datos</p>';
        } finally {
            loadingViews.style.display = 'none';
        }
    }

    function displayTopContent(content) {
        if (!content || content.length === 0) {
            topContentList.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 40px;">No hay datos disponibles</p>';
            return;
        }

        topContentList.innerHTML = content.map((item, index) => `
            <div class="admin-list-item" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: var(--card-bg); border-radius: var(--border-radius); margin-bottom: 10px;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <span style="font-size: 1.5rem; font-weight: 700; color: var(--text-secondary); min-width: 30px;">#${index + 1}</span>
                    <div>
                        <h4 style="margin-bottom: 5px;">${item.title}</h4>
                        <p style="color: var(--text-secondary); font-size: 0.85rem;">
                            ${item.type === 'movie' ? '🎬 Película' : '📺 Serie'} • ${item.views || 0} visualizaciones
                        </p>
                    </div>
                </div>
                <div style="text-align: right;">
                    <p style="color: var(--primary-color); font-size: 1.2rem; font-weight: 700;">${item.views || 0}</p>
                    <p style="color: var(--text-secondary); font-size: 0.75rem;">vistas</p>
                </div>
            </div>
        `).join('');
    }

    async function loadRecentUsers() {
        loadingUsers.style.display = 'flex';
        
        try {
            const response = await api.getAllUsers({ limit: 10, order_by: 'created_desc' });
            const users = response.users || [];
            displayRecentUsers(users);
        } catch (error) {
            console.error('Error al cargar usuarios recientes:', error);
            recentUsersList.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 40px;">Error al cargar datos</p>';
        } finally {
            loadingUsers.style.display = 'none';
        }
    }

    function displayRecentUsers(users) {
        if (!users || users.length === 0) {
            recentUsersList.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 40px;">No hay usuarios registrados</p>';
            return;
        }

        recentUsersList.innerHTML = users.map(user => {
            const date = new Date(user.created_at).toLocaleDateString('es-ES');
            const initial = (user.name || user.email || 'U').charAt(0).toUpperCase();
            
            return `
                <div class="admin-list-item" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: var(--card-bg); border-radius: var(--border-radius); margin-bottom: 10px;">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <div style="width: 50px; height: 50px; border-radius: 50%; background: var(--primary-color); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700;">
                            ${initial}
                        </div>
                        <div>
                            <h4 style="margin-bottom: 5px;">${user.name || 'Sin nombre'}</h4>
                            <p style="color: var(--text-secondary); font-size: 0.85rem;">${user.email}</p>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <p style="color: var(--text-secondary); font-size: 0.85rem;">Registrado</p>
                        <p style="font-weight: 600;">${date}</p>
                    </div>
                </div>
            `;
        }).join('');
    }
});
