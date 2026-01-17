// Sistema de Internacionalización (i18n) para RustFlix

class I18n {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || CONFIG.APP.LANGUAGE || 'es';
        this.translations = {};
        this.fallbackLanguage = 'es';
        
        this.loadTranslations();
    }

    getStoredLanguage() {
        return localStorage.getItem(CONFIG.STORAGE.LANGUAGE);
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem(CONFIG.STORAGE.LANGUAGE, lang);
            this.updatePageTexts();
            return true;
        }
        return false;
    }

    loadTranslations() {
        // Cargar traducciones de todos los idiomas soportados
        this.translations = TRANSLATIONS;
    }

    t(key, params = {}) {
        const keys = key.split('.');
        let translation = this.translations[this.currentLanguage];
        
        // Navegar por el objeto de traducciones
        for (const k of keys) {
            if (translation && typeof translation === 'object' && k in translation) {
                translation = translation[k];
            } else {
                // Fallback al idioma por defecto
                translation = this.translations[this.fallbackLanguage];
                for (const fk of keys) {
                    if (translation && typeof translation === 'object' && fk in translation) {
                        translation = translation[fk];
                    } else {
                        return key; // Devolver la key si no se encuentra
                    }
                }
                break;
            }
        }
        
        // Reemplazar parámetros
        if (typeof translation === 'string') {
            Object.keys(params).forEach(param => {
                translation = translation.replace(`{${param}}`, params[param]);
            });
        }
        
        return translation || key;
    }

    updatePageTexts() {
        // Actualizar todos los elementos con data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });

        // Actualizar placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });

        // Actualizar títulos
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });
    }

    getAvailableLanguages() {
        return Object.keys(this.translations);
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

// Traducciones
const TRANSLATIONS = {
    es: {
        common: {
            appName: 'RustFlix',
            loading: 'Cargando...',
            error: 'Error',
            success: 'Éxito',
            cancel: 'Cancelar',
            confirm: 'Confirmar',
            save: 'Guardar',
            delete: 'Eliminar',
            edit: 'Editar',
            close: 'Cerrar',
            search: 'Buscar',
            filter: 'Filtrar',
            all: 'Todos',
            movies: 'Películas',
            series: 'Series',
            logout: 'Cerrar Sesión',
        },
        auth: {
            login: 'Iniciar Sesión',
            register: 'Registrarse',
            email: 'Email',
            password: 'Contraseña',
            confirmPassword: 'Confirmar Contraseña',
            name: 'Nombre',
            forgotPassword: '¿Olvidaste tu contraseña?',
            noAccount: '¿No tienes cuenta?',
            hasAccount: '¿Ya tienes cuenta?',
            createAccount: 'Crear Cuenta',
            loginError: 'Error al iniciar sesión',
            registerError: 'Error al registrarse',
            invalidCredentials: 'Credenciales inválidas',
            emailRequired: 'El email es requerido',
            passwordRequired: 'La contraseña es requerida',
            passwordMismatch: 'Las contraseñas no coinciden',
            passwordMinLength: 'La contraseña debe tener al menos 6 caracteres',
        },
        home: {
            welcome: 'Bienvenido, {name}',
            trending: 'Tendencias',
            continueWatching: 'Continuar Viendo',
            recommended: 'Recomendado para Ti',
            myList: 'Mi Lista',
            featured: 'Destacado',
            playNow: 'Reproducir',
            moreInfo: 'Más Información',
        },
        browse: {
            title: 'Explorar',
            searchPlaceholder: 'Buscar películas y series...',
            noResults: 'No se encontraron resultados',
            filterAll: 'Todos',
            filterMovies: 'Películas',
            filterSeries: 'Series',
        },
        watch: {
            play: 'Reproducir',
            pause: 'Pausar',
            volume: 'Volumen',
            fullscreen: 'Pantalla Completa',
            exitFullscreen: 'Salir de Pantalla Completa',
            subtitles: 'Subtítulos',
            noSubtitles: 'Sin subtítulos',
            playbackSpeed: 'Velocidad',
            quality: 'Calidad',
        },
        profile: {
            title: 'Mi Perfil',
            myList: 'Mi Lista',
            history: 'Historial',
            settings: 'Configuración',
            language: 'Idioma',
            theme: 'Tema',
            editProfile: 'Editar Perfil',
            changePassword: 'Cambiar Contraseña',
        },
        admin: {
            dashboard: 'Panel de Administración',
            users: 'Usuarios',
            content: 'Contenido',
            statistics: 'Estadísticas',
            createContent: 'Crear Contenido',
            editContent: 'Editar Contenido',
            deleteContent: 'Eliminar Contenido',
            totalUsers: 'Total de Usuarios',
            totalContent: 'Total de Contenido',
            totalViews: 'Total de Reproducciones',
        },
        errors: {
            network: 'Error de conexión. Por favor verifica tu internet.',
            unauthorized: 'Sesión expirada. Por favor inicia sesión nuevamente.',
            forbidden: 'No tienes permisos para realizar esta acción.',
            notFound: 'El recurso solicitado no fue encontrado.',
            serverError: 'Error del servidor. Por favor intenta más tarde.',
            validation: 'Los datos proporcionados no son válidos.',
            generic: 'Ocurrió un error inesperado. Por favor intenta nuevamente.',
        },
        success: {
            login: '¡Bienvenido!',
            register: 'Cuenta creada exitosamente.',
            passwordReset: 'Contraseña actualizada correctamente.',
            addedToList: 'Agregado a Mi Lista.',
            removedFromList: 'Eliminado de Mi Lista.',
            ratingSaved: 'Calificación guardada.',
            contentCreated: 'Contenido creado exitosamente.',
            contentUpdated: 'Contenido actualizado exitosamente.',
            contentDeleted: 'Contenido eliminado exitosamente.',
        },
    },
    en: {
        common: {
            appName: 'RustFlix',
            loading: 'Loading...',
            error: 'Error',
            success: 'Success',
            cancel: 'Cancel',
            confirm: 'Confirm',
            save: 'Save',
            delete: 'Delete',
            edit: 'Edit',
            close: 'Close',
            search: 'Search',
            filter: 'Filter',
            all: 'All',
            movies: 'Movies',
            series: 'Series',
            logout: 'Logout',
        },
        auth: {
            login: 'Login',
            register: 'Sign Up',
            email: 'Email',
            password: 'Password',
            confirmPassword: 'Confirm Password',
            name: 'Name',
            forgotPassword: 'Forgot your password?',
            noAccount: "Don't have an account?",
            hasAccount: 'Already have an account?',
            createAccount: 'Create Account',
            loginError: 'Login error',
            registerError: 'Registration error',
            invalidCredentials: 'Invalid credentials',
            emailRequired: 'Email is required',
            passwordRequired: 'Password is required',
            passwordMismatch: 'Passwords do not match',
            passwordMinLength: 'Password must be at least 6 characters',
        },
        home: {
            welcome: 'Welcome, {name}',
            trending: 'Trending Now',
            continueWatching: 'Continue Watching',
            recommended: 'Recommended for You',
            myList: 'My List',
            featured: 'Featured',
            playNow: 'Play Now',
            moreInfo: 'More Info',
        },
        browse: {
            title: 'Browse',
            searchPlaceholder: 'Search movies and series...',
            noResults: 'No results found',
            filterAll: 'All',
            filterMovies: 'Movies',
            filterSeries: 'Series',
        },
        watch: {
            play: 'Play',
            pause: 'Pause',
            volume: 'Volume',
            fullscreen: 'Fullscreen',
            exitFullscreen: 'Exit Fullscreen',
            subtitles: 'Subtitles',
            noSubtitles: 'No subtitles',
            playbackSpeed: 'Speed',
            quality: 'Quality',
        },
        profile: {
            title: 'My Profile',
            myList: 'My List',
            history: 'History',
            settings: 'Settings',
            language: 'Language',
            theme: 'Theme',
            editProfile: 'Edit Profile',
            changePassword: 'Change Password',
        },
        admin: {
            dashboard: 'Admin Dashboard',
            users: 'Users',
            content: 'Content',
            statistics: 'Statistics',
            createContent: 'Create Content',
            editContent: 'Edit Content',
            deleteContent: 'Delete Content',
            totalUsers: 'Total Users',
            totalContent: 'Total Content',
            totalViews: 'Total Views',
        },
        errors: {
            network: 'Connection error. Please check your internet.',
            unauthorized: 'Session expired. Please login again.',
            forbidden: "You don't have permission to perform this action.",
            notFound: 'The requested resource was not found.',
            serverError: 'Server error. Please try again later.',
            validation: 'The provided data is not valid.',
            generic: 'An unexpected error occurred. Please try again.',
        },
        success: {
            login: 'Welcome!',
            register: 'Account created successfully.',
            passwordReset: 'Password updated successfully.',
            addedToList: 'Added to My List.',
            removedFromList: 'Removed from My List.',
            ratingSaved: 'Rating saved.',
            contentCreated: 'Content created successfully.',
            contentUpdated: 'Content updated successfully.',
            contentDeleted: 'Content deleted successfully.',
        },
    },
    pt: {
        common: {
            appName: 'RustFlix',
            loading: 'Carregando...',
            error: 'Erro',
            success: 'Sucesso',
            cancel: 'Cancelar',
            confirm: 'Confirmar',
            save: 'Salvar',
            delete: 'Excluir',
            edit: 'Editar',
            close: 'Fechar',
            search: 'Buscar',
            filter: 'Filtrar',
            all: 'Todos',
            movies: 'Filmes',
            series: 'Séries',
            logout: 'Sair',
        },
        auth: {
            login: 'Entrar',
            register: 'Cadastrar',
            email: 'Email',
            password: 'Senha',
            confirmPassword: 'Confirmar Senha',
            name: 'Nome',
            forgotPassword: 'Esqueceu sua senha?',
            noAccount: 'Não tem uma conta?',
            hasAccount: 'Já tem uma conta?',
            createAccount: 'Criar Conta',
            loginError: 'Erro ao fazer login',
            registerError: 'Erro ao cadastrar',
            invalidCredentials: 'Credenciais inválidas',
            emailRequired: 'O email é obrigatório',
            passwordRequired: 'A senha é obrigatória',
            passwordMismatch: 'As senhas não correspondem',
            passwordMinLength: 'A senha deve ter pelo menos 6 caracteres',
        },
        home: {
            welcome: 'Bem-vindo, {name}',
            trending: 'Em Alta',
            continueWatching: 'Continuar Assistindo',
            recommended: 'Recomendado para Você',
            myList: 'Minha Lista',
            featured: 'Destaque',
            playNow: 'Reproduzir',
            moreInfo: 'Mais Informações',
        },
        browse: {
            title: 'Explorar',
            searchPlaceholder: 'Buscar filmes e séries...',
            noResults: 'Nenhum resultado encontrado',
            filterAll: 'Todos',
            filterMovies: 'Filmes',
            filterSeries: 'Séries',
        },
        watch: {
            play: 'Reproduzir',
            pause: 'Pausar',
            volume: 'Volume',
            fullscreen: 'Tela Cheia',
            exitFullscreen: 'Sair da Tela Cheia',
            subtitles: 'Legendas',
            noSubtitles: 'Sem legendas',
            playbackSpeed: 'Velocidade',
            quality: 'Qualidade',
        },
        profile: {
            title: 'Meu Perfil',
            myList: 'Minha Lista',
            history: 'Histórico',
            settings: 'Configurações',
            language: 'Idioma',
            theme: 'Tema',
            editProfile: 'Editar Perfil',
            changePassword: 'Alterar Senha',
        },
        admin: {
            dashboard: 'Painel de Administração',
            users: 'Usuários',
            content: 'Conteúdo',
            statistics: 'Estatísticas',
            createContent: 'Criar Conteúdo',
            editContent: 'Editar Conteúdo',
            deleteContent: 'Excluir Conteúdo',
            totalUsers: 'Total de Usuários',
            totalContent: 'Total de Conteúdo',
            totalViews: 'Total de Visualizações',
        },
        errors: {
            network: 'Erro de conexão. Por favor, verifique sua internet.',
            unauthorized: 'Sessão expirada. Por favor, faça login novamente.',
            forbidden: 'Você não tem permissão para realizar esta ação.',
            notFound: 'O recurso solicitado não foi encontrado.',
            serverError: 'Erro do servidor. Por favor, tente mais tarde.',
            validation: 'Os dados fornecidos não são válidos.',
            generic: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
        },
        success: {
            login: 'Bem-vindo!',
            register: 'Conta criada com sucesso.',
            passwordReset: 'Senha atualizada corretamente.',
            addedToList: 'Adicionado à Minha Lista.',
            removedFromList: 'Removido da Minha Lista.',
            ratingSaved: 'Avaliação salva.',
            contentCreated: 'Conteúdo criado com sucesso.',
            contentUpdated: 'Conteúdo atualizado com sucesso.',
            contentDeleted: 'Conteúdo excluído com sucesso.',
        },
    },
};

// Inicializar i18n
const i18n = new I18n();

// Helper global para traducciones
function t(key, params) {
    return i18n.t(key, params);
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { I18n, TRANSLATIONS, i18n, t };
}
