import { useEffect } from "react";

import { linkWhatsapp } from "../../config/loja";
import { formatarPreco } from "../../utils/formatarPreco";
import { calcularItem, proximaFaixa } from "../../utils/precos";
import "./estilos.css";

// Monta o texto do pedido e o link que abre a conversa no WhatsApp
function linkDoPedido(itens, { desconto, total }) {
  const linhas = itens.map(
    (item) =>
      `• ${item.quantidade}x ${item.name} — ${formatarPreco(calcularItem(item).total)}`,
  );

  const mensagem = [
    "Olá! Quero fazer um pedido na Xodó Quadrado 💜",
    "",
    ...linhas,
    "",
    ...(desconto > 0
      ? [`Desconto progressivo: -${formatarPreco(desconto)}`]
      : []),
    `*Total: ${formatarPreco(total)}*`,
  ].join("\n");

  return linkWhatsapp(mensagem);
}

function Carrinho({
  itens,
  aberto,
  onFechar,
  onAlterarQuantidade,
  onRemover,
  onLimpar,
}) {
  const resumo = itens.reduce(
    (soma, item) => {
      const { total, semDesconto, desconto } = calcularItem(item);
      return {
        subtotal: soma.subtotal + semDesconto,
        desconto: soma.desconto + desconto,
        total: soma.total + total,
      };
    },
    { subtotal: 0, desconto: 0, total: 0 },
  );

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
        className={
          aberto ? "carrinho__fundo carrinho__fundo--aberto" : "carrinho__fundo"
        }
        onClick={onFechar}
      />

      <aside
        className={aberto ? "carrinho carrinho--aberto" : "carrinho"}
        aria-hidden={!aberto}
        aria-label="Carrinho de compras"
      >
        <header className="carrinho__topo">
          <h2>Seu carrinho</h2>
          <button
            className="carrinho__fechar"
            onClick={onFechar}
            aria-label="Fechar"
          >
            ✕
          </button>
        </header>

        {itens.length === 0 ? (
          <p className="carrinho__vazio">Seu carrinho está vazio 🥲</p>
        ) : (
          <ul className="carrinho__lista">
            {itens.map((item) => {
              const { total, desconto } = calcularItem(item);
              const faixa = proximaFaixa(item);

              return (
                <li key={item.id} className="carrinho__item">
                  <img className="carrinho__foto" src={item.image} alt="" />

                  <div className="carrinho__info">
                    <strong>{item.name}</strong>
                    <span className="carrinho__preco">
                      {desconto > 0 && <s>{formatarPreco(total + desconto)}</s>}{" "}
                      <b>{formatarPreco(total)}</b> ·{" "}
                      {formatarPreco(Math.round(total / item.quantidade))} cada
                    </span>

                    <div className="carrinho__quantidade">
                      <button
                        onClick={() =>
                          onAlterarQuantidade(item.id, item.quantidade - 1)
                        }
                        disabled={item.quantidade <= 1}
                        aria-label="Diminuir"
                      >
                        −
                      </button>
                      <span>{item.quantidade}</span>
                      <button
                        onClick={() =>
                          onAlterarQuantidade(item.id, item.quantidade + 1)
                        }
                        disabled={item.quantidade >= item.stock}
                        aria-label="Aumentar"
                      >
                        +
                      </button>
                    </div>

                    {faixa && item.quantidade < item.stock && (
                      <span className="carrinho__dica">
                        Com +{faixa.faltam} sai {formatarPreco(faixa.cada)} cada
                      </span>
                    )}
                  </div>

                  <button
                    className="carrinho__remover"
                    onClick={() => onRemover(item.id)}
                    aria-label={`Remover ${item.name}`}
                  >
                    Remover
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {itens.length > 0 && (
          <footer className="carrinho__rodape">
            {resumo.desconto > 0 && (
              <dl className="carrinho__resumo">
                <dt>Subtotal</dt>
                <dd>{formatarPreco(resumo.subtotal)}</dd>
                <dt>Desconto progressivo</dt>
                <dd className="carrinho__desconto">
                  −{formatarPreco(resumo.desconto)}
                </dd>
              </dl>
            )}
            <p className="carrinho__total">
              Total <strong>{formatarPreco(resumo.total)}</strong>
            </p>
            <a
              className="carrinho__finalizar"
              href={linkDoPedido(itens, resumo)}
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
