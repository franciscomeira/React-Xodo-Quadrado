import { Link } from "react-router";

import {
  FORMAS_PAGAMENTO,
  REGIAO_ENVIO,
  linkWhatsapp,
} from "../../config/loja";
import "./estilos.css";

function Rodape() {
  return (
    <footer id="duvidas" className="rodape">
      <div className="rodape__conteudo">
        <h2 className="rodape__titulo">Ficou com dúvida?</h2>

        <a
          className="rodape__whatsapp"
          href={linkWhatsapp("Olá! Tenho uma dúvida sobre a Xodó Quadrado 💜")}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
          </svg>
          Fale com a gente no WhatsApp
        </a>

        <p className="rodape__info">
          Pagamento via {FORMAS_PAGAMENTO} · Envio para {REGIAO_ENVIO}
        </p>

        {/* O admin só existe rodando local (npm run dev) */}
        {import.meta.env.DEV && (
          <Link className="rodape__admin" to="/admin">
            Área do administrador
          </Link>
        )}
      </div>
    </footer>
  );
}

export default Rodape;
