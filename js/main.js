// js/main.js

const siteContent = [
    // --- HERRAMIENTAS (TOOLS.HTML) ---
    { title: "Aircrack-ng - Auditoría WiFi", url: "tools.html#aircrack", category: "Herramienta", tag: "WiFi" },
    { title: "Airodump-ng - Captura de Paquetes", url: "tools.html#airodump", category: "Herramienta", tag: "WiFi" },
    { title: "Wifite - Automatización WiFi", url: "tools.html#wifite", category: "Herramienta", tag: "WiFi" },
    { title: "Reaver - Ataque WPS", url: "tools.html#reaver", category: "Herramienta", tag: "WiFi" },
    { title: "Wireshark - Análisis de Tráfico", url: "tools.html#wireshark", category: "Herramienta", tag: "Red" },
    { title: "Evil-WinRM - Shell Remota", url: "tools.html#evilwinrm", category: "Herramienta", tag: "Pentesting" },
    { title: "OSINT Tool - Recolección", url: "tools.html#osint", category: "Herramienta", tag: "OSINT" },
    { title: "Reaper - Framework", url: "tools.html#reaper", category: "Herramienta", tag: "OSINT" },
    { title: "WAN - Análisis de Red", url: "tools.html#wan", category: "Herramienta", tag: "Red" },

    // --- TUTORIALES (TUTORIALS.HTML) ---
    { title: "Introducción a Kali Linux", url: "tutorials.html", category: "Tutorial", tag: "Esencial" },
    { title: "Primeros comandos en Linux", url: "tutorials.html#comandos", category: "Tutorial", tag: "Básico" },
    { title: "Nmap - Escaneo de Redes", url: "tutorials.html", category: "Tutorial", tag: "Red" },
    { title: "Metasploit - Explotación", url: "tutorials.html", category: "Tutorial", tag: "Pentesting" },
    { title: "SQLmap - Inyección SQL", url: "tutorials.html", category: "Tutorial", tag: "Web" },
    { title: "Sherlock - Buscar Usuarios", url: "tutorials.html", category: "Tutorial", tag: "OSINT" },
    { title: "Handshake - Captura WPA", url: "tutorials.html", category: "Tutorial", tag: "WiFi" },

    // --- SHOP (SHOP.HTML) ---
    { title: "Script Automatizado Nmap + Nikto", url: "shop.html", category: "Script", tag: "Ventas" },
    { title: "Wordlist Personalizada España", url: "shop.html", category: "Recurso", tag: "Top" },
    { title: "Script de Reconocimiento OSINT", url: "shop.html", category: "Script", tag: "Nuevo" },

    // --- CLASES (CLASSES.HTML) ---
    { title: "Curso Gratuito: Introducción a Kali", url: "classes.html", category: "Clase", tag: "Gratis" },
    { title: "Plan Pro - Pentesting Avanzado", url: "classes.html", category: "Clase", tag: "Recomendado" },
    { title: "Plan Elite - Mentoría 1 a 1", url: "classes.html", category: "Clase", tag: "Premium" },

    // --- AYUDA (HELP.HTML) ---
    { title: "¿Cómo instalar Kali Linux?", url: "help.html", category: "Ayuda", tag: "" },
    { title: "Solución de errores comunes", url: "help.html", category: "Ayuda", tag: "" }
];

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            resultsContainer.innerHTML = '';

            if (query.length < 2) {
                resultsContainer.style.display = 'none';
                return;
            }

            const filtered = siteContent.filter(item => 
                item.title.toLowerCase().includes(query) || 
                item.category.toLowerCase().includes(query) ||
                item.tag.toLowerCase().includes(query)
            );

            if (filtered.length > 0) {
                resultsContainer.style.display = 'block';
                filtered.forEach(item => {
                    const div = document.createElement('div');
                    div.innerHTML = `
                        <div>
                            <strong style="color: #fff;">${item.title}</strong>
                            <span style="font-size: 0.8em; color: #666; margin-left: 8px;">${item.category}</span>
                        </div>
                        ${item.tag ? `<span style="font-size: 0.7rem; background: #333; padding: 2px 8px; border-radius: 4px; color: #fff;">${item.tag}</span>` : ''}
                    `;
                    div.onclick = () => {
                        window.location.href = item.url;
                    };
                    resultsContainer.appendChild(div);
                });
            } else {
                resultsContainer.style.display = 'none';
            }
        });

        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
                resultsContainer.style.display = 'none';
            }
        });
    }
});