import "./estilos.css";

// O preço chega em centavos (ex.: 1890 = R$ 18,90)
function formatarPreco(centavos) {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function ProdutoCard({ foto, nome, preco, onComprar, stock }) {
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
        disabled={stock === 0}
      >
        {stock > 0 ? "Comprar" : "Indisponível"}
      </button>
    </article>
  );
}

export default ProdutoCard;
