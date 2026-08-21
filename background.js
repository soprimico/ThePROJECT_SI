// background.js - Sistema de fondo personalizado global

const API_URL = 'https://registration-remind-actor-linda.trycloudflare.com/api/';

let fondoConfig = null;
let bgInterval = null;

// ============================================
// CARGAR CONFIGURACIÓN DEL FONDO
// ============================================
async function loadBackgroundSettings() {
    try {
        // Obtener usuario actual
        const userData = localStorage.getItem('user');
        if (!userData) {
            console.log('No hay usuario logueado, usando fondo por defecto');
            return;
        }
        
        const user = JSON.parse(userData);
        const userId = user.id;
        
        // Obtener configuración del servidor
        const response = await fetch(`${API_URL}/get_settings.php?user_id=${userId}`);
        const data = await response.json();
        
        if (data.success && data.data) {
            fondoConfig = data.data;
            console.log('Configuración de fondo cargada:', fondoConfig);
            applyBackground();
        } else {
            console.log('No hay configuración guardada, usando fondo por defecto');
            resetToDefaultBackground();
        }
    } catch (error) {
        console.error('Error cargando configuración de fondo:', error);
        resetToDefaultBackground();
    }
}

// ============================================
// APLICAR FONDO
// ============================================
function applyBackground() {
    if (!fondoConfig || fondoConfig.fondo_tipo === 'default' || !fondoConfig.fondo_url) {
        resetToDefaultBackground();
        return;
    }

    const body = document.body;
    const tipo = fondoConfig.fondo_tipo;
    const url = fondoConfig.fondo_url;

    // Eliminar cualquier fondo anterior (incluyendo videos)
    const oldVideo = document.getElementById('bgVideoContainer');
    if (oldVideo) oldVideo.remove();
    
    // Resetear estilos del body
    body.style.backgroundImage = '';
    body.style.backgroundSize = '';
    body.style.backgroundPosition = '';
    body.style.backgroundRepeat = '';
    body.style.backgroundAttachment = '';
    body.style.background = '';

    if (tipo === 'video') {
        // Crear contenedor de video
        const videoContainer = document.createElement('div');
        videoContainer.id = 'bgVideoContainer';
        videoContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            overflow: hidden;
            pointer-events: none;
        `;
        
        const video = document.createElement('video');
        video.src = url;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: cover;
        `;
        
        // Manejar errores de carga de video
        video.onerror = function() {
            console.error('Error cargando video de fondo:', url);
            resetToDefaultBackground();
        };
        
        videoContainer.appendChild(video);
        document.body.prepend(videoContainer);
        
        // Intentar reproducir el video
        video.play().catch(e => console.log('Error reproduciendo video:', e));
        
    } else if (tipo === 'imagen') {
        // Imagen de fondo
        body.style.backgroundImage = `url(${url})`;
        body.style.backgroundSize = 'cover';
        body.style.backgroundPosition = 'center';
        body.style.backgroundRepeat = 'no-repeat';
        body.style.backgroundAttachment = 'fixed';
        
        // Probar si la imagen carga
        const img = new Image();
        img.onerror = function() {
            console.error('Error cargando imagen de fondo:', url);
            resetToDefaultBackground();
        };
        img.src = url;
    }
}

// ============================================
// RESTABLECER FONDO POR DEFECTO
// ============================================
function resetToDefaultBackground() {
    const body = document.body;
    
    // Eliminar video si existe
    const oldVideo = document.getElementById('bgVideoContainer');
    if (oldVideo) oldVideo.remove();
    
    // Resetear estilos
    body.style.backgroundImage = '';
    body.style.backgroundSize = '';
    body.style.backgroundPosition = '';
    body.style.backgroundRepeat = '';
    body.style.backgroundAttachment = '';
    body.style.background = '#0a0e17';
}

// ============================================
// INICIALIZAR
// ============================================
async function initBackground() {
    console.log('Inicializando sistema de fondo...');
    await loadBackgroundSettings();
    
    // Escuchar cambios en localStorage (para cuando se actualice la configuración)
    window.addEventListener('storage', function(e) {
        if (e.key === 'backgroundUpdated') {
            console.log('Configuración de fondo actualizada, recargando...');
            loadBackgroundSettings();
        }
    });
}

// ============================================
// FUNCIÓN PARA ACTUALIZAR DESDE settings.html
// ============================================
function notifyBackgroundUpdated() {
    localStorage.setItem('backgroundUpdated', Date.now().toString());
    setTimeout(() => {
        localStorage.removeItem('backgroundUpdated');
    }, 100);
}

// Exportar para uso en otros archivos
window.notifyBackgroundUpdated = notifyBackgroundUpdated;
window.loadBackgroundSettings = loadBackgroundSettings;
window.applyBackground = applyBackground;
window.resetToDefaultBackground = resetToDefaultBackground;

// Iniciar automáticamente
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackground);
} else {
    initBackground();
}