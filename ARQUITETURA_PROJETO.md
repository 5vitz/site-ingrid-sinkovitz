# Documento de Arquitetura Master - Portfólio Ingrid Sinkovitz

## 1. Visão Geral
Este documento serve como a "Fonte da Verdade" para a reconstrução do site. O objetivo é migrar de uma estrutura "remendada" para um código limpo, semântico e escalável, utilizando React, Vite, Firebase (Auth, Firestore, Storage) e Tailwind CSS.

## 2. Identidade Visual (Mood: Profissional e Elegante)
*   **Tipografia Base:** Poppins (Sans-serif) - Fonte oficial do site.
*   **Gestão Dinâmica:** O sistema deve permitir a alteração das fontes (Primária e Títulos) via Painel Administrativo.
*   **Cores Estruturais:**
    *   `--cor1`: #465D53 (Verde Escuro - Acento Primário)
    *   `--cor2`: #203F44 (Teal Profundo - Cabeçalhos e Textos Escuros)
    *   `--cor3`: #BE735E (Terra Cota - Acento Secundário)
    *   `--cor4`: #6B3028 (Marrom/Vermelho Escuro - Terciário)
    *   `--cor5`: #B35227 (Laranja Queimado - Acento Vívido)
    *   `--cor6`: #C1908A (Rosa Suave - Acento Soft)
    *   `--white`: #FFFFFF
    *   `--gray-light`: #F8F9FA
    *   `--text-dark`: #1A1A1A
    *   `--shadow`: 0 2px 8px rgba(0, 0, 0, 0.05)
*   **Configurações de Layout:**
    *   `section-container`: py-[10px] (Reduzido para um design mais compacto).
    *   `section-card`: bg-zinc-900/40 backdrop-blur-md.

## 3. Módulos do Sistema

### 3.1. Motor de Temas Dinâmico (Novo)
O sistema utiliza um mecanismo de "Injectable CSS Variables" para permitir personalização em tempo real sem necessidade de novos builds:
*   **Persistência:** As configurações são salvas no Firestore (`settings/global`).
*   **Aplicação:** O `App.tsx` escuta as mudanças e injeta as variáveis no `:root`.
*   **Capacidades:**
    *   **Cores:** Mapeamento de 6 acentos e tons de texto/fundo.
    *   **Tipografia:** Controle dinâmico do tamanho das fontes (h1, h2, h3, h4) via sliders no dashboard.
*   **Tailwind Integration:** O `index.css` mapeia essas variáveis para classes utilitárias e tags base.

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
A formatação é rígida para garantir a estética do portfólio. O usuário seleciona o layout antes de qualquer upload:
1.  **Vertical (400x500px):** Navegação/Scroll vertical.
2.  **Horizontal (800x500px):** Navegação/Scroll horizontal.

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

### Experiência de Navegação (Transição Natural):
O termo **Card** é apropriado para cada unidade de mídia (imagem/vídeo) dentro do reel. A transição deve ser fluida:
1.  **Entrada (Quick View):** O card apresenta o resumo e o botão "Saiba Mais".
2.  **Ação (Clique):** Ao clicar, o sistema navega para o **Player de Projetos** (Modal).
3.  **Navegação Inteligente:**
    *   **Navegação Vertical (Reels):** Suporte a scroll de mouse e touch para navegar entre vídeos verticais e mídias do projeto.
    *   **Sensor de Âncora:** O sistema encerra o player instantaneamente se o usuário clicar em qualquer item do menu global ou footer, garantindo uma navegação sem travamentos.
    *   **Bloqueio de Scroll Externo:** Impede que a página principal role enquanto o usuário está imerso no conteúdo do projeto.

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
*   `description`: string (para o Quick View)
*   `layoutType`: enum ('vertical', 'horizontal')
*   `audioUrl`: string (Link da trilha sonora em loop do projeto)
*   `galleryThumbnail`: string (Foto-link)
*   `coverImage`: string (Foto-capa no Saiba Mais)
*   `thumbnailFit`: enum ('cover', 'contain')
*   `cardBg`: string (Classe de fundo do Tailwind, ex: 'bg-white')
*   `mediaItems`: array de objetos:
    *   `type`: enum ('image', 'video', 'text', 'link')
    *   `url`: string
    *   `thumbnail`: string (para links/vídeos)
    *   `order`: number
*   `order`: number (posição na galeria geral)

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
