# Princípios de UI para o KRATOS

Este documento resume os princípios de design de interface que guiam o desenvolvimento do frontend do KRATOS, baseados nas especificações do Kimi e ajustados para neurocompatibilidade e foco operacional.

## 1. Foco na Missão
O KRATOS é um cockpit de missão.  A principal informação — missão atual, próxima ação e risco principal — deve estar sempre visível e em destaque.  Nunca esconda a missão em menus profundos.

## 2. Legibilidade e Hierarquia
Use tipografia clara com variações de peso e tamanho para estabelecer hierarquia.  Evite usar fontes diferentes sem necessidade.  Os títulos, subtítulos e labels devem sempre contrastar com o fundo.

## 3. Glassmorphism Funcional
Painéis translúcidos são usados para separar conteúdo sem criar caixas opacas.  Utilize sombras suaves e bordas claras definidas pelos tokens.  Não abuse de blur; priorize legibilidade.

## 4. Microinterações Delicadas
Animações de flutuação, pulsação ou drift devem ser lentas e discretas.  Sempre respeite `prefers-reduced-motion` para reduzir ou remover animações quando solicitado pelo usuário.

## 5. Respostas Imediatas
O cockpit deve responder rapidamente às interações.  Use skeletons ou estados vazios (EmptyState) para carregar dados, mas evite longos loaders sem contexto.  Sempre mostre a origem dos dados (live, cached, fallback, mock).

## 6. Modularidade
Quebre funcionalidades complexas em componentes pequenos e reutilizáveis.  Por exemplo, `StatusChip` pode aparecer em vários lugares do HUD.  Não duplique código; reutilize primitives e utilitários.

## 7. Neurocompatibilidade
Pessoas com TDAH ou hiperfoco podem se beneficiar de uma interface que reduz ruídos e destaca a próxima ação.  Limite as interrupções visuais e organize o cockpit para que o usuário sempre consiga retornar ao que importa.

## 8. Progressive Disclosure
Mostrar apenas o necessário em primeiro plano, com informações detalhadas disponíveis sob demanda.  O `RightRail` e as páginas internas das ilhas seguem esse modelo: visão geral primeiro, detalhes depois.

## 9. Feedback Claro
Indique estados de carregamento, sucesso, erro e vazio com componentes dedicados (`LoadingSkeleton`, `EmptyState`, `ErrorState`).  Não deixe o usuário sem feedback.

## 10. Coerência com a Stack
Todos os componentes e tokens aqui definidos devem ser implementados com **React**, **Vite**, **TypeScript** e **Tailwind**.  Siga as convenções de pasta (`src/components`, `src/pages`, `src/styles`) e use as ferramentas existentes (`cn`, `useLiveKratos`).