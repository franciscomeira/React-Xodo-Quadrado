import { formatarPreco } from "../../utils/formatarPreco";
import "./estilos.css";

function textoBotao({ stock, noCarrinho, ehKit }) {
  if (stock === 0) return "Indisponível";
  if (noCarrinho >= stock) return "Todo o estoque no carrinho";
  if (noCarrinho > 0) return `Adicionar mais (${noCarrinho} no carrinho)`;
  return ehKit ? "Personalizar kit" : "Personalizar";
}

// economia: { cada, economiza } em centavos, só para kits que saem mais em conta
function ProdutoCard({
  foto,
  nome,
  descricao,
  preco,
  stock,
  ehKit = false,
  economia = null,
  destaque = false,
  noCarrinho = 0,
  onComprar,
}) {
  return (
    <article
      className={destaque ? "produto-card produto-card--destaque" : "produto-card"}
    >
      {destaque && <span className="produto-card__selo">Melhor custo</span>}

      <img className="produto-card__foto" src={foto} alt={nome} />

      <div className="produto-card__info">
        <h3 className="produto-card__nome">{nome}</h3>
        {descricao && <p className="produto-card__descricao">{descricao}</p>}

        <p className="produto-card__preco">{formatarPreco(preco)}</p>

        {economia && (
          <p className="produto-card__economia">
            {formatarPreco(economia.cada)} cada · economize{" "}
            {formatarPreco(economia.economiza)}
          </p>
        )}

        <button
          className={
            destaque
              ? "produto-card__botao produto-card__botao--cheio"
              : "produto-card__botao"
          }
          onClick={onComprar}
          disabled={noCarrinho >= stock}
        >
          {textoBotao({ stock, noCarrinho, ehKit })}
        </button>
      </div>
    </article>
  );
}

export default ProdutoCard;
