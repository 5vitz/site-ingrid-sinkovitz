# Documento de Arquitetura Master - Portfólio Ingrid Sinkovitz

## 1. Visão Geral
Este documento é a "Fonte da Verdade" do projeto. O sistema evoluiu para um modelo de portfólio de alta performance, focando em minimalismo extremo, transições de "corte seco" (sem animações de fade que causem lag visual) e personalização profunda por projeto.

## 2. Identidade Visual (Mood: Minimalista, Cinematográfico e Técnico)
*   **Filosofia de Design:** Minimalismo Fervoroso. Cada elemento deve ter um propósito.
*   **Transições:** "Corte Seco" (Dry Cut). As mídias e modais mudam instantaneamente, sem efeitos de escala ou opacidade que distraiam ou causem percepção de travamento.
*   **Tipografia Base:** Inter/Poppins (Sans-serif). Foco em legibilidade e espaçamento técnico.
*   **Cores Estruturais (Base):**
    *   Fundo principal: `bg-[#050510]` (Preto profundo azulado).
    *   Cards e Seções: `bg-zinc-900/40` com `backdrop-blur-md`.
    *   Bordas: `border-white/5` ou `border-white/10`.
    *   Acento Padrão: `#00D154` (Verde Neon/Digital).
    *   Acento Alternativo: `#FEF200` (Amarelo Vibrant - Ex: Projeto Lion Jump).

## 3. Módulos do Sistema

### 3.1. Personalização por Projeto (Sistema de Temas v2)
Ao contrário de um template fixo, cada projeto no portfólio pode "herdar" um universo visual próprio:
*   **Injectable Theme:** Cada objeto `Project` possui uma propriedade `theme` opcional.
*   **Propriedades Customizáveis:**
    *   `playerBg`: Cor de fundo do player (Ex: `bg-black` para vídeos, `bg-white` para certas marcas).
    *   `playerBorder`: Estilo de borda (Ex: `border-[#FEF200]/40`).
    *   `playerShadow`: Efeito de brilho externo (Glow) personalizado.
    *   `accentColor`: Cor dos botões de navegação e indicadores.
    *   `navButtonBg` e `navButtonColor`: Customização total dos controles.

### 3.2. Controle de Acesso (ACL)
Níveis de acesso para manter a integridade do site:
*   **Superusuário (Ingrid):**
    *   Gestão total do sistema.
    *   Interface exclusiva para cadastrar/remover e-mails de **ADM** e **Suporte**.
    *   Configurações mestres de infraestrutura.
*   **Administrativo (Conteúdo):** Acesso ao `PainelADM` para gerir as 4 seções dinâmicas (Sobre Mim, Serviços, Projetos, Depoimentos). Não mexe em cores fixas ou estrutura de menu.
*   **Suporte (Técnico):** Acesso ao código-fonte para manutenção de seções estáticas (Topo/Contato), criação de novos itens de menu e ajustes de infraestrutura.

### 3.2. Configurações Globais (Editáveis pelo ADM)
*   **Personalização de Estilo:**
    *   **Paleta de Cores:** Entrada de Hexadecimais.
    *   **Tipografia:** Seleção de fontes para Corpo e Títulos (Ex: Poppins, Inter, Montserrat).

### 3.3. Seções do Site
1.  **Topo (Estático/Hardcoded):** Menu e Identidade inicial (Navbar com efeito glass-morphism e deslocamento de precisão).
2.  **Sobre Mim (Dinâmico - Template):** Gestão de vídeo e texto em card de vidro 3xl.
3.  **Serviços (Dinâmico):** Grade de especialidades em formato accordion "slim".
4.  **Projetos (Dinâmico):** Portfólio com categorias, mídias variadas e arquitetura de cards aninhados (p-6/24px de padding interno).
5.  **Depoimentos (Dinâmico):** Prova social com fotos e textos em grade adaptativa.
6.  **Contato (Estático):** Seção com título dedicado, informações fixas e links sociais, utilizando Poppins e menu em caixa baixa.

---

## 4. Detalhamento: Seção "Sobre Mim" (Fluxo Blueprint)
Esta seção serve de modelo para todas as outras áreas editáveis.

### Fluxo de Gestão (Baseado no BPM):
1.  **Estado Inicial (Preview):**
    *   Exibição do vídeo atual em miniatura.
    *   Exibição do texto atual.
    *   Botão "Selecionar" para entrar em modo de edição.
2.  **Gestão de Remoção:**
    *   Apresentar nome/detalhes do arquivo atual.
    *   Botão "Excluir" com confirmação de exclusão para evitar erros acidentais.
3.  **Inclusão Multinível (Input de Mídia):**
    *   **Upload Local:** Drag & drop ou seletor de arquivos do PC.
    *   **Integração Drive:** Campo para colar link do Google Drive (com extração automática de ID).
    *   **Link Direto:** Caixa para inserção de URL externa.
    *   **Feedback Visual:** Gerar thumbnail automática ao inserir link para validar a mídia.
    *   **Confirmação:** Botão de "Confirmar Inclusão" que prepara o arquivo na fila de upload.
4.  **Finalização/Persistência:**
    *   Botão "Executar" (Upload Real para Firebase Storage).
    *   Ação "Gravar no BD" (Atualização do Firestore com o novo URL e data).

---

## 5. Detalhamento: Seção "Serviços"

### Fluxo de Gestão (PainelADM):
1.  **Seleção de Serviço:**
    *   Exibir lista de títulos de serviços existentes (Ex: "Edição de Vídeo", "Produção Audiovisual").
    *   Usuário clica em um item da lista para carregar os detalhes.
2.  **Ações Disponíveis (Após Seleção):**
    *   **Excluir Serviço:** Deleta a categoria inteira.
    *   **Editar Nome:** Altera o título principal daquela especialidade.
    *   **Gestão de Itens (Checklist):**
        *   Lista de sub-itens específicos (Ex: "Corte seco", "Color Grading").
        *   Opções para: **Incluir** novo item, **Excluir** item existente ou **Alterar** o texto do item.
3.  **Inclusão de Novo Serviço:**
    *   Botão "Adicionar Nova Categoria".
    *   Formulário para definir: Título e primeira lista de itens.

---

## 6. Detalhamento: Seção "Projetos" (Arquitetura de Portfólio)

### Formatos Padronizados (Componentes Fixos):
A formatação é rígida para garantir a estética do portfólio. O sistema prioriza a largura perfeita de leitura e exposição:
1.  **Largura Fixa (Desktop):** Independente do formato da mídia, a largura do player é chumbada em **560px**. Isso garante consistência visual absoluta na navegação.
2.  **Altura Dinâmica/Scroll:** Se a mídia ultrapassar a proporção ou altura útil da tela, o player trava na altura máxima permitida (88vh) e habilita o **Scroll Vertical Técnico**, mantendo os 560px de largura.

### Fluxo de Criação (PainelADM):
1.  **Seleção de Formato:** Primeira etapa obrigatória (Vertical ou Horizontal).
2.  **Identificação:** Título do projeto (Caixa de texto).
3.  **Foto-Link (Capa da Galeria):** Upload da imagem que representará o projeto na grade principal do site.
4.  **Quick View (Resumo):** Upload de texto descritivo e primeira imagem (Foto-capa) que aparece após o clique em "Saiba Mais".
5.  **Gestão de Mídia (Accordion Reordenável):**
    *   Interface em sanfona para listar vídeos, imagens e textos.
    *   **Ordenação:** Botões "subir/descer" ou drag-and-drop para definir a sequência real.
    *   **Upload Inteligente:** Arraste de arquivos (PC) ou integração com Google Drive.
    *   **Auto-Thumbnail:** Ao inserir links (Drive/Web), gerar miniatura para facilitar a identificação no painel.
6.  **Preview do Painel:** Janela de visualização em tempo real para testar a sequência antes de publicar no BD.

### Design e Arquitetura da Galeria:
1.  **Enquadramento Arquitetônico (Simetria):** Todos os projetos residem dentro de um `section-card` mestre para manter a coerência visual com as outras seções do site.
2.  **Cards Aninhados (Gallery Cards):** Cada projeto individual é emoldurado por seu próprio card de vidro interno.
3.  **Padding de Exposição (Pass-partout):** Aplicação de 24px (`p-6`) de respiro interno entre a borda do mini-card e a imagem, criando um efeito de moldura de luxo.
4.  **Ajustes Finos de Interface:**
    *   `thumbnailFit`: Suporte para 'cover' (padrão) ou 'contain' (para logos com transparência).
    *   `cardBg`: Capacidade de definir cores de fundo específicas por card (Ex: branco para logos escuros).

### Experiência de Navegação (Mergulho e Performance):
1.  **Ação (Clique):** Ao clicar, o sistema abre o **Player de Projetos** imediatamente.
2.  **Navegação 2D (Feed/Stories):**
    *   **Vertical (Eixo Y):** Navega entre "Feeds" ou categorias principais do projeto.
    *   **Horizontal (Eixo X):** Navega entre "Stories" ou sub-mídias de um feed específico.
3.  **Lógica de Largura Chumbada (560px):** O player não varia mais de largura baseada no aspectRatio em Desktop. Ele mantém 560px fixos, ajustando apenas a altura até o limite da viewport (88vh).
4.  **Corte Seco Minimalista:** Transição reduzida a um `opacity` linear de 0.15s. Remoção total de efeitos de escala, bounce ou deslocamento (Y), focando em uma experiência "seca" e direta.
5.  **Tratamento de Mídias Especiais:**
    *   **Imagens/Vídeos:** `object-cover` ou `object-contain` configurável.
    *   **PDFs:** Incorporação via Google Docs Viewer para contornar bloqueios de segurança de navegadores, permitindo visualizar materiais de venda e propostas diretamente no card sem sair do site.

### Design Sonoro (Trilha Sonora Adaptativa):
Para evitar o "silêncio branco" em cards estáticos, o site implementa uma experiência imersiva de áudio:
1.  **Trilha por Projeto (OST):** Cada reel pode ter sua própria trilha de fundo em loop (Ex: percussão baiana para projetos na Bahia).
2.  **Lógica de Auto-Duck:** 
    *   A trilha toca em loop durante a navegação por imagens ou textos.
    *   Ao focar em um card de **Vídeo**, o sistema reduz suavemente o volume da trilha (Fade-out) para priorizar o som original do vídeo.
    *   Ao sair do vídeo, a trilha retorna ao volume normal (Fade-in).
3.  **Seamless Loop:** O código deve garantir que a transição do fim para o início da trilha seja imperceptível.

---

## 7. Detalhamento: Seção "Depoimentos" (Mural de Prova Social)

### Lógica de Componente Inteligente:
O sistema decidirá o layout automaticamente com base na densidade do conteúdo para manter o equilíbrio visual da grade (duas colunas por linha).
1.  **Formato Vertical (Padrão):** Aplicado a textos curtos e diretos.
2.  **Formato Horizontal (Expandido):** Ativado automaticamente quando o texto excede um limite de caracteres/linhas pré-definido.
3.  **Grade de Exibição:** Dois depoimentos lado a lado (2 colunas), garantindo que um depoimento "Horizontal" ocupe o espaço necessário sem quebrar a harmonia.

### Fluxo de Gestão (PainelADM):
1.  **Criação/Edição:**
    *   Upload da foto do autor (preferencialmente circular/moldura fixa).
    *   Campos de texto: Nome, Cargo/Empresa e o Depoimento.
    *   **Preview Automático:** O painel mostra em tempo real se o depoimento será exibido como Vertical ou Horizontal com base no texto digitado.
2.  **Ordenação:** Controle da sequência de exibição no mural.

---

## 8. Estrutura de Dados (Firestore)

### Coleção: `settings`
*   Documento `sobre_mim`:
    *   `videoUrl`: string
    *   `description`: string
    *   `updatedAt`: timestamp
*   Documento `global`:
    *   `whatsappNumber`: string
    *   `accentColor`: string (Hex)

### Coleção: `projects`
*   `id`: string (slug)
*   `title`: string
*   `layoutType`: enum ('vertical', 'horizontal')
*   `audioUrl`: string (trilha sonora do projeto)
*   `theme`: Objeto de tema (playerBg, playerBorder, playerShadow, etc.)
*   `feed`: array de objetos:
    *   `id`: string
    *   `aspectRatio`: number (0.56, 0.8, 1.77, etc.)
    *   `media`: objeto de mídia principal
    *   `stories`: array de objetos de mídia secundários
*   `order`: number

### Coleção: `services`
*   `id`: string (gerado automaticamente)
*   `title`: string (Título do Serviço, ex: "Vídeo para Social Media")
*   `items`: array de strings (Lista de características: ["Reels", "TikTok", "Shorts"])
*   `order`: number (Para controlar a posição na grade do site)
*   `updatedAt`: timestamp

### Coleção: `testimonials`
*   `id`: string
*   `author`: string
*   `role`: string (Cargo/Empresa)
*   `text`: string
*   `photoUrl`: string
*   `order`: number
*   `createdAt`: timestamp

### Coleção: `users_roles` (Controle da Superusuária)
*   `email`: string (ID do documento)
*   `role`: enum ('admin', 'support')
*   `assignedBy`: string (e-mail da Ingrid)

---

## 8. Próximos Passos
1.  Validar se este nível de detalhe no "Sobre Mim" atende à sua visão.
2.  Replicar o detalhamento para as seções "Projetos", "Serviços" e "Depoimentos".
3.  Definir a lista final de conteúdos para a "primeira carga" de dados.
