document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formularioLogin');

    if (!form) {
        console.error("Formulário não encontrado!");
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value.trim();

        console.log("Email:", email);
        console.log("Senha:", senha ? "******" : "");

        if (!email || !senha) {
            alert("Preencha email e senha!");
            return;
        }

        try {
            const resultado = await window.api.login(email, senha);

            if (resultado.ok) {
                alert("Login realizado com sucesso!");
                window.location.href = "pages/inicio.html";
            } else {
                alert(resultado.data.detail || "Email ou senha incorretos");
            }
        } catch (error) {
            console.error("Erro no login:", error);
            alert("Erro ao conectar com o servidor");
        }
    });
});