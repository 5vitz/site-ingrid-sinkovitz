# Documento de Arquitetura Master - Portfólio Ingrid Sinkovitz (Versão 8.0 - Conflict Resolution & Sandbox Resilience)

## 1. Visão Geral e OKR
Esta versão foca na robustez do sistema de gerenciamento e na estabilidade da aplicação dentro de ambientes restritivos. Implementamos mecanismos de integridade de dados e resolvemos limitações técnicas de interface impostas por sandboxing.

*   **Objetivo Principal (OKR):** Integridade total do banco de dados e UX fluida, livre de falhas de comunicação com o Firestore.
*   **Status Atual:** Sistema de Resolução de Conflitos Operacional. CRUD de Projetos blindado contra erros de sandbox.

## 2. Princípios de Desenvolvimento (Implementados)
*   **Sandbox Resilience:** Eliminação total de diálogos nativos (`confirm()`, `alert()`) em favor de Modais Customizados React, garantindo funcionamento 100% dentro do iframe do AI Studio.
*   **Conflict-Aware UI:** A interface administrativa agora detecta e sinaliza visualmente quando dois projetos ocupam o mesmo Slot ("Bolhas Amarelas" de conflito).
*   **Proactive Error Handling:** Implementação de logging detalhado e erro estruturado no `dataService` seguindo o padrão `FirestoreErrorInfo`.

## 4. Estado dos Componentes
*   `src/components/Admin/ProjectManager.tsx`: Atualizado com **Conflict Resolver** (reordenação automática 1..N) e **Delete Confirmation Modal** customizado.
*   `src/components/Admin/FlowConstructor.tsx`: Estabilizado com suporte a zoom profundo e navegação complexa de nodes.
*   `src/services/dataService.ts`: Refatorado para operações assíncronas robustas com tratamento de erros centralizado.

## 5. Sistema de Gerenciamento de Projetos (Slots & Integridade)
Aprimoramos a lógica de organização para garantir que o site nunca exiba estados inconsistentes.

*   **Lógica de Slots & Resolução:**
    *   **Auto-Reordering:** Botão "Resolver Conflitos" que reorganiza toda a base de dados sequencialmente, eliminando slots duplicados ou "órfãos".
    *   **Visual Counter:** Indicação visual numérica (1..N) independente do slot lógico, para facilitar a conferência rápida do total de projetos ativos.
    *   **Safety Lock:** Lógica que mantém projetos existentes protegidos mesmo durante testes de novos slots (Cobaia), apenas empurrando-os na fila sem sobrescrever dados acidentalmente.

*   **Integridade de Dados (Firestore):**
    *   **Rules Hardening:** Regras de segurança validadas para acesso administrativo estrito.
    *   **Sync Logic:** Uso de `onSnapshot` com ordenação local garantida, assegurando que mudanças no Admin reflitam instantaneamente na Galeria pública.

---
*Assinado: Agente Lincoln - Versão 8.0 "The Conflict Resolution & Sandbox Resilience Update".*

