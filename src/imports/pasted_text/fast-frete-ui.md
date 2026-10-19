# Prompt — Figma AI: FAST Frete UI

---

Crie o design completo de um sistema web interno chamado **FAST Frete**, usado por equipes de logística para calcular fretes automaticamente. O sistema tem sidebar fixa + área de conteúdo. Siga rigorosamente o design system e as 5 telas abaixo.

---

## Design System

**Cores:**
- Fundo principal: `#0D1117`
- Superfície de cards/painéis: `#161B22`
- Borda sutil: `#30363D`
- Acento primário (botões, links ativos): `#F0A500` (âmbar)
- Sucesso / status positivo: `#3FB950` (verde)
- Erro / status negativo: `#F85149` (vermelho)
- Alerta / status pendente: `#D29922` (amarelo)
- Texto principal: `#E6EDF3`
- Texto secundário: `#8B949E`
- Sidebar fundo: `#010409`

**Tipografia:**
- Títulos e corpo: `Sora`
- Dados numéricos, códigos, tabelas: `DM Mono`
- Tamanhos: H1 24px, H2 18px, body 14px, caption 12px

**Componentes base:**
- Botão primário: fundo `#F0A500`, texto preto, border-radius 6px, altura 36px
- Botão destrutivo: fundo `#F85149`, texto branco
- Botão secundário: borda `#30363D`, fundo transparente, texto `#E6EDF3`
- Input: fundo `#0D1117`, borda `#30363D`, foco borda `#F0A500`, border-radius 6px, altura 36px
- Card: fundo `#161B22`, borda `#30363D`, border-radius 8px, padding 20px
- Badge RASCUNHO: fundo `#D29922` 20% opacidade, texto `#D29922`
- Badge CALCULADO: fundo `#388BFD` 20% opacidade, texto `#388BFD`
- Badge ENVIADO: fundo `#3FB950` 20% opacidade, texto `#3FB950`
- Tabela: header fundo `#161B22`, linhas alternadas `#0D1117` / `#161B22`, borda `#30363D`

---

## Layout Global

**Sidebar (240px, fixa, fundo `#010409`):**
- Logo no topo: ícone de caminhão + texto "FAST Frete" em branco bold
- Itens de navegação com ícone + label:
  - 🏠 Dashboard (ativo = texto âmbar + barra lateral âmbar à esquerda)
  - 📦 Pedidos (badge numérico vermelho com contagem de rascunhos)
  - 🧮 Simulação
  - ⚙️ Administração
- Item inativo: texto `#8B949E`, hover fundo `#161B22`

**Área de conteúdo:** fundo `#0D1117`, padding 32px, título da página em H1 no topo

---

## Tela 1 — Dashboard

**Título:** Dashboard

**KPIs (linha de 4 cards):**
- "Total de Pedidos" — número grande em DM Mono, ícone de caixa
- "Rascunhos" — badge âmbar ao lado do número
- "Calculados" — badge azul
- "Enviados" — badge verde

**Botões de ação rápida (linha abaixo dos KPIs):**
- "＋ Novo Pedido" (primário âmbar)
- "📄 Upload de PDF" (secundário)
- "🧮 Simulação Rápida" (secundário)

**Tabela "Pedidos Recentes":**
Colunas: Proposta | Cliente | Destino | Volume m³ | Valor Frete | Status | Criado em
- 5 linhas de exemplo com dados fictícios realistas
- Coluna Status com badges coloridos
- Última coluna com ícone de olho para abrir o pedido
- Rodapé da tabela: "Mostrando 10 de 87 pedidos"

---

## Tela 2 — Detalhe do Pedido

**Título:** Pedido #PRO-2024-0042

**Layout dois painéis (split 50/50):**

**Painel Esquerdo — Dados do Pedido:**
- Header: número da proposta em H2, badge "CALCULADO" azul, data "criado em 24/05/2026"
- Seção "Informações" em card:
  - Cliente: "Carrefour Londrina Norte"
  - Grupo: "Carrefour Brasil"
  - Destino: "Curitiba - PR"
  - Valor da Carga: "R$ 48.500,00"
  - Botão "Editar" pequeno no canto superior direito do card
- Seção "Itens do Pedido" em card:
  - Tabela compacta: Código | Descrição | Qtd | Volume m³
  - 4 linhas de exemplo (ex: GND-001, Gôndola Dupla 1,20m, 3un, 2,16 m³)
  - 1 linha com ícone de alerta âmbar (item não reconhecido)
  - Rodapé: "Volume Total: 8,64 m³" em DM Mono bold
- Botão "Excluir Pedido" destrutivo no rodapé do painel

**Painel Direito — Resultado do Frete:**
- Card principal destacado com borda âmbar:
  - Label "Valor Total do Frete" em caption
  - "R$ 3.247,80" em H1 DM Mono âmbar
  - "NOSTRAVIA · Calculado em 24/05/2026"
- Card "Composição de Veículos":
  - "1 Carreta + 1 Truck · 94 m³ de capacidade"
  - Ícones de veículo ilustrativos
- Card "Detalhamento Financeiro" (tabela):
  - Frete Base | R$ 2.100,00
  - Pedágio | R$ 312,00
  - Ad Valorem | R$ 485,00
  - ICMS (12%) | R$ 350,80
  - **Total | R$ 3.247,80** (linha em bold, fundo levemente diferente)
- Seção colapsável "Alternativas" com 2 linhas de combinações alternativas e seus valores
- Botão "Recalcular" secundário no rodapé

---

## Tela 3 — Simulação de Frete

**Título:** Simulação de Frete

**Layout dois painéis:**

**Painel Esquerdo — Formulário:**
- Input "Cidade Destino" com ícone de lupa e chip de resultado selecionado: "Maringá - PR"
- Input "Valor da Carga (R$)" com valor "R$ 25.000,00"
- Select "Tipo de Veículo": opção "Automático (recomendado)" selecionada
- Seção "Itens da Simulação":
  - Tabela com 3 linhas: Produto (autocomplete) | Qtd | Remover
  - Exemplo: "GND-001 — Gôndola Dupla" | 2 | ícone lixeira
  - Botão "+ Adicionar Item" com ícone de mais, estilo link âmbar
- Botão "Simular Frete" primário âmbar full-width na base do formulário

**Painel Direito — Resultado:**
- Card principal: "R$ 1.890,40" grande, em âmbar
- Card veículos: "1 Truck · 48 m³ de capacidade"
- Tabela de detalhamento igual à Tela 2
- Seção "Alternativas" com 2 opções
- Botão "Criar Pedido com esses itens" secundário

---

## Tela 4 — Lista de Pedidos

**Título:** Pedidos

**Barra de filtros (linha compacta):**
- Input de busca "Buscar por cliente..."
- Chips de status: [Todos ✓] [Rascunho] [Calculado] [Enviado]
- Chip selecionado = fundo âmbar, texto preto

**Tabela completa:**
Colunas: # | Proposta | Cliente | Grupo | Destino | Volume | Valor Frete | Status | Criado em | Ações
- 8 linhas de exemplo com dados variados e todos os 3 status representados
- Coluna Ações: ícone olho + ícone lixeira (vermelho no hover)

**Paginação no rodapé:**
- "Mostrando 1–20 de 87 pedidos"
- Botões: ← Anterior [1] [2] [3] ... [5] Próximo →
- Select: "20 por página"

---

## Tela 5 — Administração

**Título:** Administração

**3 abas horizontais:**
`[Importações]` `[Cidades]` `[Produtos]`
Aba ativa com sublinhado âmbar e texto âmbar.

**Aba Importações (ativa por padrão):**
- Dois cards lado a lado:
  - Card "Importar Tabela de Tarifas": drop zone tracejada com ícone de upload e texto "Arraste um .xlsx ou clique para selecionar", botão "Importar" âmbar
  - Card "Importar Produtos": mesma estrutura
- Tabela "Histórico de Importações" abaixo:
  - Colunas: Data | Tipo | Arquivo | Inseridos | Atualizados | Erros | Status
  - 4 linhas: 2 com status OK (verde), 1 PROCESSANDO (âmbar animado), 1 ERRO (vermelho com ícone de info + tooltip)

**Aba Cidades (mostrar em segundo plano/inativa):**
- Barra: input busca + botão "＋ Nova Cidade" âmbar
- Tabela: Nome | UF | KM | Aceita Carreta | Ativa | Ações
- 5 linhas de exemplo com toggles de ativo/inativo

**Aba Produtos (inativa):**
- Barra: input busca + filtro categoria (chips) + botão "＋ Novo Produto"
- Tabela: Código | Descrição | Categoria | Coef. m³ | Dimensões | Ativo | Ações

---

## Instrução Final

- Todas as telas em resolução **1440×900px**
- Organizar as telas em **pages separadas** no Figma (uma page por tela)
- Usar **Auto Layout** em todos os componentes
- Criar **componentes reutilizáveis** para: Badge, Botão, Input, Card, linha de Tabela, Sidebar, Paginação
- O design deve parecer um **produto SaaS profissional de logística**, não um dashboard genérico
- Nenhum elemento branco sobre branco — manter sempre hierarquia visual clara com os tons escuros