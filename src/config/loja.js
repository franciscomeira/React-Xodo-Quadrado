// Informações da loja usadas em várias partes do site.
// Troque os textos entre [colchetes] pelos dados reais.

// Número que recebe os pedidos: 55 (Brasil) + 81 (DDD) + telefone, só dígitos
export const WHATSAPP_LOJA = "558191060677";

export const PRAZO_PRODUCAO = "[PRAZO]";
export const FORMAS_PAGAMENTO = "[FORMAS DE PAGAMENTO]";
export const REGIAO_ENVIO = "[REGIÃO]";

// Desconto progressivo: preço TOTAL (em centavos) pela quantidade de unidades.
// 7 e 9 não estavam na tabela original: usei o valor do meio entre os vizinhos.
// Acima da maior quantidade, cada unidade extra custa "unidadeExtra".
// Ex.: 11 bottons = R$ 129,90 + R$ 10,90 = R$ 140,80
const PRECOS_BOTTONS = {
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
  unidadeExtra: 1090,
};

// Abas da vitrine. O "nome" precisa ser igual à categoria cadastrada no admin.
// "tamanho" é opcional: sem ele, a medida (Ø ... cm) não aparece.
// "emMais: true" coloca a categoria dentro da aba "Mais" em vez de ter aba própria.
// "tabelaPrecos": no carrinho, os produtos da categoria viram uma linha só e o
// preço sai da tabela pela quantidade total (o "units" do produto diz quantas
// unidades ele coloca no carrinho).
export const CATEGORIAS = [
  {
    nome: "Bottons",
    titulo: "Bottons fotográficos",
    tamanho: "[TAMANHO]",
    tabelaPrecos: PRECOS_BOTTONS,
  },
  { nome: "Ímãs", titulo: "Ímãs fotográficos", tamanho: "[TAMANHO]" },
  { nome: "Tags NFC", titulo: "Tags NFC", emMais: true },
  { nome: "Porta Retrato", titulo: "Porta-retratos", emMais: true },
];

export function linkWhatsapp(mensagem) {
  return `https://wa.me/${WHATSAPP_LOJA}?text=${encodeURIComponent(mensagem)}`;
}
