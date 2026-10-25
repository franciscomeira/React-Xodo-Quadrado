import "./estilos.css";

// Cada item tem o desenho do ícone (SVG 24x24) e o texto
const DIFERENCIAIS = [
  {
    texto: "Material resistente",
    icone: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    texto: "Impressão de alta qualidade",
    icone: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
      </>
    ),
  },
  {
    texto: "Feito com carinho",
    icone: (
      <path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z" />
    ),
  },
];

function Diferenciais() {
  return (
    <ul className="diferenciais">
      {DIFERENCIAIS.map((item) => (
        <li key={item.texto} className="diferenciais__item">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {item.icone}
          </svg>
          {item.texto}
        </li>
      ))}
    </ul>
  );
}

export default Diferenciais;
