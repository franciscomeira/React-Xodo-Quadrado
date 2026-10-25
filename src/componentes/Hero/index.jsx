import "./estilos.css";

function Hero() {
  return (
    <section className="hero">
      <span className="hero__selo">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.1 2.1M15.6 15.6l2.1 2.1M6.3 17.7l2.1-2.1M15.6 8.4l2.1-2.1" />
        </svg>
        Novidade: bottons
      </span>

      <h1 className="hero__titulo">Ímãs e bottons fotográficos</h1>

      <p className="hero__texto">
        Suas fotos favoritas viram ímãs de geladeira e bottons para mochila,
        roupa ou presente. Você envia a foto, a gente cuida do resto.
      </p>

      <div className="hero__botoes">
        <a className="hero__botao hero__botao--cheio" href="#produtos">
          Ver produtos
        </a>
        <a className="hero__botao hero__botao--contorno" href="#como-funciona">
          Como funciona
        </a>
      </div>
    </section>
  );
}

export default Hero;
