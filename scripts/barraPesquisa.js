document.addEventListener('DOMContentLoaded', () => {
    
    const searchInput = document.querySelector('.pesquisa input');
    if (!searchInput) return;

    let timeout;
    let searchResultsContainer = null;

    function createResultsContainer() {
        if (searchResultsContainer) return;

        searchResultsContainer = document.createElement('div');
        searchResultsContainer.id = 'search-results';
        searchResultsContainer.style.position = 'absolute';
        searchResultsContainer.style.backgroundColor = '#222';
        searchResultsContainer.style.border = '1px solid #444';
        searchResultsContainer.style.borderRadius = '8px';
        searchResultsContainer.style.width = '100%';
        searchResultsContainer.style.maxHeight = '320px';
        searchResultsContainer.style.overflowY = 'auto';
        searchResultsContainer.style.zIndex = '1000';
        searchResultsContainer.style.display = 'none';
        searchResultsContainer.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';

        const pesquisaDiv = document.querySelector('.pesquisa');
        pesquisaDiv.style.position = 'relative';
        pesquisaDiv.appendChild(searchResultsContainer);
    }

    searchInput.addEventListener('input', async (e) => {
        const termo = e.target.value.trim();
        createResultsContainer();
        clearTimeout(timeout);

        timeout = setTimeout(async () => {
            if (termo.length < 2) {
                searchResultsContainer.style.display = 'none';
                return;
            }

            try {
                const jogos = await window.api.buscarJogo(termo);
                mostrarResultados(jogos, termo);
            } catch (error) {
                console.error("Erro na busca:", error);
            }
        }, 400);
    });

    searchInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const termo = searchInput.value.trim();
            if (termo.length < 2) return;

            try {
                const jogos = await window.api.buscarJogo(termo);
                
                if (jogos && jogos.length > 0) {
                    window.location.href = `jogo.html?id=${jogos[0].id}`;
                } else {
                    alert(`Nenhum jogo encontrado para "${termo}"`);
                }
            } catch (error) {
                alert("Erro ao buscar jogo");
            }
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.pesquisa') && searchResultsContainer) {
            searchResultsContainer.style.display = 'none';
        }
    });
});

function mostrarResultados(jogos, termo) {
    const container = document.getElementById('search-results');
    if (!container) return;

    container.innerHTML = "";

    if (!jogos || jogos.length === 0) {
        container.innerHTML = `<p style="padding:12px; color:#bbb;">Nenhum resultado para "${termo}"</p>`;
        container.style.display = 'block';
        return;
    }

    jogos.slice(0, 8).forEach(jogo => {
        const item = document.createElement('div');
        item.style.padding = '12px 15px';
        item.style.cursor = 'pointer';
        item.style.borderBottom = '1px solid #333';
        item.innerHTML = `
            <strong>${jogo.titulo}</strong><br>
            <small style="color:#aaa;">${jogo.descricao ? jogo.descricao.substring(0, 70) + '...' : ''}</small>
        `;

        item.addEventListener('click', () => {
            window.location.href = `jogo.html?id=${jogo.id}`;
        });

        item.addEventListener('mouseover', () => item.style.backgroundColor = '#333');
        item.addEventListener('mouseout', () => item.style.backgroundColor = '');

        container.appendChild(item);
    });

    container.style.display = 'block';
}