// js/auth.js
// Sistema de autenticación y perfil de usuario

const API_URL = 'https://api.soprimico.com';

// ============================================
// GESTIÓN DE SESIÓN
// ============================================

const Auth = {
    // Obtener token
    getToken() {
        return localStorage.getItem('soprimico_token');
    },
    
    // Guardar sesión
    saveSession(token, usuario) {
        localStorage.setItem('soprimico_token', token);
        localStorage.setItem('soprimico_usuario', JSON.stringify(usuario));
    },
    
    // Cerrar sesión
    logout() {
        localStorage.removeItem('soprimico_token');
        localStorage.removeItem('soprimico_usuario');
        window.location.reload();
    },
    
    // Obtener usuario actual (de localStorage)
    getUsuario() {
        const str = localStorage.getItem('soprimico_usuario');
        return str ? JSON.parse(str) : null;
    },
    
    // ¿Está logueado?
    isLoggedIn() {
        return !!this.getToken();
    },
    
    // Petición autenticada
    async fetchAuth(endpoint, options = {}) {
        const token = this.getToken();
        
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...(options.headers || {}),
            },
        });
        
        if (response.status === 401) {
            this.logout();
            throw new Error('Sesión expirada');
        }
        
        return response;
    }
};

// ============================================
// UI DEL HEADER - BOTÓN DE USUARIO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const userButton = document.getElementById('user-button');
    const userDropdown = document.getElementById('user-dropdown');
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    
    if (!userButton) return; // Si no hay botón de usuario, salir
    
    // Actualizar estado del botón
    function actualizarHeader() {
        const usuario = Auth.getUsuario();
        
        if (usuario) {
            // Usuario logueado
            userName.textContent = usuario.username;
            userAvatar.textContent = (usuario.nombre_completo || usuario.username).charAt(0).toUpperCase();
            userAvatar.style.background = 'linear-gradient(135deg, #222, #555)';
            
            userDropdown.innerHTML = `
                <div class="user-dropdown-header">
                    <strong>${usuario.nombre_completo || usuario.username}</strong>
                    <span>${usuario.email}</span>
                    <span class="plan-badge">${usuario.plan.toUpperCase()}</span>
                </div>
                <a href="perfil.html">👤 Mi Perfil</a>
                <a href="perfil.html#compras">🛍️ Mis Compras</a>
                <a href="perfil.html#suscripcion">💎 Mi Suscripción</a>
                <button class="logout-btn" onclick="Auth.logout()">🚪 Cerrar Sesión</button>
            `;
        } else {
            // No logueado
            userName.textContent = 'Entrar';
            userAvatar.textContent = '👤';
            userAvatar.className = 'user-avatar user-avatar-guest';
            
            userDropdown.innerHTML = `
                <a href="#" onclick="abrirModalLogin(event)">🔑 Iniciar Sesión</a>
                <a href="#" onclick="abrirModalRegister(event)">✨ Crear Cuenta</a>
            `;
        }
    }
    
    // Toggle dropdown
    userButton.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('active');
    });
    
    // Cerrar al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!userDropdown.contains(e.target) && !userButton.contains(e.target)) {
            userDropdown.classList.remove('active');
        }
    });
    
    actualizarHeader();
    
    // Exponer para el modal
    window.actualizarHeader = actualizarHeader;
});

// ============================================
// MODAL DE LOGIN/REGISTRO
// ============================================

function abrirModalLogin(event) {
    if (event) event.preventDefault();
    crearModal('login');
}

function abrirModalRegister(event) {
    if (event) event.preventDefault();
    crearModal('register');
}

function crearModal(tipoInicial = 'login') {
    // Cerrar dropdown
    document.getElementById('user-dropdown')?.classList.remove('active');
    
    // Eliminar modal previo si existe
    document.getElementById('auth-modal')?.remove();
    
    const modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
        <div class="modal">
            <button class="modal-close" onclick="cerrarModal()">×</button>
            <h2 id="modal-title">${tipoInicial === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
            
            <div class="modal-tabs">
                <button class="modal-tab ${tipoInicial === 'login' ? 'active' : ''}" data-tab="login">Iniciar Sesión</button>
                <button class="modal-tab ${tipoInicial === 'register' ? 'active' : ''}" data-tab="register">Registro</button>
            </div>
            
            <!-- Form Login -->
            <form class="modal-form ${tipoInicial === 'login' ? '' : 'hidden'}" id="form-login">
                <div class="form-group">
                    <label for="login-username">Usuario o Email</label>
                    <input type="text" id="login-username" required autocomplete="username">
                </div>
                <div class="form-group">
                    <label for="login-password">Contraseña</label>
                    <input type="password" id="login-password" required autocomplete="current-password">
                </div>
                <div class="form-error" id="login-error"></div>
                <button type="submit" class="btn btn-full">Entrar</button>
            </form>
            
            <!-- Form Register -->
            <form class="modal-form ${tipoInicial === 'register' ? '' : 'hidden'}" id="form-register">
                <div class="form-group">
                    <label for="reg-username">Usuario</label>
                    <input type="text" id="reg-username" required autocomplete="username" placeholder="min. 3 caracteres">
                </div>
                <div class="form-group">
                    <label for="reg-email">Email</label>
                    <input type="email" id="reg-email" required autocomplete="email">
                </div>
                <div class="form-group">
                    <label for="reg-nombre">Nombre completo (opcional)</label>
                    <input type="text" id="reg-nombre" autocomplete="name">
                </div>
                <div class="form-group">
                    <label for="reg-password">Contraseña</label>
                    <input type="password" id="reg-password" required autocomplete="new-password" placeholder="min. 8, 1 mayúscula, 1 número">
                </div>
                <div class="form-error" id="register-error"></div>
                <button type="submit" class="btn btn-full">Crear Cuenta</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Eventos de tabs
    modal.querySelectorAll('.modal-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            modal.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            document.getElementById('form-login').classList.toggle('hidden', target !== 'login');
            document.getElementById('form-register').classList.toggle('hidden', target !== 'register');
            document.getElementById('modal-title').textContent = target === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta';
        });
    });
    
    // Submit Login
    document.getElementById('form-login').addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorEl = document.getElementById('login-error');
        errorEl.textContent = '';
        errorEl.className = 'form-error';
        
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                errorEl.textContent = data.error || 'Error al iniciar sesión';
                return;
            }
            
            Auth.saveSession(data.token, data.usuario);
            errorEl.className = 'form-success';
            errorEl.textContent = '✅ ¡Bienvenido!';
            
            setTimeout(() => {
                cerrarModal();
                window.actualizarHeader();
                // Recargar la página si estamos en perfil
                if (window.location.pathname.includes('perfil')) {
                    window.location.reload();
                }
            }, 800);
            
        } catch (err) {
            errorEl.textContent = 'Error de conexión';
            console.error(err);
        }
    });
    
    // Submit Register
    document.getElementById('form-register').addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorEl = document.getElementById('register-error');
        errorEl.textContent = '';
        errorEl.className = 'form-error';
        
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const nombre_completo = document.getElementById('reg-nombre').value;
        const password = document.getElementById('reg-password').value;
        
        try {
            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, nombre_completo }),
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                errorEl.textContent = data.error || 'Error al registrar';
                return;
            }
            
            Auth.saveSession(data.token, data.usuario);
            errorEl.className = 'form-success';
            errorEl.textContent = '✅ ¡Cuenta creada! Bienvenido.';
            
            setTimeout(() => {
                cerrarModal();
                window.actualizarHeader();
            }, 800);
            
        } catch (err) {
            errorEl.textContent = 'Error de conexión';
            console.error(err);
        }
    });
    
    // Cerrar al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) cerrarModal();
    });
    
    // Cerrar con Escape
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            cerrarModal();
            document.removeEventListener('keydown', escHandler);
        }
    });
    
    // Focus en el primer input
    setTimeout(() => {
        const input = tipoInicial === 'login' 
            ? document.getElementById('login-username')
            : document.getElementById('reg-username');
        input?.focus();
    }, 100);
}

function cerrarModal() {
    document.getElementById('auth-modal')?.remove();
}

// Exponer globalmente
window.Auth = Auth;
window.abrirModalLogin = abrirModalLogin;
window.abrirModalRegister = abrirModalRegister;
window.cerrarModal = cerrarModal;