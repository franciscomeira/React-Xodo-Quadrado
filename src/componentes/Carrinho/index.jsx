import { useEffect } from "react";

import { linkWhatsapp } from "../../config/loja";
import { formatarPreco } from "../../utils/formatarPreco";
import "./estilos.css";

// Monta o texto do pedido e o link que abre a conversa no WhatsApp
function linkDoPedido(itens, total) {
  const linhas = itens.map(
    (item) =>
      `• ${item.quantidade}x ${item.name} — ${formatarPreco(item.price * item.quantidade)}`
  );

  const mensagem = [
    "Olá! Quero fazer um pedido na Xodó Quadrado 💜",
    "",
    ...linhas,
    "",
    `*Total: ${formatarPreco(total)}*`,
  ].join("\n");

  return linkWhatsapp(mensagem);
}

function Carrinho({ itens, aberto, onFechar, onAlterarQuantidade, onRemover, onLimpar }) {
  const total = itens.reduce((soma, item) => soma + item.price * item.quantidade, 0);

  // Fecha o carrinho com a tecla Esc
  useEffect(() => {
    if (!aberto) return;

    function aoApertarTecla(evento) {
      if (evento.key === "Escape") onFechar();
    }

    window.addEventListener("keydown", aoApertarTecla);
    return () => window.removeEventListener("keydown", aoApertarTecla);
  }, [aberto, onFechar]);

  return (
    <>
      <div
        className={aberto ? "carrinho__fundo carrinho__fundo--aberto" : "carrinho__fundo"}
        onClick={onFechar}
      />

      <aside
        className={aberto ? "carrinho carrinho--aberto" : "carrinho"}
        aria-hidden={!aberto}
        aria-label="Carrinho de compras"
      >
        <header className="carrinho__topo">
          <h2>Seu carrinho</h2>
          <button className="carrinho__fechar" onClick={onFechar} aria-label="Fechar">
            ✕
          </button>
        </header>

        {itens.length === 0 ? (
          <p className="carrinho__vazio">Seu carrinho está vazio 🥲</p>
        ) : (
          <ul className="carrinho__lista">
            {itens.map((item) => (
              <li key={item.id} className="carrinho__item">
                <img className="carrinho__foto" src={item.image} alt="" />

                <div className="carrinho__info">
                  <strong>{item.name}</strong>
                  <span>{formatarPreco(item.price)}</span>

                  <div className="carrinho__quantidade">
                    <button
                      onClick={() => onAlterarQuantidade(item.id, item.quantidade - 1)}
                      disabled={item.quantidade <= 1}
                      aria-label="Diminuir"
                    >
                      −
                    </button>
                    <span>{item.quantidade}</span>
                    <button
                      onClick={() => onAlterarQuantidade(item.id, item.quantidade + 1)}
                      disabled={item.quantidade >= item.stock}
                      aria-label="Aumentar"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  className="carrinho__remover"
                  onClick={() => onRemover(item.id)}
                  aria-label={`Remover ${item.name}`}
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}

        {itens.length > 0 && (
          <footer className="carrinho__rodape">
            <p className="carrinho__total">
              Total <strong>{formatarPreco(total)}</strong>
            </p>
            <a
              className="carrinho__finalizar"
              href={linkDoPedido(itens, total)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Finalizar pelo WhatsApp
            </a>
            <button className="carrinho__limpar" onClick={onLimpar}>
              Esvaziar carrinho
            </button>
          </footer>
        )}
      </aside>
    </>
  );
}

export default Carrinho;
