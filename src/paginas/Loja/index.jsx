import { useEffect, useState } from "react";
import { Link } from "react-router";

import ProdutoCard from "../../componentes/ProdutoCard";
import { listarProdutos } from "../../api";
import logo from "../../assets/Logosite.png";
import "./estilos.css";

function Loja() {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    listarProdutos()
      .then(setProdutos)
      .catch(() => setErro(true));
  }, []);

  return (
    <main className="loja">
      <header className="loja__topo">
        <img className="loja__logo" src={logo} alt="Xodó Quadrado" />
      </header>

      <h1 className="loja__titulo">Novos Bottons! ✨</h1>

      {erro && (
        <p className="loja__aviso">
          Não foi possível carregar os produtos. O json-server está rodando?
        </p>
      )}

      <section className="loja__vitrine">
        {produtos.map((produto) => (
          <ProdutoCard
            key={produto.id}
            foto={produto.image}
            nome={produto.name}
            preco={produto.price}
            stock={produto.stock}
            onComprar={() => alert(`${produto.name} adicionado ao carrinho!`)}
          />
        ))}
      </section>

      {import.meta.env.DEV && (
        <footer className="loja__rodape">
          <Link to="/admin">Área do administrador</Link>
        </footer>
      )}
    </main>
  );
}

export default Loja;
