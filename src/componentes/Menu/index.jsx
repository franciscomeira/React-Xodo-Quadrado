import { useEffect, useState } from "react";

// Mascote e nome recortados da Logosite.png para ficarem lado a lado
import mascote from "../../assets/logo-mascote.png";
import nome from "../../assets/logo-texto.png";
import "./estilos.css";

const LINKS = [
  { href: "#produtos", texto: "Produtos" },
  { href: "#como-funciona", texto: "Como funciona" },
  { href: "#duvidas", texto: "Dúvidas" },
];

function Menu({ totalDeItens, onAbrirCarrinho }) {
  // Só liga a sombra quando a página rolou: o menu não muda de tamanho
  const [rolou, setRolou] = useState(false);

  useEffect(() => {
    function aoRolar() {
      setRolou(window.scrollY > 4);
    }

    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  return (
    <header className={rolou ? "menu menu--rolou" : "menu"}>
      <div className="menu__conteudo">
        <a className="menu__marca" href="#" aria-label="Xodó Quadrado, voltar ao início">
          <img className="menu__mascote" src={mascote} alt="" />
          <img className="menu__nome" src={nome} alt="" />
        </a>

        <nav className="menu__links" aria-label="Seções da página">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.texto}
            </a>
          ))}
        </nav>

        <button
          className="menu__carrinho"
          onClick={onAbrirCarrinho}
          aria-label={`Abrir carrinho, ${totalDeItens} ${totalDeItens === 1 ? "item" : "itens"}`}
        >
          <svg
            className="menu__icone"
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

          <span className="menu__carrinho-texto">Carrinho</span>

          {totalDeItens > 0 && (
            // A key muda a cada item, o que reinicia a animação do contador
            <span key={totalDeItens} className="menu__contador" aria-hidden="true">
              {totalDeItens}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

export default Menu;
