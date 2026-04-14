// =============================================
// script.js — Lógica de Produtos
// =============================================

let produtoEmEdicao = null;

// --- FUNÇÕES AUXILIARES ---

function mostrarMensagem(mensagem) {
    const modal = document.getElementById('modalMessage');
    document.getElementById('modalText').textContent = mensagem;
    modal.style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modalMessage').style.display = 'none';
}

function limparFormulario() {
    document.getElementById('productForm').reset();
    produtoEmEdicao = null;
    document.querySelector('.form-section h2').textContent = 'Adicionar ou Editar Produto';
}

function formatarMoeda(valor) {
    return new Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function escaparAspa(valor) {
    if (!valor) return '';
    return String(valor).replace(/'/g, "\\'");
}

// --- OPERAÇÕES COM A API (CRUD) ---

async function carregarProdutos() {
    const loading = document.getElementById('loadingMessage');
    const empty = document.getElementById('emptyMessage');
    const list = document.getElementById('productsList');

    loading.style.display = 'block';
    empty.style.display = 'none';
    list.innerHTML = '';

    try {
        const resposta = await fetch('/produtos');
        if (!resposta.ok) throw new Error('Erro ao buscar produtos');
        const produtos = await resposta.json();

        loading.style.display = 'none';
        if (produtos.length === 0) {
            empty.style.display = 'block';
        } else {
            exibirTabela(produtos);
        }
    } catch (erro) {
        loading.style.display = 'none';
        mostrarMensagem('Erro ao carregar produtos.');
    }
}

async function criarProduto(dados) {
    try {
        const resposta = await fetch('/produtos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        if (!resposta.ok) throw new Error('Erro ao criar produto');

        mostrarMensagem('Produto cadastrado com sucesso!');
        limparFormulario();
        carregarProdutos();
    } catch (erro) {
        mostrarMensagem('Erro: ' + erro.message);
    }
}

async function atualizarProduto(id, dados) {
    try {
        const resposta = await fetch(`/produtos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        if (!resposta.ok) throw new Error('Erro ao atualizar produto');

        mostrarMensagem('Produto atualizado com sucesso!');
        limparFormulario();
        carregarProdutos();
    } catch (erro) {
        mostrarMensagem('Erro: ' + erro.message);
    }
}

async function deletarProduto(id) {
    if (!confirm('Deseja realmente remover este produto?')) return;
    try {
        const resposta = await fetch(`/produtos/${id}`, { method: 'DELETE' });
        if (!resposta.ok) throw new Error('Erro ao deletar');

        mostrarMensagem('Produto removido!');
        carregarProdutos();
    } catch (erro) {
        mostrarMensagem('Erro ao deletar produto.');
    }
}

// --- EXIBIÇÃO ---

function exibirTabela(produtos) {
    const list = document.getElementById('productsList');
    let html = `<table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Categoria</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody>`;

    produtos.forEach(p => {
        html += `
        <tr>
            <td>#${p.id}</td>
            <td>${p.nome}</td>
            <td>${formatarMoeda(p.preco)}</td>
            <td>${p.estoque} un.</td>
            <td>${p.categoria}</td>
            <td class="acoes">
                <button class="btn btn-edit" onclick="editarProduto(${p.id}, '${escaparAspa(p.nome)}', ${p.preco}, ${p.estoque}, '${escaparAspa(p.categoria)}')">✏️</button>
                <button class="btn btn-danger" onclick="deletarProduto(${p.id})">🗑</button>
            </td>
        </tr>`;
    });
    html += '</tbody></table>';
    list.innerHTML = html;
}

function editarProduto(id, nome, preco, estoque, categoria) {
    produtoEmEdicao = id;
    document.getElementById('nome').value = nome;
    document.getElementById('preco').value = preco;
    document.getElementById('estoque').value = estoque;
    document.getElementById('categoria').value = categoria;

    document.querySelector('.form-section h2').textContent = `Editando Produto #${id}`;
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

// --- BUSCA ---

async function filtrarProdutos() {
    const valor = document.getElementById('searchInput').value.trim();
    const tipo = document.getElementById('searchType').value;

    if (!valor) return carregarProdutos();

    try {
        const url = tipo === 'nome' ? `/produtos/nome/${encodeURIComponent(valor)}` : `/produtos/${valor}`;
        const resposta = await fetch(url);
        let dados = await resposta.json();
        
        if (!Array.isArray(dados)) dados = dados ? [dados] : [];
        
        if (dados.length === 0) {
            document.getElementById('productsList').innerHTML = '';
            document.getElementById('emptyMessage').style.display = 'block';
        } else {
            document.getElementById('emptyMessage').style.display = 'none';
            exibirTabela(dados);
        }
    } catch (erro) {
        mostrarMensagem('Erro na busca.');
    }
}

// --- EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();

    document.getElementById('productForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const dados = {
            nome: document.getElementById('nome').value.trim(),
            preco: parseFloat(document.getElementById('preco').value),
            estoque: parseInt(document.getElementById('estoque').value),
            categoria: document.getElementById('categoria').value.trim()
        };

        if (produtoEmEdicao) {
            atualizarProduto(produtoEmEdicao, dados);
        } else {
            criarProduto(dados);
        }
    });

    document.getElementById('btnLimpar').addEventListener('click', limparFormulario);
    document.getElementById('btnRecarregar').addEventListener('click', carregarProdutos);
    document.getElementById('btnBuscar').addEventListener('click', filtrarProdutos);
    document.getElementById('searchInput').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') filtrarProdutos();
    });
});