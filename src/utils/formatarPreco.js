// O preço chega em centavos (ex.: 1890 = R$ 18,90)
export function formatarPreco(centavos) {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
