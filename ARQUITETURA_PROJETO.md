# Documento de Arquitetura Master - Portfólio Ingrid Sinkovitz (Versão 3.0 - Planejamento Estratégico)

## 1. Visão Geral e OKR
Este documento é a "Fonte da Verdade" do projeto. A evolução atual foca em transformar o site em uma plataforma **Data-Driven** e **Modular**.

*   **Objetivo Principal (OKR):** Dar ao usuário liberdade total de criação e facilidade extrema de uso através de uma interface humanizada.
*   **Meta Técnica:** Zero dados "hardcoded". Cada string, imagem, cor ou configuração de layout deve residir no banco de dados (Firestore).

## 2. Princípios de Desenvolvimento
*   **Modularidade Radical:** Cada seção (Sobre Mim, Projetos, etc.) é um módulo independente. Operacionalmente, deve ser simples conectar ou desconectar módulos sem afetar o funcionamento global do app.
*   **Independência de Dados:** Separação estrita entre a **estrutura** (o que o componente pode fazer) e os **dados** (o conteúdo em si).
*   **Interface Humanizada:** O Painel de Controle não deve apenas editar dados, mas traduzir propriedades técnicas para uma linguagem amigável e intuitiva para a usuária.

## 3. Estratégia de Configuração Dinâmica (JSON Template)
Para evitar fragmentação, utilizaremos um modelo de **Template JSON** para layouts e propriedades:
*   **JSON no Firestore:** Armazenar estruturas de dados que definem o comportamento visual.
*   **Mapeamento Dinâmico:** As propriedades relevantes de configuração (ex: padding, cores de acento, tipos de grade) são elencadas no JSON e automaticamente disponibilizadas no Painel de Controle.
*   **Viabilidade de Script:** Desenvolvimento de scripts de "carga de estrutura" que gravam essas definições no banco de dados em paralelo ao desenvolvimento do site, permitindo testes sem afetar a produção.

## 4. Planejamento de Demandas (Roadmap Modular)

### 4.1. Módulo: Configurações Globais (Site Settings)
*   **Demanda:** Centralizar tudo que rege o visual geral.
*   **Propriedades:** Logo, ícone social, cores mestres, tipografia, SEO.
*   **Integração:** O Painel de Controle deve permitir a alteração dessas constantes globais sem tocar no código.

### 4.2. Módulo: Seções Adaptativas (Component Builder)
*   **Demanda:** Transformar seções estáticas em componentes que leem sua própria estrutura do Firestore.
*   **Propriedades:** Ordem das seções, visibilidade (toggle on/off), títulos de cabeçalho.

### 4.3. Módulo: Construtor de Fluxo Visual (Visual Flow Builder)
*   **Demanda:** Simplificar a criação de narrativas complexas de navegação.
*   **Conceito:** Interface estilo "Canvas" onde o usuário constrói a lógica do projeto graficamente.
*   **Mecânica de Gestão:**
    1.  **Criação de Nós:** Arrastar um "Card Mãe" para a direita cria uma conexão horizontal (Stories/Sub-mídia). Arrastar para baixo cria uma conexão vertical (Nova Categoria/Feed).
    2.  **Trava de Layout:** Após definir a estrutura, o usuário "tranca" o desenho para evitar deslocamentos acidentais.
    3.  **Abastecimento de Dados:** Arrastar fotos/vídeos do computador diretamente para dentro dos cards vazios no fluxo.
    4.  **Automação:** O sistema gera automaticamente as relações de parentesco (ID, parentId, position) no Firestore e processa os uploads para o Storage.

### 4.4. Módulo de Ajuda e Suporte ao Usuário (Tooltips)
*   **Demanda:** Reduzir a carga cognitiva do usuário.
*   **Implementação:** Inclusão de tooltips contextuais ("?") em cada campo do Admin.
*   **Conteúdo:** Explicação simples do que o campo altera e sugestões de valores ideais.

### 4.5. Sistema de Salvaguardas (Safety Guards)
*   **Demanda:** Impedir que erros de entrada "quebrem" o layout.
*   **Mecânica:** Validação de tipos (Schema Validation) antes da persistência no Firestore.
*   **Locks:** Bloqueio de edição em campos estruturais críticos para usuários sem nível "Support".

## 5. Padronização de Mídias (Aspect Ratio)
Para garantir a harmonia da Galeria e do Player, o sistema passará a oferecer um seletor de formatos padronizados:
*   **Widescreen (16:9):** Vídeos horizontais, YouTube.
*   **Vertical/Stories (9:16):** Reels, TikTok.
*   **Portrait (4:5):** Postagens de feed/carrossel Instagram.
*   **Documento (A4 - 1:1.41):** PDFs e materiais institucionais (595px X 842px).
*   **Quadrado (1:1):** Logos e posts clássicos.

## 6. Sistema de Atribuição de Cores (Color Attributes)
Substitui o conceito de "cor isolada" por uma matriz de comportamento visual.
*   **Camada 1: Fundação (Atmosphere):** Atributos que regem o fundo, cards e recipientes (Ex: `bgMain`, `cardGlass`).
*   **Camada 2: Interação (Action Cues):** Atributos que indicam onde clicar (Ex: `primaryAction`, `hoverState`, `activeIndicator`).
*   **Camada 3: Identidade (Project Soul):** Atributos dinâmicos que mudam por projeto (Ex: `projectAccent`, `playerGlow`).
*   **Humanização:** No Admin, essas propriedades não serão apenas códigos Hex, mas terão labels como "Cor de Ação dos Botões" ou "Brilho do Player".

## 7. Jornada do Usuário Administrativo (Criação de Projeto)
Objetivo: Transformar a complexidade de rotas e hierarquias em uma experiência visual de "arrastar e soltar".

1.  **Entrada:** Botão "Novo Projeto" no Dashboard.
2.  **Fase de Estrutura (Draft Layout):**
    *   O usuário desenha o fluxo no Canvas usando o "Card Mãe" como origem.
    *   Arraste para a direita (Eixo X) = Novas mídias no mesmo nível (Stories).
    *   Arraste para baixo (Eixo Y) = Novas categorias/capas (Feeds).
3.  **Trava de Segurança:** Botão "Fixar Estrutura" desabilita a criação de novos nós e habilita o modo de preenchimento.
4.  **População de Conteúdo (Data Fill):**
    *   Usuário arrasta mídias do PC para os cards.
    *   **Swap Inteligente:** Permite arrastar uma mídia que já está no "Card A" para o "Card B". O sistema faz a troca instantânea das URLs e tipos entre os nós.
5.  **Refino Estético (Atribuição de Cores):** Edição dos atributos de cor específicos para aquele projeto.
6.  **Execução Final:** O botão "Salvar e Publicar" processa a fila de uploads e gera o documento no Firestore.

## 8. Estrutura de Dados Estratégica (Blueprint Evoluído)

### Coleção: `layout_templates`
Define **como** as coisas aparecem.
*   `section_id`: string
*   `config_schema`: JSON (Define quais campos aparecem no Admin para esta seção)
*   `ui_metadata`: JSON (Labels amigáveis, tooltips e ajuda para o usuário)

### Coleção: `site_content`
Contém o **conteúdo** bruto.
*   Separado por módulos: `sobre`, `projetos`, `servicos`, `depoimentos`.

## 9. Próximos Passos (Workflow de Tarefas)
1.  **Delineamento de Propriedades:** Identificar exaustivamente cada variável que hoje é estática e deve migrar para o Firestore.
2.  **Humanização do Admin:** Revisar as telas de edição para garantir que o mapeamento das propriedades seja visualmente simples (ex: seletores de cor, toggles de estado, sliders de tamanho).
3.  **Scripts de Sincronização:** Criar ferramentas que permitam subir novos templates de estrutura sem "quebrar" os dados já existentes.

