import { useCallback, useEffect, useState } from "react";

import Menu from "../../componentes/Menu";
import Hero from "../../componentes/Hero";
import Diferenciais from "../../componentes/Diferenciais";
import AbasCategorias from "../../componentes/AbasCategorias";
import ProdutoCard from "../../componentes/ProdutoCard";
import ComoFunciona from "../../componentes/ComoFunciona";
import Rodape from "../../componentes/Rodape";
import Carrinho from "../../componentes/Carrinho";
import { listarProdutos } from "../../api";
import { CATEGORIAS } from "../../config/loja";
import "./estilos.css";

// O carrinho fica salvo no navegador para não sumir ao recarregar a página.
// (v2: formato novo com desconto progressivo; carrinhos antigos são ignorados)
const CHAVE_CARRINHO = "xodo-carrinho-v2";

function carrinhoSalvo() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_CARRINHO)) ?? [];
  } catch {
    return [];
  }
}

// Compara cada kit com o preço da unidade avulsa da mesma categoria.
// Devolve a economia de cada kit e qual deles tem o menor preço por unidade.
function calcularEconomias(produtos) {
  const avulso = produtos.find((p) => (p.units ?? 1) === 1);
  const economias = {};
  let melhorId = null;

  if (!avulso) return { economias, melhorId };

  for (const p of produtos) {
    const unidades = p.units ?? 1;
    const economiza = avulso.price * unidades - p.price;
    if (unidades <= 1 || economiza <= 0) continue;

    economias[p.id] = { cada: Math.round(p.price / unidades), economiza };
    if (!melhorId || economias[p.id].cada < economias[melhorId].cada) {
      melhorId = p.id;
    }
  }

  return { economias, melhorId };
}

function Loja() {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState(CATEGORIAS[0].nome);
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

  const totalDeItens = carrinho.reduce(
    (soma, item) => soma + item.quantidade,
    0,
  );

  const categoria = CATEGORIAS.find((c) => c.nome === abaAtiva);
  const produtosDaAba = produtos.filter((p) => p.category === abaAtiva);
  const { economias, melhorId } = calcularEconomias(produtosDaAba);

  // Produtos de categoria com tabela de preços (ex.: Bottons) viram uma linha
  // só no carrinho, somando as unidades; os outros ficam um por produto.
  function itemDoCarrinho(produto) {
    const unidades = produto.units ?? 1;
    const categoria = CATEGORIAS.find((c) => c.nome === produto.category);

    if (!categoria?.tabelaPrecos) {
      return { ...produto, unidades, quantidade: unidades };
    }

    // O estoque e o preço base vêm do produto avulso (1 unidade) da categoria
    const avulso = produtos.find(
      (p) => p.category === produto.category && (p.units ?? 1) === 1,
    );

    return {
      id: `categoria:${categoria.nome}`,
      category: categoria.nome,
      name: categoria.titulo,
      image: (avulso ?? produto).image,
      price: categoria.tabelaPrecos.precos[1],
      stock: avulso?.stock ?? produto.stock,
      unidades,
      quantidade: unidades,
    };
  }

  function quantidadeNoCarrinho(produto) {
    const id = itemDoCarrinho(produto).id;
    return carrinho.find((item) => item.id === id)?.quantidade ?? 0;
  }

  function adicionarAoCarrinho(produto) {
    const novo = itemDoCarrinho(produto);

    setCarrinho((atual) => {
      const item = atual.find((i) => i.id === novo.id);
      if (!item) return [...atual, novo];

      const quantidade = Math.min(item.quantidade + novo.unidades, item.stock);
      return atual.map((i) => (i.id === novo.id ? { ...i, quantidade } : i));
    });
  }

  function alterarQuantidade(id, quantidade) {
    setCarrinho((atual) =>
      atual.map((i) => (i.id === id ? { ...i, quantidade } : i)),
    );
  }

  function removerDoCarrinho(id) {
    setCarrinho((atual) => atual.filter((i) => i.id !== id));
  }

  // useCallback para o Carrinho não recriar o atalho do Esc a cada render
  const fecharCarrinho = useCallback(() => setCarrinhoAberto(false), []);

  return (
    <>
      <Menu
        totalDeItens={totalDeItens}
        onAbrirCarrinho={() => setCarrinhoAberto(true)}
      />

      <main className="loja">
        <Hero />
        <Diferenciais />

        <section id="produtos" className="loja__produtos">
          <AbasCategorias
            categorias={CATEGORIAS}
            ativa={abaAtiva}
            onEscolher={setAbaAtiva}
          />

          <div className="loja__cabecalho">
            <h2 className="loja__titulo">{categoria.titulo}</h2>
            {categoria.tamanho && (
              <span className="loja__tamanho">Ø {categoria.tamanho} cm</span>
            )}
          </div>

          {erro && (
            <p className="loja__aviso">
              Não foi possível carregar os produtos. O json-server está rodando?
            </p>
          )}

          {!erro && produtos.length > 0 && produtosDaAba.length === 0 && (
            <p className="loja__aviso">Em breve por aqui ✨</p>
          )}

          <div className="loja__vitrine">
            {produtosDaAba.map((produto) => (
              <ProdutoCard
                key={produto.id}
                foto={produto.image}
                nome={produto.name}
                descricao={produto.description}
                preco={produto.price}
                stock={itemDoCarrinho(produto).stock}
                ehKit={(produto.units ?? 1) > 1}
                economia={economias[produto.id]}
                destaque={produto.id === melhorId}
                noCarrinho={quantidadeNoCarrinho(produto)}
                onComprar={() => adicionarAoCarrinho(produto)}
              />
            ))}
          </div>
        </section>

        <ComoFunciona />

        <Carrinho
          itens={carrinho}
          aberto={carrinhoAberto}
          onFechar={fecharCarrinho}
          onAlterarQuantidade={alterarQuantidade}
          onRemover={removerDoCarrinho}
          onLimpar={() => setCarrinho([])}
        />
      </main>

      <Rodape />
    </>
  );
}

export default Loja;
