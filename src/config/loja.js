// Informações da loja usadas em várias partes do site.
// Troque os textos entre [colchetes] pelos dados reais.

// Número que recebe os pedidos: 55 (Brasil) + 81 (DDD) + telefone, só dígitos
export const WHATSAPP_LOJA = "558191060677";

export const PRAZO_PRODUCAO = "[PRAZO]";
export const FORMAS_PAGAMENTO = "[FORMAS DE PAGAMENTO]";
export const REGIAO_ENVIO = "[REGIÃO]";

// Abas da vitrine. O "nome" precisa ser igual à categoria cadastrada no admin.
// "tamanho" é opcional: sem ele, a medida (Ø ... cm) não aparece.
export const CATEGORIAS = [
  { nome: "Bottons", titulo: "Bottons fotográficos", tamanho: "[TAMANHO]" },
  { nome: "Ímãs", titulo: "Ímãs fotográficos", tamanho: "[TAMANHO]" },
  { nome: "Tags NFC", titulo: "Tags NFC" },
];

export function linkWhatsapp(mensagem) {
  return `https://wa.me/${WHATSAPP_LOJA}?text=${encodeURIComponent(mensagem)}`;
}
