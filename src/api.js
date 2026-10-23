import dados from "../db.json";

// Funções que conversam com o json-server (o /api é repassado pelo Vite)
const URL_PRODUTOS = "/api/products";

async function requisitar(url, opcoes) {
  const resposta = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...opcoes,
  });

  if (!resposta.ok) {
    throw new Error(`Erro ${resposta.status} ao acessar ${url}`);
  }

  return resposta.json();
}

// No site publicado (Vercel) não existe json-server: os produtos vêm do
// db.json que vai junto no build. Para mudar, use o admin local e faça push.
export function listarProdutos() {
  if (import.meta.env.PROD) {
    return Promise.resolve(dados.products);
  }

  return requisitar(URL_PRODUTOS);
}

export function criarProduto(produto) {
  return requisitar(URL_PRODUTOS, {
    method: "POST",
    body: JSON.stringify(produto),
  });
}

export function atualizarProduto(id, produto) {
  return requisitar(`${URL_PRODUTOS}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(produto),
  });
}

export function removerProduto(id) {
  return requisitar(`${URL_PRODUTOS}/${id}`, { method: "DELETE" });
}
