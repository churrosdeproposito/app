# Churros de Propósito — sistema (feito a partir do Restaurante Modelo 1.0)

O funcionamento é o mesmo do modelo. Mudaram só a aparência, os textos, a logo, os ícones e o cardápio inicial.

## O que é deste restaurante
- **Visual:** chocolate, caramelo e creme, com faixa amarela. A frase "Mais que churros, é propósito." aparece no topo do cardápio e o versículo de 1 Coríntios 10:31 no rodapé.
- **Logo:** `logo.webp` no cardápio, no login e no topo do sistema. A mesma logo vai nas impressões: colorida no A4 e em cinza nas térmicas. `logo-impressao-cor.png` é a marca d'água do cartão fidelidade.
- **Ícones do app:** o carrinho com "Churros" (`icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`).
- **WhatsApp:** já preenchido no `index.html` (16 99714-6056).
- **Nomes:** planilha, pastas do Drive, backups e assistentes de IA usam "Churros de Propósito".
- **Cardápio inicial:** fica em `supabase-codigo/02-cardapio-inicial-churros.sql`. Rode depois do `01-estrutura.sql`.
- **Fotos dos produtos:** estão na pasta `fotos-cardapio`. Suba cada uma pelo app, em Produtos → editar → foto.

## Preços que são palpite (conferir com o dono)
- Churros Misto: R$ 14,00
- Paçoca, Leite em pó e Granulado: R$ 2,00 cada

Doce de Leite (R$ 10) e Chocolate (R$ 12) vieram do cartaz que tem o WhatsApp.

## Ainda falta preencher (igual ao modelo)
- **No `index.html`:** `API_URL`, `CONTINGENCIA_API_URL`, `CONTINGENCIA_CHAVE_PUBLICA`, `SUPABASE_URL_`, `SUPABASE_CHAVE_`, `PUSH_CHAVE_PUBLICA_` e `QR_BASE_URL_`.
- **No app** (Administrador → Dados do restaurante): o horário de funcionamento.
- **Supabase e Apps Script:** siga o `supabase-codigo/LEIAME.md`.
