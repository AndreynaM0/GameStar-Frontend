// scripts/inicio.js
document.addEventListener('DOMContentLoaded', async () => {

    let usuario;
    try {
        usuario = await window.api.getUsuarioLogado();
        
        document.querySelectorAll('.nome, strong').forEach(el => {
            if (el) el.textContent = usuario.nome || "Usuário";
        });

    } catch (error) {
        console.error("Usuário não logado");
        window.location.href = "index.html";
        return;
    }

    try {
        const [jogos, reviews] = await Promise.all([
            window.api.listarJogos(),
            window.api.listarReviews()
        ]);

        const minhasReviews = reviews
            .filter(r => r.usuario_id === usuario.id)
            .sort((a, b) => new Date(b.data_finalizacao) - new Date(a.data_finalizacao));

        popularJogosPopulares(jogos);

        popularUltimasAvaliacoes(minhasReviews, jogos);

    } catch (error) {
        console.error("Erro ao carregar dados da página inicial:", error);
    }
});

function popularJogosPopulares(jogos) {
    const container = document.querySelector('.listaJogos');
    if (!container) return;

    container.innerHTML = "";

    jogos.slice(0, 6).forEach(jogo => {
        const card = document.createElement('div');
        card.className = "cardJogo";
        card.innerHTML = `
            <a href="jogo.html?id=${jogo.id}">
                <img src="${jogo.url_jogo || '/images/default.jpg'}" alt="${jogo.titulo}">
            </a>
        `;
        container.appendChild(card);
    });
}

function popularUltimasAvaliacoes(reviews, todosJogos) {
    const container = document.querySelectorAll('.listaJogos')[1]; 
    if (!container) {
        console.warn("Container de últimas avaliações não encontrado");
        return;
    }

    container.innerHTML = "";

    if (reviews.length === 0) {
        container.innerHTML = `
            <p style="grid-column: 1/-1; text-align:center; color:#bbb; padding: 20px;">
                Você ainda não avaliou nenhum jogo.
            </p>`;
        return;
    }

    reviews.slice(0, 6).forEach(review => {
        const jogo = todosJogos.find(j => j.id == review.jogo_id);

        const card = document.createElement('div');
        card.className = "cardJogo";
        card.innerHTML = `
            <a href="jogo.html?id=${review.jogo_id}">
                <img src="${jogo ? jogo.url_jogo : '/images/default.jpg'}" 
                alt="${jogo ? jogo.titulo : 'Jogo'}">
            </a>
        `;
        container.appendChild(card);
    });
}

