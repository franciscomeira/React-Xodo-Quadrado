import { CATEGORIAS } from "../config/loja";

export function tabelaDaCategoria(nomeCategoria) {
  return CATEGORIAS.find((c) => c.nome === nomeCategoria)?.tabelaPrecos ?? null;
}

// Preço total de uma quantidade seguindo a tabela de desconto progressivo
export function precoPelaTabela(tabela, quantidade) {
  const maior = Math.max(...Object.keys(tabela.precos).map(Number));
  if (quantidade <= maior) return tabela.precos[quantidade];
  return quantidade * tabela.precoUnidadeAcima;
}

// Menor preço por unidade da tabela e a partir de quantas unidades ele vale
// (o "o preço cai até R$ X cada · levando N+" do card)
export function menorPrecoUnitario(tabela) {
  const quantidades = Object.keys(tabela.precos).map(Number);
  quantidades.push(Math.max(...quantidades) + 1);

  let melhor = null;
  for (const quantidade of quantidades) {
    const cada = precoPelaTabela(tabela, quantidade) / quantidade;
    if (!melhor || cada < melhor.cada) melhor = { cada, quantidade };
  }

  return { cada: Math.round(melhor.cada), quantidade: melhor.quantidade };
}

// Total de uma linha do carrinho e quanto ela custaria sem desconto.
// "price" do item é sempre o preço de UMA unidade.
export function calcularItem(item) {
  const semDesconto = item.price * item.quantidade;
  const tabela = tabelaDaCategoria(item.category);
  const total = tabela ? precoPelaTabela(tabela, item.quantidade) : semDesconto;

  return { total, semDesconto, desconto: semDesconto - total };
}

// Próxima faixa da tabela que baixa o preço por unidade, para incentivar
// a pessoa a levar mais. Devolve null se não houver tabela ou próxima faixa.
export function proximaFaixa(item) {
  const tabela = tabelaDaCategoria(item.category);
  if (!tabela) return null;

  const atual = precoPelaTabela(tabela, item.quantidade) / item.quantidade;
  const quantidades = Object.keys(tabela.precos).map(Number);
  // Inclui a primeira quantidade acima da tabela (onde entra o preço extra)
  quantidades.push(Math.max(...quantidades) + 1);

  for (const q of quantidades) {
    const cada = precoPelaTabela(tabela, q) / q;
    if (q > item.quantidade && cada < atual) {
      return { quantidade: q, faltam: q - item.quantidade, cada: Math.round(cada) };
    }
  }

  return null;
}
