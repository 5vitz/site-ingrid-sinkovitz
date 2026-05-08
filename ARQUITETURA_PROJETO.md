# Documento de Arquitetura Master - Portfólio Ingrid Sinkovitz (Versão 7.0 - Project Slots & Flow Engine)

## 1. Visão Geral e OKR
Esta versão consolida o sistema de gerenciamento de conteúdo dinâmico. Migramos de dados estáticos para um sistema de controle total via Painel Admin, focado em organização espacial (Slots) e narrativa visual (Flow Constructor).

*   **Objetivo Principal (OKR):** Autonomia total na criação de projetos complexos com navegação não-linear.
*   **Status Atual:** Sistema de Slots Operacional. Engine de Fluxo habilitada com suporte a conexões híbridas.

## 2. Princípios de Desenvolvimento (Implementados)
*   **Unified Modal Experience:** Abertura em nova aba removida. O usuário permanece 100% do tempo no ecossistema da marca.
*   **Clean Card Interaction:** O clique no card de projeto abre o fluxo padrão (About -> Modal), sem interrupções técnicas.

## 4. Estado dos Componentes
*   `src/components/Admin/ProjectManager.tsx`: Implementada ordenação por Slots e sistema de reordenação.
*   `src/components/Admin/FlowConstructor.tsx`: Versão 2.0 da Engine. Nodes compactos, zoom estendido e suporte a navegação vertical.
*   `src/components/Admin/MediaLibrary.tsx`: Navegação aprimorada com botão de retorno contextual.

## 5. Sistema de Gerenciamento de Projetos (Slots & Flow)
Implementamos uma lógica de organização baseada em **Slots** e um **Construtor de Fluxo Visual** customizado.

*   **Lógica de Slots (Posicionamento):**
    *   Cada projeto possui um campo `order` (Slot) que define sua posição na galeria principal.
    *   Novos projetos buscam automaticamente o primeiro Slot vazio para evitar sobreposição acidental.
    *   O Admin permite a troca manual de slots entre projetos existentes via interface "Drag/Order Up/Down".
    *   Projetos "Em Construção" (como Scalla Records) reservam Slots específicos (ex: Slot 6) para uso futuro.

*   **Construtor de Fluxo (Flow Engine):**
    *   **Navegação Híbrida:** Suporte total a conexões transversais (Horizontais e Verticais). Nodes possuem 4 pontos de ancoragem (Top, Bottom, Left, Right).
    *   **Escalabilidade Visual:** Cards compactos (w-56) e sistema de zoom profundo (min: 0.05x) para permitir a criação de fluxos complexos (30+ cards) como o da Metavix.
    *   **Edição Intuitiva:** Exclusão de conexões (Edges) via botão dedicado "×" no centro de cada linha de fluxo amarela.
    *   **Integração com Biblioteca:** Fluxo de navegação bidirecional entre o Construtor e a Biblioteca de Mídia, permitindo retorno imediato ("Voltar ao Fluxo") sem perda de contexto.

---
*Assinado: Agente Lincoln - Versão 7.0 "The Slot & Flow Mastery".*
