document.addEventListener('DOMContentLoaded', async () => {
    try {
        const usuario = await window.api.getUsuarioLogado();

        document.querySelectorAll('.nome').forEach(el => {
            el.textContent = usuario.nome;
        });

        document.querySelector('.list-title').textContent =
            `Favoritos de ${usuario.nome}`;

        const favoritos = await window.api.listarFavoritos();

        popularFavoritos(favoritos);

    } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
        alert("Você precisa estar logado!");
        window.location.href = "index.html";
    }
});

function popularFavoritos(favoritos) {
    const container = document.querySelector('.games-grid');

    if (!container) return;

    container.innerHTML = "";

    if (!favoritos.length) {
        container.innerHTML = `
            <p style="grid-column: 1/-1; text-align:center; color:#bbb;">
                Nenhum favorito ainda.
            </p>
        `;
        return;
    }

    favoritos.forEach(jogo => {
        const card = document.createElement('div');
        card.className = "game-card";

        card.innerHTML = `
            <a href="jogo.html?id=${jogo.id}">
                <img src="${jogo.url_jogo}" alt="${jogo.titulo}">
            </a>
        `;

        container.appendChild(card);
    });
}
