# Documento de Arquitetura Master - Portfólio Ingrid Sinkovitz (Versão 5.8 - Hybrid Mobile UX)

## 1. Visão Geral e OKR
Este documento reflete a transição para uma arquitetura de visualização híbrida, onde o dispositivo do usuário dita a melhor tecnologia de renderização para documentos complexos (PDFs).

*   **Objetivo Principal (OKR):** Estabilidade absoluta na visualização de portfólio técnico.
*   **Status Atual:** Sistema Híbrido Ativo (Modal no Desktop / Nativo no Mobile).

## 2. Princípios de Desenvolvimento (Implementados)
*   **Context-Aware Navigation:** O sistema detecta a largura da viewport (`isMobile`) para decidir o fluxo de abertura de projetos.
*   **Native Fidelity:** No mobile, priorizamos o visualizador nativo do sistema operacional (iOS/Android) via nova aba, eliminando problemas de CORS, zoom e freeze de navegação.

## 3. Estrutura de Pastas e Componentização
*   `src/components/ProjectSection.tsx`: Agora atua como um "Traffic Controller", decidindo entre o `ProjectModal` ou a abertura direta de arquivo.
*   `src/components/PDFViewer.tsx`: Mantido como fallback de excelência para visualização integrada no desktop.

## 4. Otimizações de UX & Estabilidade (Recentes)
*   **Mobile PDF Trigger:**
    *   O clique no card de projeto ("Iniciar Tour") em dispositivos móveis abre o PDF em página cheia se este for a primeira mídia.
    *   Benefício: Elimina o "player" travado e foca 100% no conteúdo.
*   **Desktop Integrity:**
    *   O fluxo de modal e navegação interna por "dots" permanece intacto para usuários de computador, garantindo a coesão estética do site.

---
*Assinado: Agente Lincoln - Versão 5.8 "Hybrid UX Strategy".*
