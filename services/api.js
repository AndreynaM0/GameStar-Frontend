const API_BASE_URL = 'http://127.0.0.1:8000';

window.api = {
    getToken: () => localStorage.getItem('access_token'),

    headers: function() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getToken()}`
        };
    },

    async login(email, senha) {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('access_token', data.access_token);
        }
        return { ok: res.ok, data };
    },

    async cadastrar(usuario) {
        const res = await fetch(`${API_BASE_URL}/auth/criar_conta`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        });
        const data = await res.json();
        return { ok: res.ok, data };
    },

    async getUsuarioLogado() {
        const res = await fetch(`${API_BASE_URL}/auth/pegar_usuario`, {
            headers: this.headers()
        });
        return await res.json();
    },

    async listarJogos() {
        const res = await fetch(`${API_BASE_URL}/jogo/listar_jogo`, {
            headers: this.headers()
        });
        return await res.json();
    },

    async criarReview(review) {
        const res = await fetch(`${API_BASE_URL}/review/criar_review`, {
            method: 'POST',
            headers: this.headers(),
            body: JSON.stringify(review)
        });
        const data = await res.json();
        return { ok: res.ok, data };
    },

    async favoritar(jogo_id) {
            const res = await fetch('http://127.0.0.1:8000/favorito/favoritar', {
                method: 'POST',
                headers: this.headers(),
                body: JSON.stringify({ jogo_id: parseInt(jogo_id) })
            });
            const data = await res.json();
            return { ok: res.ok, data };
    },

    async deletarJogo(id) {
        const res = await fetch(`${API_BASE_URL}/jogo/deletar_jogo?id=${id}`, {
            method: 'DELETE',
            headers: this.headers()
        });
        const data = await res.json();
        return { ok: res.ok, data };
    },

    async listarReviews() {
        const res = await fetch('http://127.0.0.1:8000/review/listar_review', {
            headers: this.headers()
        });
        return await res.json();
    },

    async listarFavoritos() {
        const res = await fetch('http://127.0.0.1:8000/favorito/listar_favoritos', {
            headers: this.headers()
        });
        const data = await res.json();
        return data; 
    },

    async criarJogo(jogo) {
        const res = await fetch('http://127.0.0.1:8000/jogo/criar_jogo', {
            method: 'POST',
            headers: this.headers(),
            body: JSON.stringify(jogo)
        });
        const data = await res.json();
        return { ok: res.ok, data };
    },

    async buscarJogo(titulo) {
    const res = await fetch(`http://127.0.0.1:8000/jogo/pesquisar_jogo?titulo=${encodeURIComponent(titulo)}`, {
        headers: this.headers()
    });
    return await res.json();
}
};


