document.addEventListener('DOMContentLoaded', async () => {

    let usuario;

    try {
        usuario = await window.api.getUsuarioLogado();

        document.querySelectorAll('.nome').forEach(el => {
            if (el) el.textContent = usuario.nome;
        });

        const titulo = document.querySelector('.reviews-section h2');
        if (titulo) {
            titulo.textContent = `Últimas Avaliações de ${usuario.nome}`;
        }

    } catch (error) {
        alert("Você precisa estar logado!");
        window.location.href = "index.html";
        return;
    }

    try {
        const [reviews, jogos] = await Promise.all([
            window.api.listarReviews(),
            window.api.listarJogos()
        ]);

        const minhasReviews = reviews
            .filter(r => r.usuario_id === usuario.id)
            .sort((a, b) => new Date(b.data_finalizacao) - new Date(a.data_finalizacao));

        console.log(`${minhasReviews.length} avaliações encontradas`);
        popularAvaliacoes(minhasReviews, jogos);

    } catch (error) {
        console.error("Erro ao carregar avaliações:", error);
        alert("Erro ao carregar suas avaliações");
    }
});

function popularAvaliacoes(reviews, todosJogos) {
    const container = document.querySelector('.reviews-section');
    if (!container) {
        console.error("Container .reviews-section não encontrado!");
        return;
    }

    container.querySelectorAll('.review-card').forEach(card => card.remove());

    if (reviews.length === 0) {
        const empty = document.createElement('p');
        empty.style.color = "#bbb";
        empty.style.padding = "30px";
        empty.textContent = "Você ainda não fez nenhuma avaliação.";
        container.appendChild(empty);
        return;
    }

    reviews.forEach(review => {
        const jogo = todosJogos.find(j => j.id == review.jogo_id);
        const status = review.dropado ? "Abandonado" : review.finalizado ? "Finalizado" : "Jogado";

        const card = document.createElement('div');
        card.className = "review-card";
        card.innerHTML = `
            <div>
                <a href="jogo.html?id=${review.jogo_id}">
                    <img src="${jogo ? jogo.url_jogo : '/images/default.jpg'}"
                    alt="${jogo ? jogo.titulo : ''}"
                    class="game-cover">
                </a>
            </div>
            <div class="review-content">
                <h3>${jogo ? jogo.titulo : `Jogo ${review.jogo_id}`}</h3>
                <p class="meta-info">
                    <span class="rating">${(review.nota).toFixed(1)}/5.0</span>
                    • ${status} em ${new Date(review.data_finalizacao).toLocaleDateString('pt-BR')}
                </p>
                <p class="comment">${review.descricao || "Sem comentário"}</p>
            </div>
        `;
        container.appendChild(card);
    });
}