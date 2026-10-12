// js/main.js
// Buscador conectado a la API de Soprimico
// API: https://api.soprimico.com

const API_URL = 'https://api.soprimico.com';

const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('search-results');

let searchTimeout = null;

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        
        if (searchTimeout) clearTimeout(searchTimeout);
        
        if (query.length < 2) {
            resultsContainer.style.display = 'none';
            resultsContainer.innerHTML = '';
            return;
        }
        
        resultsContainer.style.display = 'block';
        resultsContainer.innerHTML = '<div style="padding: 15px 25px; color: #888;">🔍 Buscando...</div>';
        
        searchTimeout = setTimeout(async () => {
            try {
                const response = await fetch(`${API_URL}/api/buscar?q=${encodeURIComponent(query)}`);
                
                if (!response.ok) throw new Error('Error en la búsqueda');
                
                const data = await response.json();
                mostrarResultados(data.resultados, query);
                
            } catch (err) {
                console.error('Error en la búsqueda:', err);
                resultsContainer.innerHTML = `
                    <div style="padding: 15px 25px; color: #ff4444;">
                        ❌ Error al buscar. Inténtalo de nuevo.
                    </div>
                `;
            }
        }, 300);
    });
    
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
            resultsContainer.style.display = 'none';
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            resultsContainer.style.display = 'none';
            searchInput.blur();
        }
    });
}

function mostrarResultados(resultados, query) {
    if (resultados.length === 0) {
        resultsContainer.innerHTML = `
            <div style="padding: 15px 25px; color: #888;">
                🔍 No hay resultados para "<strong>${query}</strong>"
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = '';
    
    resultados.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `
            <div>
                <strong style="color: #fff;">${item.titulo}</strong>
                <span style="font-size: 0.8em; color: #666; margin-left: 8px;">${item.categoria}</span>
            </div>
            <span style="font-size: 0.7rem; background: #333; padding: 2px 8px; border-radius: 4px; color: #fff;">
                ${item.tipo}
            </span>
        `;
        div.style.cursor = 'pointer';
        div.onclick = () => {
            window.location.href = item.url;
        };
        resultsContainer.appendChild(div);
    });
}
