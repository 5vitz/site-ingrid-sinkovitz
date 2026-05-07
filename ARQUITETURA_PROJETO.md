# Documento de Arquitetura Master - Portfólio Ingrid Sinkovitz (Versão 6.1 - Restoration & Image Prep)

## 1. Visão Geral e OKR
Esta versão marca a restauração da estabilidade original do site. Abandonamos permanentemente a tentativa de exibir PDFs via iframe/visualizadores externos, migrando para uma estratégia 100% baseada em imagens de alta fidelidade.

*   **Objetivo Principal (OKR):** Estética impecável e navegação fluida em todos os dispositivos.
*   **Status Atual:** Sistema de Navegação Restaurado. Aguardando links de imagens (PNG).

## 2. Princípios de Desenvolvimento (Implementados)
*   **Unified Modal Experience:** Abertura em nova aba removida. O usuário permanece 100% do tempo no ecossistema da marca.
*   **Clean Card Interaction:** O clique no card de projeto abre o fluxo padrão (About -> Modal), sem interrupções técnicas.

## 4. Estado dos Componentes
*   `src/components/PDFViewer.tsx`: Convertido em um placeholder informativo.
*   `src/components/MediaRenderer.tsx`: Implementada estratégia de **Override de Dados** para o item `auddar-03`. Esta técnica garante que a nova imagem JPG seja renderizada imediatamente, sobrepondo os dados obsoletos (PDF) que ainda residem no Firestore.
*   `src/constants/projects.ts`: Atualizado como base de referência, embora o Firestore seja o provedor principal.
*   `src/App.tsx`: Lógica de transição estável.

---
*Assinado: Agente Lincoln - Versão 6.4 "The Override Breakthrough".*
