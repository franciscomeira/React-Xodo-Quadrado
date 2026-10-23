import { formatarPreco } from "../../utils/formatarPreco";
import "./estilos.css";

function textoBotao(stock, noCarrinho) {
  if (stock === 0) return "Indisponível";
  if (noCarrinho >= stock) return "Todo o estoque no carrinho";
  return noCarrinho > 0 ? `Comprar mais (${noCarrinho} no carrinho)` : "Comprar";
}

function ProdutoCard({ foto, nome, preco, onComprar, stock, noCarrinho = 0 }) {
  return (
    <article className="produto-card">
      <div className="produto-card__imagem">
        <img className="produto-card__foto" src={foto} alt={nome} />
      </div>

      <h3 className="produto-card__nome">{nome}</h3>
      <p className="produto-card__preco">{formatarPreco(preco)}</p>

      <button
        className="produto-card__botao"
        onClick={onComprar}
        disabled={noCarrinho >= stock}
      >
        {textoBotao(stock, noCarrinho)}
      </button>
    </article>
  );
}

export default ProdutoCard;
