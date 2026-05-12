# Repositório de Novos Recursos e Otimizações

Este documento serve como backlog técnico para futuras implementações visando a melhoria da performance, UX e organização sistêmica do Método Lincoln.

## 1. Sistema de Alinhamento de Nodes (Flow Constructor)
**Objetivo:** Proporcionar uma interface de edição mais organizada e profisisonal, permitindo a limpeza visual rápida de fluxos complexos.

### Especificação Técnica:
- **Lógica de Seleção:** Implementar seleção de intervalo (Range Selection) utilizando a tecla `Shift`. O sistema deve identificar o primeiro node selecionado e o último, selecionando todos os elementos contidos no "caminho" ou lógica sequencial entre eles.
- **Algoritmos de Alinhamento:**
    - **Alinhamento Horizontal:** Normalização do eixo Y para todos os nodes selecionados, baseando-se na coordenada Y do primeiro node da seleção (âncora).
    - **Alinhamento Vertical:** Normalização do eixo X para todos os nodes selecionados, mantendo a consistência na coluna.
- **UX/UI:** Adicionar botões de ação rápida no `Panel` do ReactFlow quando múltiplos nodes estiverem selecionados.

## 2. Gestão Avançada de Blocos (Multi-selection & Batch Actions)
**Objetivo:** Facilitar a manipulação de grandes estruturas de dados dentro do Canvas sem a necessidade de edições individuais.

### Especificação Técnica:
- **Modificadores de Seleção:**
    - `Shift + Click`: Seleção de intervalo (De A até B).
    - `Ctrl/Cmd + Click`: Seleção aditiva/subtrativa (Toggle individual de presença no Set de seleção).
- **Operações em Lote (Batching):**
    - **Translação de Grupo:** Permitir que o arraste de um node arraste todos os nodes selecionados, mantendo as distâncias relativas (Offsets).
    - **Deleção em Massa:** Comando único para remover todos os elementos selecionados e suas respectivas Edges (arestas) conectadas.
- **Persistência:** Garantir que as operações de grupo disparem uma única atualização no Firestore para otimização de escrita e cotas.

## 3. Gestão Inteligente de Áudio (Ambient vs Video)
**Objetivo:** Melhorar a experiência sonora, evitando conflitos entre a música ambiente do projeto e o áudio de vídeos em reprodução.

### Especificação Técnica:
- **Fade de Áudio (Ducking):** Implementar lógica para detectar quando um vídeo inicia a reprodução. O sistema deve aplicar um fade-out (redução gradual de volume ou pausa inteligente) na música ambiente milissegundos antes do áudio do vídeo atingir o pico, e um fade-in gradual para retomar a música quando o vídeo for interrompido ou terminar.
- **Controle Unificado de Volume:** O slider de volume global deve ser sincronizado para controlar tanto a trilha sonora ambiente (audioUrl) quanto o volume dos elementos de vídeo (`<video>`). Atualmente, o controle afeta apenas a música de fundo inserida manualmente.

## 4. Sincronização Granular de Mídias
**Objetivo:** Permitir que o administrador atualize a biblioteca de mídias de um projeto específico sem a necessidade de um escaneamento global, economizando recursos e tempo.

### Especificação Técnica:
- **Botão de Ação por Projeto:** Adicionar um botão "Sincronizar Mídias" na tela de edição de cada projeto (ProjectEditor).
- **Lógica de Escopo:** O comando deve disparar a função `syncStorageWithFirestore` passando especificamente o path da pasta desse projeto (ex: `media/projeto-xyz/`), garantindo que apenas as mídias daquela pasta sejam processadas.
- **Feedback Visual:** Mostrar o progresso e o número de novas imagens detectadas exclusivamente para aquele contexto.

---
*Documento criado em 09/05/2026 como base para o próximo ciclo de desenvolvimento.*
