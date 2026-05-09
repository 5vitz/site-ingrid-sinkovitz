# Documento de Arquitetura Master - Portfólio Ingrid Sinkovitz (Versão 9.0 - Flow Navigation & Design Engine)

## 1. Visão Geral e OKR
Esta versão introduz a navegação bidimensional baseada em fluxo e um motor de customização visual profunda para o Player, permitindo que cada projeto tenha sua própria identidade estética e lógica de navegação.

*   **Objetivo Principal (OKR):** Implementar navegação "Flow-based" (estilo dashboard/experiência 2D) e controle total sobre o aspecto e design do player via painel administrativo.
*   **Status Atual:** ProjectModalFlow operacional com lógica híbrida (Conexões + Estrutura de Blocos).

## 2. Inovações Técnicas (Versão 9.0)
*   **Flow-Based Navigation Engine (`ProjectModalFlow`):** 
    *   **Lógica Relacional (Hierárquica):** Prioridade nas conexões explícitas feitas pelo usuário no Construtor de Flow (Handles Top/Bottom/Left/Right).
    *   **Lógica Estrutural (Blocos):** Fallback automático que identifica "Blocos" (nodes na mesma linha Y). Navegação lateral percorre o carrossel local; navegação vertical (Up/Down) redireciona sempre para o início do bloco adjacente.
*   **Visual Design Engine:** Implementação de motor de estilização via `theme` do projeto, suportando `aspectRatio` variável, `boxShadow` customizado, bordas dinâmicas e `playerMaxHeight`.

## 4. Estado dos Componentes
*   `src/components/ProjectModalFlow.tsx`: (Novo) Componente core de visualização 2D. Gerencia transições de nodes, estados de mídia e navegação via setas/teclado.
*   `src/components/Admin/ProjectManager.tsx`: Evoluído com a aba **Visual & Design** contendo preview em tempo real e controles granulares de CSS.
*   `src/components/Admin/FlowConstructor.tsx`: Refatorado com cabeçalho de design moderno e remoção de redundâncias de interface para foco total na construção.

## 5. Novos Recursos de Navegação
*   **Scroll Inteligente:** O Player agora suporta `overflow-y` com scrollbar minimalista para conteúdos extraídos de PDFs ou mídias longas, mantendo a moldura do design intacta.
*   **Indicadores de Progresso Dinâmicos:** O sistema de "pagination dots" agora reage à lógica de blocos, mostrando apenas o progresso dentro do carrossel atual onde o usuário se encontra.

---
*Assinado: Agente Lincoln - Versão 9.0 "The Flow Navigation & Design Engine Update".*

