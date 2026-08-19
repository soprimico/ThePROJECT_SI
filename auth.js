console.log('🚀 auth.js cargado correctamente');

// ============================================
// CONFIGURACIÓN - TU API LOCAL
// ============================================
const API_URL = 'https://registration-remind-actor-linda.trycloudflare.com/api/';

// ============================================
// ESTADO DEL USUARIO
// ============================================
let currentUser = null;

// ============================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================

// Registrar usuario
async function registerUser(nombre, email, password) {
    console.log('📝 registerUser llamado:', { nombre, email });
    try {
        const response = await fetch(`${API_URL}/register.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, contraseña: password })
        });
        const data = await response.json();
        console.log('📦 Respuesta register:', data);
        if (data.success) {
            return { success: true, message: data.message };
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        console.error('❌ Error register:', error);
        return { success: false, error: error.message };
    }
}

// Iniciar sesión
async function loginUser(email, password) {
    console.log('🔐 loginUser llamado:', { email });
    try {
        const response = await fetch(`${API_URL}/login.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, contraseña: password })
        });
        const data = await response.json();
        console.log('📦 Respuesta login:', data);
        if (data.success) {
            currentUser = data.user;
            localStorage.setItem('user', JSON.stringify(currentUser));
            return { success: true, user: currentUser };
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        console.error('❌ Error login:', error);
        return { success: false, error: error.message };
    }
}

// Cerrar sesión
function logoutUser() {
    console.log('🚪 logoutUser llamado');
    localStorage.removeItem('user');
    currentUser = null;
    window.location.href = 'index.html';
}

// Obtener usuario actual
function getCurrentUser() {
    if (currentUser) {
        console.log('👤 Usuario desde memoria:', currentUser);
        return currentUser;
    }
    const saved = localStorage.getItem('user');
    if (saved) {
        try {
            currentUser = JSON.parse(saved);
            console.log('👤 Usuario desde localStorage:', currentUser);
            return currentUser;
        } catch (e) {
            console.error('❌ Error parsing user:', e);
            return null;
        }
    }
    console.log('👤 No hay usuario logueado');
    return null;
}

// ============================================
// SISTEMA DE MONEDAS
// ============================================

// Obtener monedas del usuario
async function getCoins(userId) {
    try {
        const response = await fetch(`${API_URL}/get_coins.php?id=${userId}`);
        const data = await response.json();
        if (data.success) {
            return data.monedas;
        } else {
            console.error('Error al obtener monedas:', data.error);
            return 0;
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        return 0;
    }
}

// Sumar monedas
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

// Restar monedas
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
// GENERAR MENÚ
// ============================================
function generarMenu() {
    console.log('🎯 generarMenu ejecutado');
    const menu = document.getElementById('menu');
    
    if (!menu) {
        console.error('❌ No se encontró el elemento #menu en el DOM');
        return;
    }
    
    menu.style.display = 'flex';
    menu.style.gap = '10px';
    menu.style.alignItems = 'center';
    
    console.log('✅ Elemento #menu encontrado');
    const user = getCurrentUser();
    console.log('👤 Estado del usuario:', user ? 'Logueado' : 'No logueado');

    if (user) {
        console.log('📝 Generando menú para usuario logueado');
        menu.innerHTML = `
            <button onclick="location.href='index.html'">Home</button>
            <button onclick="location.href='shop.html'">Shop</button>
            <button onclick="location.href='help.html'">Help</button>

            <div style="display:inline-block;position:relative;">
                <button id="menuBtn" style="background:transparent;color:#00ff88;border:1px solid #00ff88;padding:5px 15px;border-radius:5px;cursor:pointer;font-weight:bold;">
                    ${user.nombre} ☰
                </button>

                <div id="dropdownMenu"
                     style="
                        display:none;
                        position:absolute;
                        right:0;
                        top:40px;
                        background:#0a0e17;
                        border:1px solid #00ff88;
                        border-radius:8px;
                        color:white;
                        padding:15px;
                        z-index:9999;
                        min-width:220px;
                        box-shadow:0 10px 30px rgba(0,0,0,0.8);
                     ">
                    <div style="border-bottom:1px solid #1a1a2e;padding-bottom:10px;margin-bottom:10px;">
                        <p style="color:#00ff88;font-weight:bold;margin:0;font-size:16px;">${user.nombre}</p>
                        <p style="color:#7a8aa3;font-size:12px;margin:5px 0 0 0;">${user.email}</p>
                    </div>
                    
                    <div style="margin-bottom:10px;">
                        <p style="color:#7a8aa3;font-size:12px;margin:2px 0;">ID: <span style="color:#00ff88;">#${user.id}</span></p>
                        <p style="color:#7a8aa3;font-size:12px;margin:2px 0;">Monedas: <span style="color:#00ff88;" id="coinsDropdown">0</span></p>
                        <p style="color:#7a8aa3;font-size:12px;margin:2px 0;">Fecha registro: <span style="color:#00ff88;">${user.fecha_registro ? new Date(user.fecha_registro).toLocaleDateString('es-ES') : 'No disponible'}</span></p>
                    </div>

                    <button
                        style="display:block;width:100%;background:#00ff88;color:#000;border:none;padding:10px;border-radius:5px;cursor:pointer;font-weight:bold;margin-bottom:8px;"
                        onclick="location.href='profile.html'">
                        Ver Perfil
                    </button>

                    <button
                        id="logoutBtn"
                        style="display:block;width:100%;background:#ff4444;color:#fff;border:none;padding:10px;border-radius:5px;cursor:pointer;font-weight:bold;">
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        `;
        console.log('✅ Menú de usuario generado');

        // Cargar monedas en el dropdown
        getCoins(user.id).then(coins => {
            const coinsEl = document.getElementById('coinsDropdown');
            if (coinsEl) coinsEl.textContent = coins;
        });

        // Eventos del menú hamburguesa
        const menuBtn = document.getElementById('menuBtn');
        const dropdownMenu = document.getElementById('dropdownMenu');
        const logoutBtn = document.getElementById('logoutBtn');

        if (menuBtn && dropdownMenu) {
            menuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = dropdownMenu.style.display === 'block';
                dropdownMenu.style.display = isOpen ? 'none' : 'block';
                
                // Ajustar margen inferior del header para que empuje el contenido
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
            console.log('✅ Evento logout asignado');
        }

    } else {
        console.log('📝 Generando menú para usuario NO logueado');
        menu.innerHTML = `
            <button onclick="location.href='index.html'">Home</button>
            <button onclick="location.href='shop.html'">Shop</button>
            <button onclick="location.href='help.html'">Help</button>
            <button onclick="location.href='login.html'">Login</button>
        `;
        console.log('✅ Menú de invitado generado');
    }
}
// ============================================
// PROTEGER PÁGINAS
// ============================================
function protegerPagina() {
    const user = getCurrentUser();
    if (!user) {
        console.log('🔒 Usuario no autenticado, redirigiendo a login');
        window.location.href = 'login.html';
    }
    return user;
}

// ============================================
// INICIALIZAR
// ============================================
function init() {
    console.log('🚀 Inicializando auth.js');
    generarMenu();
}

// Exponer funciones globalmente para usar en onclick
window.logoutUser = logoutUser;
window.getCurrentUser = getCurrentUser;

// Si el DOM ya está cargado, ejecutar ahora
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Exportar funciones para usar en otros archivos con import
export { 
    registerUser, 
    loginUser, 
    logoutUser, 
    getCurrentUser, 
    generarMenu, 
    protegerPagina,
    getCoins,
    addCoins,
    subtractCoins
};