import { PRAZO_PRODUCAO } from "../../config/loja";
import "./estilos.css";

const PASSOS = [
  { titulo: "Escolha o produto", texto: "Bottons, ímãs, tags NFC ou porta-retratos, unidade ou kit." },
  { titulo: "Envie sua foto", texto: "Pelo site ou pelo WhatsApp, direto do celular." },
  { titulo: "Receba em casa", texto: `Produção em até ${PRAZO_PRODUCAO} dias úteis.` },
];

function ComoFunciona() {
  return (
    <section id="como-funciona" className="como-funciona">
      <h2 className="como-funciona__titulo">Como funciona</h2>

      <ol className="como-funciona__passos">
        {PASSOS.map((passo, indice) => (
          <li key={passo.titulo} className="como-funciona__passo">
            <span className="como-funciona__numero">{indice + 1}</span>
            <div>
              <strong>{passo.titulo}</strong>
              <p>{passo.texto}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default ComoFunciona;
