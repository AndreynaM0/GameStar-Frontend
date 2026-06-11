document.addEventListener('DOMContentLoaded', async () => {

    let usuario;
    try {
        usuario = await window.api.getUsuarioLogado();
        document.querySelectorAll('.nome').forEach(el => {
            if (el) el.textContent = usuario.nome;
        });
    } catch (error) {
        alert("Você precisa estar logado!");
        window.location.href = "index.html";
        return;
    }

    try {
        const [reviews, jogos, favoritos] = await Promise.all([
            window.api.listarReviews(),
            window.api.listarJogos(),
            window.api.listarFavoritos()
        ]);

        usuario = await window.api.getUsuarioLogado();

        document.querySelectorAll('.nome, strong').forEach(el => {
            if (el) el.textContent = usuario.nome || "Usuário";
        });

        const minhasReviews = reviews.filter(r => r.usuario_id === usuario.id);
        minhasReviews.sort((a, b) => new Date(b.data_finalizacao) - new Date(a.data_finalizacao));

        popularEstatisticas(minhasReviews);
        popularJogosRecentes(minhasReviews, jogos);
        popularAvaliacoesRecentes(minhasReviews, jogos);
        popularFavoritos(favoritos);

    } catch (error) {
        console.error("Erro ao carregar perfil:", error);
    }
});

function popularEstatisticas(reviews) {
    const total = document.querySelector('.stat-number');
    if (total) total.textContent = reviews.length;
}

function popularJogosRecentes(reviews, todosJogos) {
    const container = document.querySelector('.recent-grid');
    if (!container) return;

    container.innerHTML = "";

    if (reviews.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:#bbb;">Você ainda não avaliou nenhum jogo.</p>`;
        return;
    }

    reviews.slice(0, 6).forEach(review => {
        const jogo = todosJogos.find(j => j.id == review.jogo_id);

        const card = document.createElement('div');
        card.className = "game-card-small";
        card.innerHTML = `
            <a href="jogo.html?id=${review.jogo_id}">
                <img src="${jogo ? jogo.url_jogo : '/images/default.jpg'}" alt="${jogo ? jogo.titulo : ''}">
            </a>
            <div class="game-info-mini">
                <span>${new Date(review.data_finalizacao).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}</span>
                <span class="rating-red">${(review.nota).toFixed(1)}/5.0</span>
            </div>
        `;
        container.appendChild(card);
    });
}

function popularAvaliacoesRecentes(reviews, todosJogos) {
    const container = document.querySelector('.content-section:last-child');
    if (!container) return;

    container.querySelectorAll('.review-item').forEach(item => item.remove());

    if (reviews.length === 0) return;

    reviews.slice(0, 2).forEach(review => {
        const jogo = todosJogos.find(j => j.id == review.jogo_id);
        const status = review.dropado ? "Abandonado" : review.finalizado ? "Finalizado" : "Jogado";

        const div = document.createElement('div');
        div.className = "review-item";
        div.innerHTML = `
            <a href="jogo.html?id=${review.jogo_id}">
                <img class="review-poster"
                src="${jogo ? jogo.url_jogo : '/images/default.jpg'}"
                alt="${jogo ? jogo.titulo : 'Jogo'}">
            </a>
            <div class="review-details">
                <h4>${jogo ? jogo.titulo : `Jogo ${review.jogo_id}`}</h4>
                <div class="review-meta">
                    <span class="rating-red">${(review.nota).toFixed(1)}/5.0</span>
                    • ${status} em ${new Date(review.data_finalizacao).toLocaleDateString('pt-BR')}
                </div>
                <div class="review-text">${review.descricao || "Sem comentário"}</div>
            </div>
        `;
        container.appendChild(div);
    });
}

const btnLogout = document.getElementById("btnLogout");
if (btnLogout) {
    btnLogout.addEventListener("click", () => {
        localStorage.removeItem("access_token");
        window.location.href = "../index.html";
    });
}

function popularFavoritos(favoritos) {
    const container = document.querySelector('.favorites-grid');
    if (!container) return;

    container.innerHTML = "";

    if (!favoritos.length) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:#bbb;">Nenhum favorito ainda.</p>`;
        return;
    }

    favoritos.slice(0, 3).forEach(jogo => {
        const card = document.createElement('div');
        card.className = "game-card-large";
        card.innerHTML = `
            <a href="jogo.html?id=${jogo.id}">
                <img src="${jogo.url_jogo}" alt="${jogo.titulo}">
            </a>
        `;
        container.appendChild(card);
    });
}