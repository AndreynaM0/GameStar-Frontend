document.addEventListener('DOMContentLoaded', async () => {
    
    const urlParams = new URLSearchParams(window.location.search);
    const jogoId = urlParams.get('id');

    if (!jogoId) {
        alert("ID do jogo não encontrado na URL!");
        window.location.href = "inicio.html";
        return;
    }

    let usuario;
    try {
        usuario = await window.api.getUsuarioLogado();
        document.querySelectorAll('.nome').forEach(el => el.textContent = usuario.nome);
    } catch (error) {
        alert("Você precisa estar logado!");
        window.location.href = "index.html";
        return;
    }

    document.querySelectorAll('.nome, strong').forEach(el => {
        if (el) el.textContent = usuario.nome || "Usuário";
    });

    const btnAvaliar = document.getElementById('btnAvaliar');
    if (btnAvaliar) {
        btnAvaliar.addEventListener('click', () => {
            window.location.href = `avaliar.html?id=${jogoId}`;
        });
    }

    const btnFavoritar = document.getElementById('btnFavoritar');
    if (btnFavoritar) {
        btnFavoritar.addEventListener('click', async () => {
            try {
                const resultado = await window.api.favoritar(parseInt(jogoId));
                if (resultado.ok) {
                    alert("Jogo adicionado aos favoritos com sucesso!");
                    btnFavoritar.textContent = "Favoritado ✓";
                    btnFavoritar.style.backgroundColor = "#28a745";
                    btnFavoritar.style.pointerEvents = "none";
                } else {
                    alert(resultado.data?.detail || "Este jogo já está nos favoritos");
                }
            } catch (error) {
                alert("Erro ao adicionar aos favoritos");
            }
        });
    }

    const btnExcluir = document.getElementById('btnExcluirJogo');
    if (btnExcluir) {
        if (usuario.admin) {
            btnExcluir.style.display = "inline-block";
            btnExcluir.addEventListener('click', async () => {
                const confirmar = confirm("Tem certeza que deseja excluir este jogo? Esta ação não pode ser desfeita.");
                if (!confirmar) return;

                try {
                    const resultado = await window.api.deletarJogo(jogoId);
                    if (resultado.ok) {
                        alert("Jogo excluído com sucesso!");
                        window.location.href = "inicio.html";
                    } else {
                        alert(resultado.data?.detail || "Erro ao excluir o jogo.");
                    }
                } catch (error) {
                    alert("Erro ao conectar com o servidor.");
                    console.error("Erro ao excluir jogo:", error);
                }
            });
        } else {
            btnExcluir.style.display = "none";
        }
    }

    try {
        const jogos = await window.api.listarJogos();
        const jogo = jogos.find(j => j.id == jogoId);
        if (jogo) popularDetalhesJogo(jogo);

        const reviews = await window.api.listarReviews();
        const reviewsDoJogo = reviews.filter(r => r.jogo_id == jogoId);
        popularReviews(reviewsDoJogo, usuario);

    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
});

function popularDetalhesJogo(jogo) {
    document.querySelector('h1').textContent = jogo.titulo;

    const capa = document.querySelector('.capaDojogo');
    if (capa) capa.src = jogo.url_jogo || '/images/default.jpg';

    const descricaoEl = document.querySelector('.sobre_Jogo p');
    if (descricaoEl) descricaoEl.textContent = jogo.descricao;

    const notaGeral = document.querySelector('.notaGeral span');
    if (notaGeral) notaGeral.textContent = jogo.nota_media ? jogo.nota_media.toFixed(1) : "0.0";
}

function popularReviews(reviews, usuarioLogado) {
    const container = document.getElementById('reviews-container');
    if (!container) return;

    container.innerHTML = "";

    if (reviews.length === 0) {
        container.innerHTML = `<p style="color:#bbb; padding:20px 0;">Nenhuma avaliação ainda. Seja o primeiro!</p>`;
        return;
    }

    reviews.forEach(review => {
        const isMeuReview = review.usuario_id === usuarioLogado.id;
        const nomeUsuario = isMeuReview ? "Você" : `Usuário ${review.usuario_id}`;

        const div = document.createElement('div');
        div.className = "avaliacao";
        div.innerHTML = `
            <div class="avaliacao_usuarios">
                <div class="avatar"><img src="/images/user.png" class="avatar"></div>
                <div>
                    <h3>${nomeUsuario}</h3>
                    <p class="review-date">Finalizado em ${new Date(review.data_finalizacao).toLocaleDateString('pt-BR')}</p>
                    <p>${review.descricao || "Sem comentário"}</p>
                </div>
            </div>
            <div class="nota_Avaliacao">
                <span>Nota</span>
                <strong>${review.nota}</strong>
            </div>
        `;
        container.appendChild(div);
    });
}