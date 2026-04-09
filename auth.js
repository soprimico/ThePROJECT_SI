// auth.js
const USERS_KEY = 'soprimico_users';
const SESSION_KEY = 'soprimico_session';

// Inicializar usuarios si no existen
if (!localStorage.getItem(USERS_KEY)) {
    const defaultUsers = [
        { email: 'admin@example.com', password: '123456' }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
}

// Registrar nuevo usuario
function register(email, password) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    const userExists = users.some(u => u.email === email);
    
    if (userExists) {
        return { success: false, message: 'El email ya está registrado' };
    }
    
    if (password.length < 4) {
        return { success: false, message: 'La contraseña debe tener al menos 4 caracteres' };
    }
    
    users.push({ email, password });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return { success: true, message: 'Registro exitoso. Ahora inicia sesión.' };
}

// Iniciar sesión
function login(email, password) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem(SESSION_KEY, JSON.stringify({ email, timestamp: Date.now() }));
        return { success: true, message: 'Login exitoso' };
    } else {
        return { success: false, message: 'Email o contraseña incorrectos' };
    }
}

// Verificar si hay sesión activa
function isAuthenticated() {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) return false;
    
    const sessionData = JSON.parse(session);
    // Sesión expira después de 24 horas
    const HOURS_24 = 24 * 60 * 60 * 1000;
    if (Date.now() - sessionData.timestamp > HOURS_24) {
        localStorage.removeItem(SESSION_KEY);
        return false;
    }
    return true;
}

// Obtener usuario actual
function getCurrentUser() {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) return null;
    return JSON.parse(session).email;
}

// Cerrar sesión
function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'login.html';
}

// Proteger página (redirige a login si no está autenticado)
// IMPORTANTE: Solo proteger páginas que NO son login.html
function protectPage() {
    // No proteger login.html para evitar bucle
    if (window.location.pathname.includes('login.html')) {
        return;
    }
    
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    }
}

// Redirigir a home si ya está logueado y está en login.html
function redirectIfLoggedIn() {
    if (window.location.pathname.includes('login.html') && isAuthenticated()) {
        window.location.href = 'index.html';
    }
}

// Añade estas funciones a tu auth.js existente

// Cambiar contraseña
function changePassword(email, oldPassword, newPassword) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    const userIndex = users.findIndex(u => u.email === email && u.password === oldPassword);
    
    if (userIndex === -1) {
        return { success: false, message: 'Contraseña actual incorrecta' };
    }
    
    if (newPassword.length < 4) {
        return { success: false, message: 'La nueva contraseña debe tener al menos 4 caracteres' };
    }
    
    users[userIndex].password = newPassword;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return { success: true, message: 'Contraseña actualizada correctamente' };
}

// Eliminar cuenta
function deleteAccount(email, password) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    const userIndex = users.findIndex(u => u.email === email && u.password === password);
    
    if (userIndex === -1) {
        return { success: false, message: 'Credenciales incorrectas' };
    }
    
    users.splice(userIndex, 1);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.removeItem(SESSION_KEY);
    return { success: true, message: 'Cuenta eliminada correctamente' };
}