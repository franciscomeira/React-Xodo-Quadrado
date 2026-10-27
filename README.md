# Xodó Quadrado

Loja online de produtos fotográficos personalizados — ímãs, bottons, porta-retratos e tags NFC. A pessoa escolhe os produtos, monta o carrinho e finaliza o pedido pelo WhatsApp.

Feita com **React 19**, **Vite** e **React Router**. Em desenvolvimento, os produtos ficam no `db.json` e são editados por um painel admin servido pelo **json-server**.

## Funcionalidades

- **Vitrine por categoria** — abas Ímãs, Bottons, Porta Retrato e Tags NFC.
- **Dois cards por categoria** — o avulso (adiciona 1 unidade) e o de quantidade personalizada (começa com 2 e a pessoa ajusta no carrinho).
- **Desconto progressivo** — o preço total sai de uma tabela pela quantidade; o carrinho mostra subtotal, desconto, preço por unidade e quanto falta para a próxima faixa.
- **Laminação** — no carrinho, cada categoria escolhe Tradicional ou Holográfica (exceto Porta Retrato).
- **Carrinho salvo no navegador** — não some ao recarregar a página.
- **Pedido pelo WhatsApp** — o botão "Finalizar" abre o WhatsApp com o pedido já escrito (itens, laminação, desconto e total).
- **Painel admin** (só local) — cadastrar, editar e excluir produtos, com upload e compressão da foto.

## Como rodar

Pré-requisito: Node.js 22.12 ou mais recente (exigido pelo json-server).

```bash
npm install
```

Abra **dois terminais** na pasta do projeto:

```bash
npm run api   # json-server na porta 3001, lê e grava o db.json
npm run dev   # site em http://localhost:5173
```

- Loja: http://localhost:5173
- Admin: http://localhost:5173/admin

Se a página mostrar "Não foi possível carregar os produtos", a API não está rodando — confira o terminal do `npm run api`.

### Outros comandos

| Comando | O que faz |
|---|---|
| `npm run build` | Gera a versão de produção em `dist/` |
| `npm run preview` | Abre a versão de produção localmente (como fica na Vercel) |
| `npm run lint` | Verifica o código com o ESLint |

## Onde mudar cada coisa

Quase tudo que muda com frequência fica em **[`src/config/loja.js`](src/config/loja.js)**:

| O quê | Onde |
|---|---|
| Número do WhatsApp que recebe os pedidos | `WHATSAPP_LOJA` (só dígitos, com 55 e DDD) |
| Prazo, formas de pagamento e região de envio | `PRAZO_PRODUCAO`, `FORMAS_PAGAMENTO`, `REGIAO_ENVIO` |
| Categorias, ordem das abas, título e tamanho | `CATEGORIAS` |
| Tabela de desconto progressivo | `TABELA_PRECOS` |
| Tipos de laminação | `LAMINACOES` |

### Categorias

Cada item de `CATEGORIAS` aceita:

| Campo | Para que serve |
|---|---|
| `nome` | Nome da aba. Precisa ser igual à categoria cadastrada no admin. |
| `titulo` | Título da seção e nome da linha no carrinho. |
| `tamanho` | Medida exibida como "Ø … cm". Opcional. |
| `tabelaPrecos` | Liga o desconto progressivo: os produtos da categoria viram uma linha só no carrinho. |
| `semLaminacao` | `true` esconde a escolha de laminação no carrinho. |
| `emMais` | `true` move a categoria para a aba "Mais" em vez de ter aba própria. |

A primeira categoria da lista é a aba que abre por padrão.

### Tabela de preços

`TABELA_PRECOS.precos` guarda o **preço total** (em centavos) para cada quantidade, de 1 a 10. A partir de 11 unidades, todas saem pelo `precoUnidadeAcima`.

| Quantidade | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11+ |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Total (R$) | 15,90 | 29,90 | 42,90 | 55,90 | 68,90 | 79,90 | 91,90 | 103,90 | 116,90 | 129,90 | 10,90 cada |

Hoje Ímãs, Bottons e Porta Retrato usam a mesma tabela. Para uma categoria ter preços próprios, crie outra tabela no mesmo formato e use-a no `tabelaPrecos` dela.

> O preço exibido no card vem do `db.json`. Ao mudar a tabela, ajuste também o preço dos produtos no admin para o card e o carrinho mostrarem o mesmo valor.

### Produtos

Os produtos ficam no [`db.json`](db.json) e são editados pelo admin. Campos de cada produto:

| Campo | Exemplo | Observação |
|---|---|---|
| `name` | `1 ímã` | |
| `category` | `Ímãs` | Igual a um `nome` de `CATEGORIAS` |
| `description` | `Uma foto sua, ímã de geladeira` | |
| `units` | `1` ou `2` | Quantas unidades o card coloca no carrinho |
| `price` | `1590` | Em centavos (R$ 15,90) |
| `stock` | `50` | O limite no carrinho usa o estoque do produto avulso |
| `image` | `/produtos/ima.webp` | Caminho em `public/` ou imagem enviada pelo admin |

Fotos de produto ficam em `public/produtos/` (versões otimizadas em webp). Os originais em alta resolução estão em `src/assets/`.

## Estrutura

```
src/
├── App.jsx              Rotas (/ e /admin)
├── api.js               Leitura e gravação dos produtos
├── config/loja.js       Configurações da loja (ver acima)
├── utils/
│   ├── formatarPreco.js Formata centavos em R$
│   └── precos.js        Desconto progressivo e dicas de faixa
├── paginas/
│   ├── Loja/            Página inicial e lógica do carrinho
│   └── Admin/           Painel de produtos (só em desenvolvimento)
└── componentes/
    ├── Menu/            Menu fixo com logo, links e botão do carrinho
    ├── Hero/            Título e chamada do topo
    ├── Diferenciais/    Os três ícones de vantagens
    ├── AbasCategorias/  Abas da vitrine (com a opção "Mais")
    ├── ProdutoCard/     Card de produto
    ├── Carrinho/        Painel lateral do carrinho e pedido no WhatsApp
    ├── ComoFunciona/    Os três passos
    └── Rodape/          Rodapé com contato pelo WhatsApp
```

## Publicação (Vercel)

O site é publicado na Vercel a cada `git push` na branch `main`.

Em produção **não existe json-server**: a loja lê os produtos direto do `db.json`, que vai junto no build, e a rota `/admin` não é incluída. Para mudar produtos:

1. Rode `npm run api` e `npm run dev`.
2. Edite os produtos em http://localhost:5173/admin.
3. Faça `git add`, `git commit` e `git push` — a Vercel publica a nova versão em cerca de 1 minuto.

## Limitações conhecidas

- O admin não tem login; por isso só existe rodando localmente.
- O json-server aceita requisições de até 100 KB: o admin reduz as fotos enviadas para caber nesse limite.
- Não há pagamento online: o pedido é fechado pelo WhatsApp.
