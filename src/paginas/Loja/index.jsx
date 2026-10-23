import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";

import ProdutoCard from "../../componentes/ProdutoCard";
import Carrinho from "../../componentes/Carrinho";
import { listarProdutos } from "../../api";
import logo from "../../assets/Logosite.png";
import "./estilos.css";

// O carrinho fica salvo no navegador para não sumir ao recarregar a página
const CHAVE_CARRINHO = "xodo-carrinho";

function carrinhoSalvo() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_CARRINHO)) ?? [];
  } catch {
    return [];
  }
}

function Loja() {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState(false);
  const [carrinho, setCarrinho] = useState(carrinhoSalvo);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);

  useEffect(() => {
    listarProdutos()
      .then(setProdutos)
      .catch(() => setErro(true));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
    } catch {
      // Sem localStorage (ex.: aba anônima) o carrinho só não fica salvo
    }
  }, [carrinho]);

  const totalDeItens = carrinho.reduce((soma, item) => soma + item.quantidade, 0);

  function quantidadeNoCarrinho(id) {
    return carrinho.find((item) => item.id === id)?.quantidade ?? 0;
  }

  function adicionarAoCarrinho(produto) {
    setCarrinho((atual) => {
      const item = atual.find((i) => i.id === produto.id);

      if (!item) return [...atual, { ...produto, quantidade: 1 }];
      if (item.quantidade >= produto.stock) return atual;

      return atual.map((i) =>
        i.id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i
      );
    });
  }

  function alterarQuantidade(id, quantidade) {
    setCarrinho((atual) =>
      atual.map((i) => (i.id === id ? { ...i, quantidade } : i))
    );
  }

  function removerDoCarrinho(id) {
    setCarrinho((atual) => atual.filter((i) => i.id !== id));
  }

  // useCallback para o Carrinho não recriar o atalho do Esc a cada render
  const fecharCarrinho = useCallback(() => setCarrinhoAberto(false), []);

  return (
    <main className="loja">
      <button
        className="loja__botao-carrinho"
        onClick={() => setCarrinhoAberto(true)}
        aria-label={`Abrir carrinho (${totalDeItens} itens)`}
      >
        <svg
          className="loja__icone-carrinho"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        {totalDeItens > 0 && (
          // A key muda a cada item, o que reinicia a animação do contador
          <span key={totalDeItens} className="loja__contador">
            {totalDeItens}
          </span>
        )}
      </button>

      <header className="loja__topo">
        <img className="loja__logo" src={logo} alt="Xodó Quadrado" />
      </header>

      <h1 className="loja__titulo">Novos Bottons! ✨</h1>

      {erro && (
        <p className="loja__aviso">
          Não foi possível carregar os produtos. O json-server está rodando?
        </p>
      )}

      <section className="loja__vitrine">
        {produtos.map((produto) => (
          <ProdutoCard
            key={produto.id}
            foto={produto.image}
            nome={produto.name}
            preco={produto.price}
            stock={produto.stock}
            noCarrinho={quantidadeNoCarrinho(produto.id)}
            onComprar={() => adicionarAoCarrinho(produto)}
          />
        ))}
      </section>

      {import.meta.env.DEV && (
        <footer className="loja__rodape">
          <Link to="/admin">Área do administrador</Link>
        </footer>
      )}

      <Carrinho
        itens={carrinho}
        aberto={carrinhoAberto}
        onFechar={fecharCarrinho}
        onAlterarQuantidade={alterarQuantidade}
        onRemover={removerDoCarrinho}
        onLimpar={() => setCarrinho([])}
      />
    </main>
  );
}

export default Loja;
