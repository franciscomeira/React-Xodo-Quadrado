import { useEffect, useState } from "react";
import { Link } from "react-router";

import {
  atualizarProduto,
  criarProduto,
  listarProdutos,
  removerProduto,
} from "../../api";
import { CATEGORIAS } from "../../config/loja";
import { formatarPreco } from "../../utils/formatarPreco";
import "./estilos.css";

const FORMULARIO_VAZIO = {
  name: "",
  category: CATEGORIAS[0].nome,
  description: "",
  units: 1,
  price: "",
  stock: "",
  image: "/avatar.png",
};

// O preço é guardado em centavos, mas no formulário a pessoa digita em reais
function paraCentavos(reais) {
  return Math.round(Number(reais) * 100);
}

// Lê a foto escolhida e devolve como texto (data URL em base64),
// que pode ser guardado direto no db.json.
// O json-server só aceita requisições de até 100 KB, então a imagem vai
// sendo diminuída até caber. O webp mantém a transparência e comprime bem.
const TAMANHO_MAXIMO = 600;
const LIMITE_BYTES = 80 * 1024;

function desenharImagem(img, lado) {
  const escala = Math.min(1, lado / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * escala);
  canvas.height = Math.round(img.height * escala);
  canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function imagemParaTexto(arquivo) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(arquivo);

    img.onload = () => {
      URL.revokeObjectURL(url);

      // Tenta primeiro 600px; se ainda ficar grande, vai encolhendo
      for (let lado = TAMANHO_MAXIMO; lado >= 150; lado -= 75) {
        const texto = desenharImagem(img, lado).toDataURL("image/webp", 0.8);
        if (texto.length <= LIMITE_BYTES) {
          resolve(texto);
          return;
        }
      }

      reject(new Error("Imagem grande demais"));
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Arquivo de imagem inválido"));
    };

    img.src = url;
  });
}

// Agrupa os produtos pelas categorias da loja, na mesma ordem das abas.
// Produtos com categoria que não existe mais ficam em "Sem categoria".
function gruposDeProdutos(produtos) {
  const nomes = CATEGORIAS.map((c) => c.nome);
  const grupos = CATEGORIAS.map((c) => ({
    nome: c.nome,
    produtos: produtos.filter((p) => p.category === c.nome),
  }));

  const semCategoria = produtos.filter((p) => !nomes.includes(p.category));
  if (semCategoria.length > 0) {
    grupos.push({ nome: "Sem categoria", produtos: semCategoria });
  }

  return grupos;
}

function Admin() {
  const [produtos, setProdutos] = useState([]);
  const [formulario, setFormulario] = useState(FORMULARIO_VAZIO);
  // null = cadastrando um produto novo; um id = editando aquele produto
  const [editandoId, setEditandoId] = useState(null);
  const [erro, setErro] = useState("");

  function carregarProdutos() {
    listarProdutos()
      .then(setProdutos)
      .catch(() =>
        setErro("Não foi possível carregar os produtos. O json-server está rodando?")
      );
  }

  useEffect(carregarProdutos, []);

  function alterarCampo(evento) {
    const { name, value } = evento.target;
    setFormulario((atual) => ({ ...atual, [name]: value }));
  }

  async function escolherImagem(evento) {
    const arquivo = evento.target.files[0];
    if (!arquivo) return;

    try {
      const image = await imagemParaTexto(arquivo);
      setFormulario((atual) => ({ ...atual, image }));
    } catch {
      setErro("Não foi possível ler essa imagem.");
    }
  }

  function editar(produto) {
    setEditandoId(produto.id);
    setFormulario({
      name: produto.name,
      category: produto.category ?? CATEGORIAS[0].nome,
      description: produto.description ?? "",
      units: produto.units ?? 1,
      price: produto.price / 100,
      stock: produto.stock,
      image: produto.image,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setFormulario(FORMULARIO_VAZIO);
  }

  async function salvar(evento) {
    evento.preventDefault();

    const produto = {
      name: formulario.name.trim(),
      category: formulario.category,
      description: formulario.description.trim(),
      units: Number(formulario.units),
      price: paraCentavos(formulario.price),
      stock: Number(formulario.stock),
      image: formulario.image.trim(),
    };

    try {
      if (editandoId === null) {
        await criarProduto(produto);
      } else {
        await atualizarProduto(editandoId, produto);
      }
      setErro("");
      cancelarEdicao();
      carregarProdutos();
    } catch {
      setErro(
        "Não foi possível salvar o produto. O json-server está rodando? (npm run api)"
      );
    }
  }

  async function excluir(produto) {
    if (!window.confirm(`Excluir "${produto.name}"?`)) return;

    try {
      await removerProduto(produto.id);
      if (editandoId === produto.id) cancelarEdicao();
      carregarProdutos();
    } catch {
      setErro("Não foi possível excluir o produto.");
    }
  }

  return (
    <main className="admin">
      <header className="admin__topo">
        <h1 className="admin__titulo">Painel Admin</h1>
        <Link className="admin__voltar" to="/">
          ← Ver loja
        </Link>
      </header>

      {erro && <p className="admin__erro">{erro}</p>}

      <form className="admin__formulario" onSubmit={salvar}>
        <h2>{editandoId === null ? "Novo produto" : "Editar produto"}</h2>

        <label>
          Nome
          <input
            name="name"
            value={formulario.name}
            onChange={alterarCampo}
            required
          />
        </label>

        <label>
          Descrição
          <input
            name="description"
            value={formulario.description}
            onChange={alterarCampo}
            placeholder="Ex.: Uma foto sua, fecho de alfinete"
          />
        </label>

        <div className="admin__linha">
          <label>
            Categoria
            <select
              name="category"
              value={formulario.category}
              onChange={alterarCampo}
            >
              {CATEGORIAS.map((c) => (
                <option key={c.nome}>{c.nome}</option>
              ))}
            </select>
          </label>

          {/* Usado para calcular o "R$ X cada · economize" dos kits na loja */}
          <label>
            Unidades no kit
            <input
              name="units"
              type="number"
              min="1"
              step="1"
              value={formulario.units}
              onChange={alterarCampo}
              required
            />
          </label>
        </div>

        <div className="admin__linha">
          <label>
            Preço (R$)
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formulario.price}
              onChange={alterarCampo}
              required
            />
          </label>

          <label>
            Estoque
            <input
              name="stock"
              type="number"
              min="0"
              step="1"
              value={formulario.stock}
              onChange={alterarCampo}
              required
            />
          </label>
        </div>

        <div className="admin__imagem">
          <img className="admin__previa" src={formulario.image} alt="" />

          <label>
            Imagem
            <input type="file" accept="image/*" onChange={escolherImagem} />
          </label>
        </div>

        <div className="admin__acoes">
          <button className="admin__botao" type="submit">
            {editandoId === null ? "Adicionar" : "Salvar alterações"}
          </button>

          {editandoId !== null && (
            <button
              className="admin__botao admin__botao--secundario"
              type="button"
              onClick={cancelarEdicao}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Mesma organização da loja: um grupo por categoria, na ordem das abas */}
      {gruposDeProdutos(produtos).map((grupo) => (
        <section key={grupo.nome} className="admin__grupo">
          <h2 className="admin__grupo-titulo">
            {grupo.nome}{" "}
            <span>
              ({grupo.produtos.length}{" "}
              {grupo.produtos.length === 1 ? "produto" : "produtos"})
            </span>
          </h2>

          {grupo.produtos.length === 0 ? (
            <p className="admin__vazio">Nenhum produto nesta categoria.</p>
          ) : (
            <ul className="admin__lista">
              {grupo.produtos.map((produto) => (
                <li key={produto.id} className="admin__item">
                  <img className="admin__foto" src={produto.image} alt="" />

                  <div className="admin__info">
                    <strong>{produto.name}</strong>
                    <span>
                      {formatarPreco(produto.price)} · {produto.stock} em
                      estoque
                    </span>
                  </div>

                  <div className="admin__acoes">
                    <button
                      className="admin__botao admin__botao--secundario"
                      onClick={() => editar(produto)}
                    >
                      Editar
                    </button>
                    <button
                      className="admin__botao admin__botao--perigo"
                      onClick={() => excluir(produto)}
                    >
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </main>
  );
}

export default Admin;
