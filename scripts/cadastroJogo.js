document.addEventListener('DOMContentLoaded', async () => {
    try {
        const usuario = await window.api.getUsuarioLogado();

        document.querySelectorAll('.nome').forEach(el => {
            if (el) el.textContent = usuario.nome;
        });

        if (!usuario.admin) {
            alert("Acesso negado! Apenas administradores podem cadastrar jogos.");
            window.location.href = "inicio.html";
            return;
        }

        console.log("Modo Admin ativado - Cadastro de Jogo");

    } catch (error) {
        console.error("Erro de autenticação:", error);
        alert("Você precisa estar logado como administrador!");
        window.location.href = "index.html";
        return;
    }

    const form = document.getElementById('cadastroJogo') || document.querySelector('form');

    if (!form) {
        console.error("Formulário não encontrado!");
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const titulo = document.getElementById('nomeDoJogo')?.value.trim();
        const descricao = document.getElementById('campoDeTexto')?.value.trim();
        const data_lancamento = document.getElementById('dataLancamento')?.value;
        const url_jogo = document.getElementById('foto-perfil')?.value.trim(); 

        if (!titulo || !descricao || !data_lancamento || !url_jogo) {
            alert("Por favor, preencha todos os campos!");
            return;
        }

        const novoJogo = {
            titulo: titulo,
            descricao: descricao,
            data_lancamento: data_lancamento,
            url_jogo: url_jogo,
            nota_media: 0
        };

        try {
            console.log("Enviando novo jogo:", novoJogo);

            const resultado = await window.api.criarJogo(novoJogo);

            if (resultado.ok) {
                alert("Jogo cadastrado com sucesso!");
                form.reset();
            } else {
                alert(resultado.data.detail || "Erro ao cadastrar o jogo");
            }
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
            alert("Erro de conexão com o servidor");
        }
    });
});