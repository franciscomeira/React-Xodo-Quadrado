import { formatarPreco } from "../../utils/formatarPreco";
import "./estilos.css";

// Avulso: coloca só 1 unidade, uma única vez.
// Kit: leva o carrinho para 2 unidades; a partir daí a pessoa ajusta no carrinho.
function textoBotao({ stock, noCarrinho, ehKit }) {
  if (stock === 0) return "Indisponível";
  if (ehKit) return noCarrinho >= 2 ? "Ajustar quantidade" : "Personalizar kit";
  return noCarrinho > 0 ? "No carrinho ✓" : "Comprar";
}

// economia: { cada, economiza } em centavos, só para kits que saem mais em conta
// precoAPartirDe: { cada, quantidade } com o menor preço por unidade (centavos);
// quando vem, substitui o preço e a economia por "o preço cai até R$ X cada"
function ProdutoCard({
  foto,
  nome,
  descricao,
  preco,
  stock,
  ehKit = false,
  economia = null,
  precoAPartirDe = null,
  destaque = false,
  noCarrinho = 0,
  onComprar,
}) {
  return (
    <article
      className={destaque ? "produto-card produto-card--destaque" : "produto-card"}
    >
      {destaque && <span className="produto-card__selo">Desconto Progressivo</span>}

      <img className="produto-card__foto" src={foto} alt={nome} />

      <div className="produto-card__info">
        <h3 className="produto-card__nome">{nome}</h3>
        {descricao && <p className="produto-card__descricao">{descricao}</p>}

        {precoAPartirDe ? (
          <>
            <p className="produto-card__preco">
              <span className="produto-card__a-partir">o preço cai até</span>
              {formatarPreco(precoAPartirDe.cada)}
              <span className="produto-card__cada"> cada</span>
            </p>
            <p className="produto-card__economia">
              levando {precoAPartirDe.quantidade} ou mais
            </p>
          </>
        ) : (
          <p className="produto-card__preco">{formatarPreco(preco)}</p>
        )}

        {economia && !precoAPartirDe && (
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
          disabled={stock === 0 || (!ehKit && noCarrinho > 0)}
        >
          {textoBotao({ stock, noCarrinho, ehKit })}
        </button>
      </div>
    </article>
  );
}

export default ProdutoCard;
