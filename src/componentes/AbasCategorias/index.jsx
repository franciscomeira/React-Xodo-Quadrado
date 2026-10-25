import { useEffect, useRef, useState } from "react";

import "./estilos.css";

// Categorias com "emMais" ficam numa lista que abre pela aba "Mais"
function AbasCategorias({ categorias, ativa, onEscolher }) {
  const [maisAberto, setMaisAberto] = useState(false);
  const refMais = useRef(null);

  const principais = categorias.filter((c) => !c.emMais);
  const extras = categorias.filter((c) => c.emMais);
  const extraAtiva = extras.find((c) => c.nome === ativa);

  // Fecha a lista ao clicar fora dela ou apertar Esc
  useEffect(() => {
    if (!maisAberto) return;

    function aoClicar(evento) {
      if (!refMais.current.contains(evento.target)) setMaisAberto(false);
    }
    function aoApertarTecla(evento) {
      if (evento.key === "Escape") setMaisAberto(false);
    }

    document.addEventListener("pointerdown", aoClicar);
    document.addEventListener("keydown", aoApertarTecla);
    return () => {
      document.removeEventListener("pointerdown", aoClicar);
      document.removeEventListener("keydown", aoApertarTecla);
    };
  }, [maisAberto]);

  function escolher(nome) {
    onEscolher(nome);
    setMaisAberto(false);
  }

  return (
    <div className="abas">
      {principais.map((c) => (
        <button
          key={c.nome}
          className={c.nome === ativa ? "abas__aba abas__aba--ativa" : "abas__aba"}
          aria-pressed={c.nome === ativa}
          onClick={() => escolher(c.nome)}
        >
          {c.nome}
        </button>
      ))}

      {extras.length > 0 && (
        <div className="abas__mais" ref={refMais}>
          <button
            className={extraAtiva ? "abas__aba abas__aba--ativa" : "abas__aba"}
            aria-haspopup="true"
            aria-expanded={maisAberto}
            onClick={() => setMaisAberto((aberto) => !aberto)}
          >
            {/* Mostra a categoria escolhida no lugar de "Mais" */}
            {extraAtiva ? extraAtiva.nome : "Mais"}
            <svg
              className={maisAberto ? "abas__seta abas__seta--aberta" : "abas__seta"}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {maisAberto && (
            <ul className="abas__lista">
              {extras.map((c) => (
                <li key={c.nome}>
                  <button
                    className={
                      c.nome === ativa ? "abas__opcao abas__opcao--ativa" : "abas__opcao"
                    }
                    onClick={() => escolher(c.nome)}
                  >
                    {c.nome}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default AbasCategorias;
