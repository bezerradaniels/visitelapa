# Visite Lapa — Guia de Desenvolvimento

> Documento vivo. Atualizar após cada etapa concluída.
> Última atualização: 2026-04-04

---

## Visão Geral

Plataforma de guia local para **Bom Jesus da Lapa, BA**.
Cobre 6 domínios: `negocios`, `hoteis`, `restaurantes`, `turismo`, `eventos`, `blog`.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS

---

## Arquitetura

```
UI (paginas + componentes)
        ↓
Camada de Serviços (servicos/)
        ↓
Camada de Dados (dados/ → futuro: Supabase)
```

A separação existe para que a migração para banco de dados real altere **apenas** a camada de serviços, sem tocar na UI.

---

## Estrutura de Pastas

```
src/
  app/
    [dominio]/
      page.tsx              ← shell de roteamento (só importa de paginas/)
      [slug]/
        page.tsx            ← resolve params (Promise) e delega para paginas/

  paginas/
    [dominio]/
      index.tsx             ← UI da listagem
      [slug]/
        index.tsx           ← UI do detalhe

  componentes/
    cards/
      card-listagem/        ← card genérico de listagem
    filtros/
      barra-filtros/        ← barra de filtros interativa
    layouts/
      layout-detalhe/       ← layout compartilhado das páginas de detalhe
    listagem/
      grade-cards/          ← grid wrapper dos cards
    secoes/
      hero/                 ← hero da home
      hero-listagem/        ← hero das páginas de listagem
      atalhos-portal/       ← atalhos da home
      destaques-home/       ← seção de destaques da home
      eventos-home/         ← seção de eventos da home
      blog-home/            ← seção do blog da home
      hoteis-home/          ← seção de hotéis da home
      negocios-home/        ← seção de negócios da home
      restaurantes-home/    ← seção de restaurantes da home
      turismo-home/         ← seção de turismo da home
    ui/
      botao/
      container/
      social-buttons/
    header/
    footer/

  dados/
    negocios.ts             ← tipo Negocio + filtrosNegocios + negocios[]
    hoteis.ts               ← tipo Hotel + filtrosHoteis + hoteis[]
    restaurantes.ts         ← tipo Restaurante + filtrosRestaurantes + restaurantes[]
    turismo.ts              ← tipo RoteiroTuristico + filtrosTurismo + roteirosTuristicos[]
    eventos.ts              ← tipo Evento + filtrosEventos + eventos[]
    blog.ts                 ← tipo PostBlog + filtrosBlog + postsBlog[]

  servicos/
    negocios.ts             ← listarNegocios, buscarNegocioPorSlug, listarFiltrosNegocios
    hoteis.ts               ← listarHoteis, buscarHotelPorSlug, listarFiltrosHoteis
    restaurantes.ts         ← listarRestaurantes, buscarRestaurantePorSlug, listarFiltrosRestaurantes
    turismo.ts              ← listarTurismo, buscarTurismoPorSlug, listarFiltrosTurismo
    eventos.ts              ← listarEventos, buscarEventoPorSlug, listarFiltrosEventos
    blog.ts                 ← listarBlog, buscarPostPorSlug, listarFiltrosBlog
```

---

## Regras da Arquitetura

1. `paginas/` nunca importa de `dados/` diretamente — sempre via `servicos/`
2. `app/` é apenas roteamento — zero lógica de UI
3. `params` em `app/[slug]/page.tsx` é uma `Promise` — sempre usar `await`
4. `slug` é a chave primária de todos os itens
5. Domínios são isolados — sem importações cruzadas

---

## Campos Comuns a Todos os Domínios

| Campo | Tipo | Uso |
|---|---|---|
| `slug` | `string` | Chave primária / rota |
| `categoria` | `string` | Tag do card + filtro |
| `titulo` | `string` | Título do card e da página |
| `descricao` | `string` | Subtítulo do card e do hero |
| `imagem` | `string` | Hero da página de detalhe |
| `whatsapp` | `string` | Botão social |
| `instagram` | `string` | Botão social |
| `contato` | `string` | Aside da página de detalhe |
| `sobre` | `string[]` | Parágrafos do corpo |
| `destaqueListagem` | `string` | Badge direito do card |

---

## Estado Atual dos Componentes

### BarraFiltros (`componentes/filtros/barra-filtros/index.tsx`)
- Recebe `filtros: { label: string; ativo?: boolean }[]`
- Recebe callback opcional `onFiltroClick`
- Já está interativa e controla o filtro ativo via `ListagemFiltrada`

### ListagemFiltrada (`componentes/listagem/listagem-filtrada/index.tsx`)
- Componente client-side reutilizado pelas 6 listagens
- Responsável por:
  - filtro por categoria
  - busca por texto
  - paginação
  - estado inicial vindo de `?filtro=` via `useSearchParams`
- O reset de paginação acontece nos handlers de interação, sem `useEffect`

### CampoBusca (`componentes/ui/campo-busca/index.tsx`)
- Input reutilizável de busca textual
- Filtra `titulo` e `descricao`

### Paginacao (`componentes/listagem/paginacao/index.tsx`)
- Navegação entre páginas
- É renderizada apenas quando há mais de uma página

### Hero + Busca IA (`componentes/secoes/hero/*`)
- Busca por linguagem natural já integrada
- Chama `POST /api/busca-ia`
- A IA escolhe domínio + filtro e redireciona para a listagem correta

### Seções da Home (`componentes/secoes/*-home`)
- Agora usam a camada de serviços
- Não mantêm mais listas estáticas desconectadas dos dados reais
- Isso evita links quebrados na home

---

## Histórico de Etapas

### ✅ Etapa 1 — Estrutura inicial
- Projeto criado com `create-next-app`
- Definição de tipos TypeScript para todos os 6 domínios
- Dados mock criados em `dados/`
- Componentes base criados: `LayoutDetalhe`, `HeroListagem`, `BarraFiltros`, `GradeCards`, `CardListagem`
- Páginas de listagem e detalhe criadas para todos os domínios
- Roteamento configurado com `app/`

### ✅ Etapa 2 — Camada de serviços
- Criados 6 arquivos em `src/servicos/` (um por domínio)
- Cada serviço expõe: `listar[Dominio]()`, `buscar[Dominio]PorSlug(slug)`, `listarFiltros[Dominio]()`
- Todas as páginas em `paginas/` consomem dados via `servicos/`

### ✅ Etapa 3 — Interatividade das listagens
- `ListagemFiltrada` criada e aplicada nas 6 listagens
- `BarraFiltros` integrada com estado real
- `CampoBusca` implementado
- Mensagem de vazio implementada
- `Paginacao` implementada

### ✅ Etapa 4 — Busca IA na home
- Hook `useBuscaIA` implementado
- Rota `src/app/api/busca-ia/route.ts` criada
- Redirecionamento por domínio já funciona

### ✅ Etapa 5 — Correções de consistência (2026-04-04)
- Filtros normalizados com base nas categorias reais dos itens
- `?filtro=` agora inicializa corretamente a listagem
- Home sincronizada com a camada de serviços
- Logs sensíveis/diagnósticos excessivos removidos da rota de IA
- Lint corrigido na paginação/reset da listagem

---

## Próximas Etapas

### ✅ Etapa 6 — Expansão dos dados mock (2026-04-04)
- Cada um dos 6 domínios agora possui 8 itens mockados
- A home continua puxando os 3 primeiros itens reais de cada domínio
- Os itens antes ausentes nas vitrines da home agora existem nas páginas de detalhe
- O volume atual já permite validar filtros, busca e paginação com mais confiança

### ✅ Etapa 7 — Página de Contato (2026-04-04)

**Objetivo:** criar a página pública de contato do portal.

**Micro-tarefas:**
- Criar `src/app/contato/page.tsx` como shell de roteamento
- Criar `src/paginas/contato/index.tsx` com a UI principal
- Definir estrutura da página:
  - hero simples da página
  - bloco com texto institucional
  - bloco com canais de contato
  - formulário visual de contato
- Criar componentes reutilizáveis se necessário:
  - `src/componentes/contato/formulario-contato/index.tsx`
  - `src/componentes/contato/informacoes-contato/index.tsx`
- Definir campos do formulário:
  - nome
  - email
  - telefone
  - assunto
  - mensagem
- Adicionar estado client-side e validação básica
- Exibir feedback visual de envio
- Nesta etapa, o envio pode ser mockado/local até existir backend real

### ✅ Etapa 8 — Página de Login (2026-04-04)

**Objetivo:** criar a página de acesso para a futura área administrativa.

**Micro-tarefas:**
- Criar `src/app/login/page.tsx`
- Criar `src/paginas/login/index.tsx`
- Definir layout da página:
  - card central de autenticação
  - título, subtítulo e branding do portal
  - formulário com email e senha
- Criar componente reutilizável se fizer sentido:
  - `src/componentes/auth/card-login/index.tsx`
- Adicionar estado do formulário
- Adicionar validação básica
- Adicionar estado de loading no botão
- Definir comportamento inicial:
  - nesta fase pode ser apenas UI/fluxo visual
  - depois será conectado à autenticação real

### ✅ Etapa 9 — Sistema de Ícones com Hugeicons (2026-04-04)

**Objetivo:** padronizar todos os ícones do projeto com Hugeicons em React antes da expansão das interfaces públicas e administrativas.

**Referência oficial:**
- Hugeicons React Quick Start:
  - https://hugeicons.com/docs/integrations/react/quick-start

**Micro-tarefas:**
- Instalar os pacotes recomendados pela documentação:
  - `@hugeicons/react`
  - `@hugeicons/core-free-icons`
- Criar um ponto de uso padronizado para ícones no projeto
- Definir convenções de uso:
  - tamanho padrão
  - cor padrão
  - `strokeWidth` padrão
  - uso de `currentColor`
- Substituir progressivamente ícones inline/SVGs manuais nos componentes existentes
- Usar Hugeicons em todas as novas etapas:
  - contato
  - login
  - dashboard
  - cadastros públicos
  - páginas de edição
- Avaliar se vale criar um wrapper interno para manter consistência visual em todo o projeto

### ✅ Etapa 10 — Base Estrutural do Dashboard (2026-04-04)

**Objetivo:** criar a estrutura visual e navegável da área administrativa.

**Micro-tarefas:**
- Criar `src/app/dashboard/layout.tsx`
- Criar `src/app/dashboard/page.tsx`
- Criar `src/paginas/dashboard/index.tsx`
- Criar os componentes-base do dashboard:
  - `src/componentes/dashboard/sidebar/index.tsx`
  - `src/componentes/dashboard/container-conteudo/index.tsx`
  - `src/componentes/dashboard/cards-estatisticas/index.tsx`
- Definir navegação principal da sidebar:
  - Dashboard
  - Páginas
  - Conteúdos
  - Pacotes
  - Eventos
  - Hotéis
  - Negócios
  - Restaurantes
  - Turismo
  - Categorias
  - Tags
  - Cidades
  - Bairros
  - Contatos
- Criar cabeçalho interno do dashboard
- Criar área principal com:
  - título da seção
  - descrição
  - grid de cards de estatísticas
- Criar versão responsiva mínima para sidebar + conteúdo

### ✅ Etapa 11 — Sistema de Campos Reutilizáveis (2026-04-04)

**Objetivo:** criar uma base única de formulários para todos os cadastros e edições do dashboard.

**Micro-tarefas:**
- Criar a pasta base dos campos reutilizáveis:
  - `src/componentes/dashboard/fields/`
- Criar os campos base reutilizáveis:
  - `campo-texto`
  - `campo-textarea`
  - `campo-select`
  - `campo-checkbox`
  - `campo-switch`
  - `campo-data`
  - `campo-intervalo-data`
  - `campo-moeda`
  - `campo-numero`
  - `campo-tags`
- Criar um padrão de props compartilhadas para os campos:
  - `label`
  - `name`
  - `value`
  - `placeholder`
  - `descricao`
  - `erro`
  - `obrigatorio`
- Criar um wrapper visual reutilizável de campo:
  - `src/componentes/dashboard/fields/field-wrapper/index.tsx`
- Criar um padrão para grupos de campos:
  - `src/componentes/dashboard/form-grupo/index.tsx`
- Definir os campos base comuns para todos os cadastros:
  - título
  - slug
  - categoria
  - descrição curta
  - imagem
  - nome de contato
  - email de contato
  - whatsapp
  - instagram
  - conteúdo/sobre
  - destaque de listagem
- Definir regras de contato válidas para todos os cadastros públicos:
  - o responsável pelo cadastro sempre informa nome, email, whatsapp e instagram
  - esses dados serão usados para validação, comunicação e futuras solicitações de alteração
- Criar suporte a status editorial/publicação:
  - rascunho
  - pendente_aprovacao
  - publicado
  - rejeitado
  - arquivado

### ✅ Etapa 12 — Blocos Reutilizáveis de Informação (2026-04-04)

**Objetivo:** criar blocos reutilizáveis para montar páginas individuais e telas de visualização/edição sem repetir estrutura.

**Micro-tarefas:**
- Criar a pasta de blocos reutilizáveis:
  - `src/componentes/dashboard/blocos-info/`
- Criar blocos base:
  - `bloco-resumo`
  - `bloco-contato`
  - `bloco-localizacao`
  - `bloco-periodo`
  - `bloco-valores`
  - `bloco-destaques`
  - `bloco-lista-informacoes`
  - `bloco-midia`
- Definir um padrão de composição para páginas individuais:
  - cabeçalho da entidade
  - blocos laterais de resumo
  - blocos principais de conteúdo
  - ações no topo
- Criar um bloco reutilizável de ação para páginas públicas:
  - `bloco-solicitar-alteracao`
- Esse bloco deve exibir CTA para solicitar mudança via WhatsApp
- Reaproveitar esses blocos nas páginas de detalhe do dashboard e, quando fizer sentido, também nas páginas públicas

### ✅ Etapa 13 — Páginas Base do Dashboard (2026-04-04)

**Objetivo:** criar todas as páginas estruturais do admin antes de conectar dados reais.

**Micro-tarefas:**
- Criar rota e página inicial para cada módulo:
  - `src/app/dashboard/paginas/page.tsx`
  - `src/app/dashboard/conteudos/page.tsx`
  - `src/app/dashboard/categorias/page.tsx`
  - `src/app/dashboard/tags/page.tsx`
  - `src/app/dashboard/cidades/page.tsx`
  - `src/app/dashboard/bairros/page.tsx`
  - `src/app/dashboard/contatos/page.tsx`
- Criar páginas equivalentes em `src/paginas/dashboard/...`
- Definir padrão visual único para módulos administrativos:
  - cabeçalho da seção
  - botão de ação principal
  - filtros ou busca
  - tabela/listagem
  - estado vazio
- Criar componentes reutilizáveis se necessário:
  - `src/componentes/dashboard/cabecalho-secao/index.tsx`
  - `src/componentes/dashboard/tabela-admin/index.tsx`
  - `src/componentes/dashboard/estado-vazio/index.tsx`

### ✅ Etapa 14 — Páginas de Cadastro por Domínio (2026-04-04)

**Objetivo:** criar as telas de cadastro das entidades principais do portal com base nos campos reutilizáveis.

**Micro-tarefas:**
- Criar rotas públicas de cadastro:
  - `src/app/cadastro/pacotes/page.tsx`
  - `src/app/cadastro/eventos/page.tsx`
  - `src/app/cadastro/hoteis/page.tsx`
  - `src/app/cadastro/negocios/page.tsx`
  - `src/app/cadastro/restaurantes/page.tsx`
  - `src/app/cadastro/turismo/page.tsx`
- Criar páginas equivalentes em `src/paginas/cadastro/.../index.tsx`
- Criar também a entrada administrativa correspondente para revisão/edição futura no dashboard
- Criar um layout padrão de cadastro:
  - cabeçalho da tela
  - formulário principal
  - sidebar ou bloco-resumo
  - ações de salvar/cancelar
- Criar um builder ou composição de seções de formulário com blocos reutilizáveis
- Definir claramente:
  - campos comuns
  - campos exclusivos por tipo de cadastro
- Definir o fluxo de publicação:
  - os formulários de cadastro são públicos
  - a submissão pública nunca publica diretamente
  - toda solicitação entra com status `pendente_aprovacao`
  - somente administradores podem aprovar a publicação no dashboard
- Preparar estados e mensagens do fluxo público:
  - cadastro enviado com sucesso
  - cadastro pendente de aprovação
  - cadastro recusado ou precisa de ajustes
- Definir regra de visibilidade:
  - apenas itens com status `publicado` podem aparecer publicamente

**Campos exclusivos por cadastro:**
- `Pacotes`
  - data de ida
  - data de retorno
  - local de saída
  - destino
  - valor à vista
  - valor parcelado
  - quantidade de parcelas
- `Eventos`
  - data do evento com suporte a:
    - um único dia
    - intervalo de datas
  - valor do ingresso ou evento gratuito
  - local do evento
- `Hotéis`
  - check-in
  - check-out
- `Restaurantes`
  - tipo de comida
- `Negócios`
  - empresa ou prestador de serviço
  - nome de usuário público para URL curta
  - formato do username:
    - máximo de 20 caracteres
    - apenas letras, números e underscore
  - validações obrigatórias:
    - verificar nome já existente
    - verificar nome proibido/reservado
  - objetivo da URL:
    - `visitelapa.com.br/nomedaempresa`
- `Turismo`
  - pode reutilizar campos base já existentes e ser refinado depois conforme a necessidade do produto

**Nomes proibidos/reservados para username de negócios:**
- `admin`
- `dashboard`
- `login`
- `contato`
- `cadastro`
- `api`
- `blog`
- `eventos`
- `hoteis`
- `negocios`
- `restaurantes`
- `turismo`
- `cidades`
- `bairros`
- `categorias`
- `tags`

**Observação importante de modelagem:**
- o `slug` editorial da entidade e o `username` público do negócio devem ser tratados como campos distintos
- o `username` é voltado para URL curta e validação comercial
- o `slug` continua útil para estrutura interna, compatibilidade e rotas administrativas

### ✅ Etapa 15 — Páginas de Edição do Dashboard (2026-04-04)

**Objetivo:** preparar a edição visual das entidades do sistema.

**Micro-tarefas:**
- Criar o padrão de rotas de edição:
  - `src/app/dashboard/paginas/[slug]/page.tsx`
  - `src/app/dashboard/conteudos/[slug]/page.tsx`
  - `src/app/dashboard/pacotes/[slug]/page.tsx`
  - `src/app/dashboard/eventos/[slug]/page.tsx`
  - `src/app/dashboard/hoteis/[slug]/page.tsx`
  - `src/app/dashboard/negocios/[slug]/page.tsx`
  - `src/app/dashboard/restaurantes/[slug]/page.tsx`
  - `src/app/dashboard/turismo/[slug]/page.tsx`
  - `src/app/dashboard/categorias/[slug]/page.tsx`
  - `src/app/dashboard/tags/[slug]/page.tsx`
  - `src/app/dashboard/cidades/[slug]/page.tsx`
  - `src/app/dashboard/bairros/[slug]/page.tsx`
- Criar páginas equivalentes em `src/paginas/dashboard/.../[slug]/index.tsx`
- Definir um layout padrão de edição com:
  - título
  - descrição
  - formulário principal
  - ações de salvar/cancelar
- Criar componentes reutilizáveis:
  - `src/componentes/dashboard/layout-edicao/index.tsx`
  - `src/componentes/dashboard/formulario-admin/index.tsx`
- Reutilizar os campos e blocos criados nas etapas anteriores
- Definir os campos-base e os campos exclusivos por módulo
- Criar interface de aprovação administrativa:
  - aprovar publicação
  - reprovar publicação
  - arquivar solicitação
- Exibir status editorial em todas as telas de edição
- Criar dados mock temporários para edição visual

### ✅ Etapa 16 — Cadastro, Edição e Gerenciamento do Blog (2026-04-04)

**Objetivo:** definir e implementar a melhor forma de gerenciar o blog do portal.

**Avaliação recomendada:**
- **Recomendação principal neste projeto:** gerenciar o blog via código no próprio dashboard do Visite Lapa
- **Motivo:** o projeto já está sendo estruturado com App Router, camadas próprias de serviço, domínio unificado e futuras regras de publicação/aprovação
- **WordPress só passa a valer mais a pena** se houver necessidade forte de:
  - equipe editorial não técnica usando editor visual com frequência
  - fluxos editoriais muito ricos e multiusuário
  - plugins prontos de SEO, revisão, mídia e publicação como prioridade central do produto
  - separação completa entre portal institucional/comercial e operação editorial

**Conclusão atual:**
- No estágio atual, o mais coerente é manter o blog dentro do próprio produto, com dashboard próprio
- Isso reduz complexidade, evita duplicação de autenticação, evita sincronização entre sistemas e mantém consistência com categorias, tags, cidades e futuras regras editoriais
- WordPress pode ser reavaliado mais tarde como plano B ou CMS externo/headless, mas não é a recomendação principal agora

**Referência WordPress para futura integração/headless, se necessário:**
- REST API Handbook:
  - https://developer.wordpress.org/rest-api/
- REST API Overview:
  - https://developer.wordpress.org/plugins/rest-api/rest-api-overview/

**Micro-tarefas:**
- Criar módulo de blog no dashboard com listagem administrativa
- Criar tela de novo post
- Criar tela de edição de post
- Criar campos reutilizáveis específicos do blog:
  - título
  - slug
  - resumo
  - categoria
  - tags
  - imagem de capa
  - conteúdo
  - autor
  - status editorial
  - destaque de listagem
  - SEO básico
- Definir blocos reutilizáveis para o conteúdo do blog:
  - introdução
  - seções com título
  - fechamento
  - metadados do post
- Definir fluxo editorial:
  - rascunho
  - revisão
  - publicado
  - arquivado
- Reaproveitar categorias e tags quando possível
- Avaliar no futuro um editor mais avançado apenas se a necessidade editorial crescer

### ✅ Etapa 17 — Módulo de Contatos no Dashboard (2026-04-04)

**Objetivo:** preparar a gestão dos contatos recebidos pelo portal.

**Micro-tarefas:**
- Definir estrutura do item de contato
- Criar listagem administrativa de contatos
- Criar visualização de detalhe do contato
- Definir estados:
  - novo
  - lido
  - respondido
  - arquivado
- Adicionar filtros por status
- Adicionar busca por nome, email ou assunto
- Preparar ações futuras:
  - marcar como lido
  - arquivar
  - responder

### ✅ Etapa 18 — Solicitação de Alteração nas Páginas Públicas (2026-04-04)

**Objetivo:** permitir que donos ou responsáveis solicitem alterações em páginas individuais via WhatsApp.

**Micro-tarefas:**
- Adicionar CTA reutilizável de `Solicitar alteração` em cada página individual pública
- Definir texto padrão da mensagem de WhatsApp com:
  - nome do item
  - tipo do item
  - link da página
  - instrução para informar a alteração desejada
- Criar o componente reutilizável:
  - `src/componentes/ui/solicitar-alteracao/index.tsx`
- Inserir esse componente nas páginas individuais de:
  - eventos
  - hoteis
  - negocios
  - restaurantes
  - turismo
- Avaliar depois se blog também deve ter esse CTA
- Garantir que o CTA use número/configuração centralizada do portal

### 🔲 Etapa 19 — Curadoria de conteúdo e mídia

**Objetivo:** substituir o mock mais genérico por conteúdo editorial e comercial mais próximo da operação real.

**Itens prováveis:**
- 2026-04-04:
  - Conteúdos mock públicos removidos da camada `dados/`
  - Dashboard administrativo sem registros fictícios
  - Home ajustada para ocultar seções sem conteúdo publicado
  - Heróis de listagem trocados para assets internos do projeto
- Revisão de textos por domínio
- Definição de critérios de destaque por item
- Curadoria de imagens mais consistentes por categoria
- Ajustes finos de títulos, descrições e badges

### 🔲 Etapa 20 — Polimento de produção

**Objetivo:** preparar o portal para uso real.

**Itens prováveis:**
- 2026-04-04:
  - Estados vazios revisados para módulos sem conteúdo
  - Textos temporários mais genéricos no dashboard
- SEO por página
- metadata dinâmica
- tratamento de erros mais refinado
- analytics
- revisão de acessibilidade
- otimização de imagens

### ✅ Etapa 21 — Migração para Supabase (2026-04-04)

**Objetivo:** consolidar o banco apenas depois que a estrutura de produto, formulários, aprovações, blog e módulos administrativos estiverem estabilizados.

**Direção técnica:**
- O Supabase entra por último para evitar retrabalho de modelagem
- As tabelas devem refletir a estrutura final consolidada do produto
- A UI não deve mudar nesta etapa; a troca deve acontecer principalmente em `servicos/`

**Micro-tarefas:**
- Revisar todas as entidades e relacionamentos finais antes de criar tabelas
- Consolidar status editoriais, fluxos de aprovação e ownership dos cadastros públicos
- Definir tabelas para:
  - conteúdos principais
  - contatos
  - categorias
  - tags
  - cidades
  - bairros
  - blog
  - solicitações públicas pendentes
  - solicitações de alteração
- Instalar e configurar cliente Supabase
- Criar `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Criar `src/lib/supabase.ts`
- Migrar cada `servico/[dominio].ts`
- Validar listagem, detalhe, filtros, busca IA, blog, dashboard e fluxo de aprovação após a migração

---

## Referência Rápida — Padrão Atual de um Domínio

### `dados/[dominio].ts`
```ts
export type Entidade = { slug: string; categoria: string; ... };
export const itens: Entidade[] = [...];
```

### `servicos/[dominio].ts`
```ts
import { itens } from "@/dados/[dominio]";

export function listar[Dominio]() {
  return itens;
}

export function buscar[Dominio]PorSlug(slug: string) {
  return itens.find((item) => item.slug === slug);
}

export function listarFiltros[Dominio]() {
  return [
    { label: "Todos" },
    ...Array.from(new Set(itens.map((item) => item.categoria))).map((label) => ({
      label,
    })),
  ];
}
```

### `paginas/[dominio]/index.tsx`
```tsx
export default function [Dominio]Pagina() {
  return (
    <div className="bg-gray-50">
      <HeroListagem titulo="..." subtitulo="..." imagem="..." />
      <ListagemFiltrada
        filtros={listarFiltros[Dominio]()}
        itens={listar[Dominio]()}
        baseHref="/[dominio]"
      />
    </div>
  );
}
```

### `app/[dominio]/page.tsx`
```tsx
import [Dominio]Pagina from "@/paginas/[dominio]";

export default function Page() {
  return <[Dominio]Pagina />;
}
```

### `app/[dominio]/[slug]/page.tsx`
```tsx
type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <[Dominio]DetalhePagina params={{ slug }} />;
}
```
