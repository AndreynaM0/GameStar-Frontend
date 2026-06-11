document.addEventListener('DOMContentLoaded', async () => {

    const urlParams = new URLSearchParams(window.location.search);
    const jogoId = urlParams.get('id');
    

    if (!jogoId) {
        alert("ID do jogo não encontrado!");
        window.location.href = "inicio.html";
        return;
    }

    let usuario;
    try {
        usuario = await window.api.getUsuarioLogado();
        document.querySelectorAll('.nome').forEach(el => {
            if (el) el.textContent = usuario.nome;
        });
    } catch (error) {
        alert("Você precisa estar logado para avaliar!");
        window.location.href = "index.html";
        return;
    }

    let jogoAtual;
    try {
        const jogos = await window.api.listarJogos();
        jogoAtual = jogos.find(j => j.id == jogoId);

        if (jogoAtual) {
            popularInfoJogo(jogoAtual);
        } else {
            console.warn("Jogo não encontrado na lista");
        }
    } catch (error) {
        console.error("Erro ao carregar jogo:", error);
    }

    const form = document.querySelector('form') || document.getElementById('cadastroJogo');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nota = parseFloat(document.getElementById('nota')?.value);
            const dataFinalizacao = document.getElementById('dataFinalizacao')?.value;
            const statusSelect = document.getElementById('statusJogo')?.value;
            const descricao = document.getElementById('campoDeTexto')?.value.trim() || "";

            if (!nota || !dataFinalizacao) {
                alert("Nota e Data de Finalização são obrigatórias!");
                return;
            }

            if (nota < 0 || nota > 5) {
                alert("A nota deve estar entre 0 e 5");
                return;
            }

            const review = {
                usuario_id: usuario.id,
                jogo_id: parseInt(jogoId),
                nota: nota,
                data_finalizacao: dataFinalizacao,
                descricao: descricao,
                finalizado: statusSelect === "Finalizado",
                dropado: statusSelect === "Abandonado"
            };

            try {
                const resultado = await window.api.criarReview(review);

                if (resultado.ok) {
                    alert("Avaliação salva com sucesso!");
                    window.location.href = `jogo.html?id=${jogoId}`;
                } else {
                    alert(resultado.data.detail || "Erro ao salvar avaliação");
                }
            } catch (error) {
                console.error(error);
                alert("Erro ao salvar avaliação");
            }
        });
    }
});

function popularInfoJogo(jogo) {

    const tituloEl = document.querySelector('h2');
    if (tituloEl) tituloEl.textContent = jogo.titulo;

    const capaEl = document.querySelector('.capaDojogo');
    if (capaEl) {
        capaEl.src = jogo.url_jogo || '/images/default.jpg';
        capaEl.alt = jogo.titulo;
    }
}