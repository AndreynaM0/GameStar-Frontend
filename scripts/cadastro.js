document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    if (!form) {
        console.error("Formulário de cadastro não encontrado!");
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nome = document.getElementById('usuario')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const senha = document.getElementById('senha')?.value.trim();
        const confirmarSenha = document.getElementById('confirmarSenha')?.value.trim();

        if (!nome || !email || !senha || !confirmarSenha) {
            alert("Preencha todos os campos!");
            return;
        }

        if (senha !== confirmarSenha) {
            alert("As senhas não coincidem!");
            return;
        }

        if (senha.length < 6) {
            alert("A senha deve ter no mínimo 6 caracteres!");
            return;
        }

        const usuario = {
            nome: nome,
            email: email,
            senha: senha,
            admin: false
        };

        console.log("Enviando cadastro:", usuario);

        try {
            const resultado = await window.api.cadastrar(usuario);

            console.log("Resposta da API:", resultado);

            if (resultado.ok) {
                alert("Cadastro realizado com sucesso!\n\nFaça login agora.");
                window.location.href = "../index.html";
            } else {
                alert(resultado.data.detail || "Erro ao cadastrar usuário");
            }
        } catch (error) {
            console.error("Erro completo:", error);
            alert("Erro de conexão com a API. Verifique se o servidor está rodando.");
        }
    });
});