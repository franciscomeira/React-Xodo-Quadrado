// Informações da loja usadas em várias partes do site.
// Troque os textos entre [colchetes] pelos dados reais.

// Número que recebe os pedidos: 55 (Brasil) + 81 (DDD) + telefone, só dígitos
export const WHATSAPP_LOJA = "558191060677";

export const PRAZO_PRODUCAO = "[PRAZO]";
export const FORMAS_PAGAMENTO = "[FORMAS DE PAGAMENTO]";
export const REGIAO_ENVIO = "[REGIÃO]";

// Desconto progressivo: preço TOTAL (em centavos) pela quantidade de unidades.
// Hoje a mesma tabela vale para Bottons, Ímãs e Porta Retrato; para uma
// categoria ter preços próprios, crie outra tabela igual a esta e use nela.
// 7 e 9 não estavam na tabela original: usei o valor do meio entre os vizinhos.
// Acima da maior quantidade, TODAS as unidades custam "precoUnidadeAcima".
// Ex.: 11 bottons = 11 × R$ 10,90 = R$ 119,90
const TABELA_PRECOS = {
  precos: {
    1: 1590,
    2: 2990,
    3: 4290,
    4: 5590,
    5: 6890,
    6: 7990,
    7: 9190,
    8: 10390,
    9: 11690,
    10: 12990,
  },
  precoUnidadeAcima: 1090,
};

// Abas da vitrine. O "nome" precisa ser igual à categoria cadastrada no admin.
// "tamanho" é opcional: sem ele, a medida (Ø ... cm) não aparece.
// "emMais: true" coloca a categoria dentro da aba "Mais" em vez de ter aba própria.
// "semLaminacao: true": no carrinho não aparece a escolha de laminação.
// "tabelaPrecos": no carrinho, os produtos da categoria viram uma linha só e o
// preço sai da tabela pela quantidade total (o "units" do produto diz quantas
// unidades ele coloca no carrinho).
export const CATEGORIAS = [
  {
    nome: "Ímãs",
    titulo: "Ímãs fotográficos",
    tamanho: "[TAMANHO]",
    tabelaPrecos: TABELA_PRECOS,
  },
  {
    nome: "Bottons",
    titulo: "Bottons fotográficos",
    tamanho: "[TAMANHO]",
    tabelaPrecos: TABELA_PRECOS,
  },
  {
    nome: "Porta Retrato",
    titulo: "Porta-retratos",
    semLaminacao: true,
    tabelaPrecos: TABELA_PRECOS,
  },
  { nome: "Tags NFC", titulo: "Tags NFC" },
];

// Tipos de laminação (proteção da foto) que a pessoa escolhe no carrinho.
// O primeiro é o padrão de todo item novo.
export const LAMINACOES = ["Tradicional", "Holográfica"];

export function temLaminacao(nomeCategoria) {
  return !CATEGORIAS.find((c) => c.nome === nomeCategoria)?.semLaminacao;
}

export function linkWhatsapp(mensagem) {
  return `https://wa.me/${WHATSAPP_LOJA}?text=${encodeURIComponent(mensagem)}`;
}
