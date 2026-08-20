console.log('auth.js loaded correctly');

// ============================================
// CONFIGURATION - YOUR LOCAL API
// ============================================
const API_URL = 'https://registration-remind-actor-linda.trycloudflare.com/api/';

// ============================================
// USER STATE
// ============================================
let currentUser = null;
let currentUserRol = null;

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

// Register user
async function registerUser(nombre, email, password) {
    console.log('registerUser called:', { nombre, email });
    try {
        const response = await fetch(`${API_URL}/register.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, contraseña: password })
        });
        const data = await response.json();
        console.log('Register response:', data);
        if (data.success) {
            return { success: true, message: data.message };
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        console.error('Register error:', error);
        return { success: false, error: error.message };
    }
}

// Login user
async function loginUser(email, password) {
    console.log('loginUser called:', { email });
    try {
        const response = await fetch(`${API_URL}/login.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, contraseña: password })
        });
        const data = await response.json();
        console.log('Login response:', data);
        if (data.success) {
            currentUser = data.user;
            localStorage.setItem('user', JSON.stringify(currentUser));
            await loadUserRole(currentUser.id);
            return { success: true, user: currentUser };
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
    }
}

// Logout user
function logoutUser() {
    console.log('logoutUser called');
    localStorage.removeItem('user');
    currentUser = null;
    currentUserRol = null;
    window.location.href = 'index.html';
}

// Get current user
function getCurrentUser() {
    if (currentUser) {
        console.log('User from memory:', currentUser);
        return currentUser;
    }
    const saved = localStorage.getItem('user');
    if (saved) {
        try {
            currentUser = JSON.parse(saved);
            console.log('User from localStorage:', currentUser);
            return currentUser;
        } catch (e) {
            console.error('Error parsing user:', e);
            return null;
        }
    }
    console.log('No user logged in');
    return null;
}

// ============================================
// ROLE SYSTEM
// ============================================

async function loadUserRole(userId) {
    try {
        const response = await fetch(`${API_URL}/get_user_roles.php?user_id=${userId}`);
        const data = await response.json();
        if (data.success) {
            const equipped = data.data.find(r => r.equipado === 1);
            currentUserRol = equipped || null;
            console.log('User role loaded:', currentUserRol);
        }
    } catch (error) {
        console.error('Error loading role:', error);
        currentUserRol = null;
    }
}

function getUserRole() {
    return currentUserRol;
}

// ============================================
// COIN SYSTEM
// ============================================

async function getCoins(userId) {
    try {
        const response = await fetch(`${API_URL}/get_coins.php?id=${userId}`);
        const data = await response.json();
        if (data.success) {
            return data.monedas;
        } else {
            console.error('Error getting coins:', data.error);
            return 0;
        }
    } catch (error) {
        console.error('Connection error:', error);
        return 0;
    }
}

async function addCoins(userId, cantidad) {
    try {
        const response = await fetch(`${API_URL}/update_coins.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                user_id: userId, 
                cantidad: cantidad,
                accion: 'sumar'
            })
        });
        const data = await response.json();
        if (data.success) {
            const user = getCurrentUser();
            if (user) {
                user.monedas = data.monedas;
                localStorage.setItem('user', JSON.stringify(user));
            }
            return { success: true, monedas: data.monedas };
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function subtractCoins(userId, cantidad) {
    try {
        const response = await fetch(`${API_URL}/update_coins.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                user_id: userId, 
                cantidad: cantidad,
                accion: 'restar'
            })
        });
        const data = await response.json();
        if (data.success) {
            const user = getCurrentUser();
            if (user) {
                user.monedas = data.monedas;
                localStorage.setItem('user', JSON.stringify(user));
            }
            return { success: true, monedas: data.monedas };
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============================================
// GENERATE MENU
// ============================================
function generarMenu() {
    console.log('generarMenu executed');
    const menu = document.getElementById('menu');
    
    if (!menu) {
        console.error('Menu element not found in DOM');
        return;
    }
    
    menu.style.display = 'flex';
    menu.style.gap = '10px';
    menu.style.alignItems = 'center';
    
    console.log('Menu element found');
    const user = getCurrentUser();
    console.log('User status:', user ? 'Logged in' : 'Not logged in');

    if (user) {
        const role = getUserRole();
        const roleColor = role ? role.color : '#00ff88';
        const roleDisplay = role ? `<span style="color:${role.color};font-size:0.65rem;margin-left:4px;font-weight:normal;">${role.nombre}</span>` : '';

        console.log('Generating menu for logged in user');
        menu.innerHTML = `
            <button onclick="location.href='index.html'">Home</button>
            <button onclick="location.href='shop.html'">Shop</button>
            <button onclick="location.href='inventory.html'">Inventory</button>
            <button onclick="location.href='roles.html'">Roles</button>
            <button onclick="location.href='friends.html'">Friends</button>
            <button onclick="location.href='chat.html'">Chat</button>
            <button onclick="location.href='help.html'">Help</button>

            <div style="display:inline-block;position:relative;">
                <button id="menuBtn" style="background:transparent;color:${roleColor};border:1px solid ${roleColor};padding:5px 15px;border-radius:5px;cursor:pointer;font-weight:bold;display:flex;align-items:center;gap:5px;">
                    ${user.nombre} ${roleDisplay}
                </button>

                <div id="dropdownMenu"
                     style="
                        display:none;
                        position:absolute;
                        right:0;
                        top:40px;
                        background:#0a0e17;
                        border:1px solid ${roleColor};
                        border-radius:8px;
                        color:white;
                        padding:15px;
                        z-index:9999;
                        min-width:220px;
                        box-shadow:0 10px 30px rgba(0,0,0,0.8);
                     ">
                    <div style="border-bottom:1px solid #1a1a2e;padding-bottom:10px;margin-bottom:10px;">
                        <p style="color:${roleColor};font-weight:bold;margin:0;font-size:16px;">${user.nombre}</p>
                        ${role ? `<p style="color:${role.color};font-size:0.8rem;margin:2px 0 0 0;">${role.nombre}</p>` : ''}
                        <p style="color:#7a8aa3;font-size:12px;margin:5px 0 0 0;">${user.email}</p>
                    </div>
                    
                    <div style="margin-bottom:10px;">
                        <p style="color:#7a8aa3;font-size:12px;margin:2px 0;">ID: <span style="color:#00ff88;">#${user.id}</span></p>
                        <p style="color:#7a8aa3;font-size:12px;margin:2px 0;">Coins: <span style="color:#00ff88;" id="coinsDropdown">0</span></p>
                        <p style="color:#7a8aa3;font-size:12px;margin:2px 0;">Level: <span style="color:#00ff88;">${user.nivel || 1}</span></p>
                        <p style="color:#7a8aa3;font-size:12px;margin:2px 0;">Register date: <span style="color:#00ff88;">${user.fecha_registro ? new Date(user.fecha_registro).toLocaleDateString('es-ES') : 'Not available'}</span></p>
                    </div>

                    <button
                        style="display:block;width:100%;background:${roleColor};color:#000;border:none;padding:10px;border-radius:5px;cursor:pointer;font-weight:bold;margin-bottom:8px;"
                        onclick="location.href='profile.html'">
                        View Profile
                    </button>

                    <button
                        id="logoutBtn"
                        style="display:block;width:100%;background:#ff4444;color:#fff;border:none;padding:10px;border-radius:5px;cursor:pointer;font-weight:bold;">
                        Logout
                    </button>
                </div>
            </div>
        `;
        console.log('User menu generated');

        getCoins(user.id).then(coins => {
            const coinsEl = document.getElementById('coinsDropdown');
            if (coinsEl) coinsEl.textContent = coins;
        });

        const menuBtn = document.getElementById('menuBtn');
        const dropdownMenu = document.getElementById('dropdownMenu');
        const logoutBtn = document.getElementById('logoutBtn');

        if (menuBtn && dropdownMenu) {
            menuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = dropdownMenu.style.display === 'block';
                dropdownMenu.style.display = isOpen ? 'none' : 'block';
                
                const header = document.querySelector('.headerhere');
                if (header) {
                    header.style.marginBottom = isOpen ? '0' : '220px';
                }
            });

            document.addEventListener('click', () => {
                dropdownMenu.style.display = 'none';
                const header = document.querySelector('.headerhere');
                if (header) {
                    header.style.marginBottom = '40px';
                }
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', logoutUser);
            console.log('Logout event assigned');
        }

    } else {
        console.log('Generating menu for not logged in user');
        menu.innerHTML = `
            <button onclick="location.href='index.html'">Home</button>
            <button onclick="location.href='shop.html'">Shop</button>
            <button onclick="location.href='help.html'">Help</button>
            <button onclick="location.href='login.html'">Login</button>
        `;
        console.log('Guest menu generated');
    }
}

// ============================================
// PROTECT PAGES
// ============================================
function protegerPagina() {
    const user = getCurrentUser();
    if (!user) {
        console.log('User not authenticated, redirecting to login');
        window.location.href = 'login.html';
    }
    return user;
}

// ============================================
// INITIALIZE
// ============================================
async function init() {
    console.log('Initializing auth.js');
    const user = getCurrentUser();
    if (user) {
        await loadUserRole(user.id);
    }
    generarMenu();
}

window.logoutUser = logoutUser;
window.getCurrentUser = getCurrentUser;
window.getUserRole = getUserRole;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

export { 
    registerUser, 
    loginUser, 
    logoutUser, 
    getCurrentUser, 
    getUserRole,
    loadUserRole,
    generarMenu, 
    protegerPagina,
    getCoins,
    addCoins,
    subtractCoins
};