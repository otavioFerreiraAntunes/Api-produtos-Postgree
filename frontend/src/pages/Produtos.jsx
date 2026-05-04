import { useEffect, useState } from "react";
import API_URL from "../services/api";

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  
  // Estados do formulário (Dica de Ouro: Campos novos adicionados)
  const [idEditando, setIdEditando] = useState(null);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState(0); // Campo novo
  const [categoria, setCategoria] = useState(""); // Campo novo

  // GET - Listar
  async function buscarProdutos() {
    setCarregando(true);
    setErro("");
    try {
      const resposta = await fetch(API_URL);
      if (!resposta.ok) throw new Error("Falha ao buscar dados.");
      const dados = await resposta.json();
      setProdutos(dados);
    } catch (err) {
      setErro("Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    buscarProdutos();
  }, []);

  // POST e PUT - Cadastrar e Editar
  async function salvarProduto(event) {
    event.preventDefault();
    
    // Validação de campos vazios
    if (!nome.trim() || !preco || !categoria.trim()) {
      alert("Preencha os campos obrigatórios (Nome, Preço e Categoria)!");
      return;
    }

    // Mapeamento completo para o Model (Resolvendo erro 400)
    const produtoDados = { 
      nome, 
      preco: Number(preco),
      estoque: Number(estoque), // Garante que é número
      categoria 
    };

    const url = idEditando ? `${API_URL}/${idEditando}` : API_URL;
    const metodo = idEditando ? "PUT" : "POST";

    try {
      const resposta = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produtoDados),
      });

      if (!resposta.ok) {
        const errorData = await resposta.json();
        throw new Error(errorData.mensagem || "Erro ao salvar produto.");
      }
      
      alert(idEditando ? "Produto atualizado!" : "Produto cadastrado com sucesso!");
      limparFormulario();
      buscarProdutos();
    } catch (err) {
      alert(err.message);
    }
  }

  // DELETE - Excluir
  async function excluirProduto(id) {
    const confirmar = window.confirm("Deseja realmente excluir este produto?");
    if (!confirmar) return;

    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      alert("Produto excluído!");
      buscarProdutos();
    } catch (err) {
      alert("Erro ao excluir.");
    }
  }

  function prepararEdicao(produto) {
    setIdEditando(produto.id);
    setNome(produto.nome);
    setPreco(produto.preco);
    setEstoque(produto.estoque || 0); // Preenche estoque na edição[cite: 1]
    setCategoria(produto.categoria || ""); // Preenche categoria na edição[cite: 1]
  }

  function limparFormulario() {
    setIdEditando(null);
    setNome("");
    setPreco("");
    setEstoque(0);
    setCategoria("");
  }

  return (
    <div className="produtos-container">
      <div className="form-card">
        <h2>{idEditando ? "✏️ Editar Produto" : "📦 Novo Produto"}</h2>
        <form onSubmit={salvarProduto}>
          <input
            type="text"
            placeholder="Nome do produto"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Preço (R$)"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
          />
          {/* Dica de Ouro: Novos Inputs adicionados abaixo */}
          <input
            type="number"
            placeholder="Quantidade em estoque"
            value={estoque}
            onChange={(e) => setEstoque(e.target.value)}
          />
          <input
            type="text"
            placeholder="Categoria (ex: Eletrônicos)"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />
          
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {idEditando ? "Salvar Alterações" : "Cadastrar"}
            </button>
            {idEditando && (
              <button type="button" className="btn-secondary" onClick={limparFormulario}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="lista-produtos">
        <h2>Seus Produtos</h2>
        
        {carregando && <p className="status-msg">Carregando...</p>}
        {erro && <p className="status-msg erro">{erro}</p>}
        {!carregando && !erro && produtos.length === 0 && (
          <p className="status-msg vazia">Nenhum produto cadastrado.</p>
        )}

        <div className="grid-produtos">
          {produtos.map((produto) => (
            <div key={produto.id} className="produto-card">
              <span className="badge-categoria">{produto.categoria}</span>
              <h3>{produto.nome}</h3>
              <p className="preco">R$ {Number(produto.preco).toFixed(2)}</p>
              <p className="estoque-info">Estoque: {produto.estoque} unidades</p>
              <div className="card-actions">
                <button className="btn-edit" onClick={() => prepararEdicao(produto)}>Editar</button>
                <button className="btn-delete" onClick={() => excluirProduto(produto.id)}>Excluir</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Produtos;