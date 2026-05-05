# Dicionário de Propriedades Editáveis (Ingrid)

Este documento serve como guia para a linguagem que será utilizada no Painel Administrativo. Ele traduz termos técnicos do código para uma linguagem mais clara para o usuário final.

---

## 1. Informações do Projeto (Sobre o Projeto)

| Termo Técnico (Código) | Nome Humanizado (Painel) | O que faz? |
| :--- | :--- | :--- |
| **title** | Título do Projeto | O nome principal que aparece na galeria e no topo do modal. |
| **description** | Descrição / Resumo | Um texto curto explicando do que se trata aquele trabalho. |
| **coverImage** | Capa da Galeria | A imagem que representa o projeto quando ele ainda está fechado. |
| **audioUrl** | Trilha Sonora | O arquivo de áudio (MP3) que toca ao abrir o projeto. |
| **layoutType** | Formato de Exibição | Define se o projeto abre como "Stories" (Vertical) ou "Feed" (Horizontal). |
| **order** | Posição na Lista | A ordem numérica em que o projeto aparece no site (1º, 2º, etc). |

---

## 2. Sistema de Atribuição de Cores (Color Attributes)
Este sistema controla a "alma" visual do site e de cada projeto. No código, essas cores são injetadas como variáveis CSS dinâmicas.

| Atributo (Técnico) | Nome Humanizado (Painel) | Aplicação Prática |
| :--- | :--- | :--- |
| **bgMain** | Atmosfera de Fundo | A cor mestre do "vasto vazio". Preto azulado, cinza profundo ou branco galeria. |
| **cardGlass** | Opacidade do Vidro | Define se os cards são mais sólidos ou mais transparentes (efeito blur). |
| **primaryAction** | Cor de Destaque / Botões | Aplicada em ícones de play, botões de contato e links ativos. |
| **hoverState** | Realce de Interação | O brilho ou mudança de tom quando o usuário "flutua" o mouse sobre um card. |
| **projectAccent** | Tom da Marca (Projeto) | Cada projeto no player pode "pintar" o ambiente com uma cor própria. |
| **playerGlow** | Intensidade do Brilho | Controla o "halo" de luz ao redor do player central. |
| **textPrimary** | Cor do Texto Principal | Cor das descrições e títulos importantes. |
| **textMuted** | Texto de Apoio | Cor de legendas técnicas, datas ou etiquetas de tags. |
| **playerWidth** | Largura de Exposição | Valor padrão para Desktop (Ex: 540px). |
| **playerMaxHeight** | Altura Limite (Viewport) | Altura máxima que o player ocupa na tela (Ex: 88vh). |

---

## 3. Tipografia e Identidade (Type & Global)
Para garantir que a Ingrid possa mudar a "voz" do site sem abrir o editor de código.

| Atributo (Técnico) | Nome Humanizado (Painel) | O que faz? |
| :--- | :--- | :--- |
| **fontFamilyDisplay** | Fonte de Títulos | Define a fonte impactante (Ex: Poppins, Space Grotesk). |
| **fontFamilyBase** | Fonte de Leitura | Define a fonte de textos longos (Ex: Inter, Montserrat). |
| **seoTitle** | Título da Aba (Google) | O texto que aparece no navegador e nas buscas. |
| **seoDescription** | Resumo do Site | A pequena frase que convence o usuário a clicar no Google. |
| **socialLinks** | Redes Sociais | Lista de URLs (WhatsApp, Instagram, LinkedIn, etc). |
| **sectionTitles** | Títulos das Seções | Permite mudar nomes como "Sobre Mim" para "Bio" ou "História". |
| **contactEmail** | E-mail de Contato | O endereço oficial que aparece no rodapé. |
| **contactPhone** | Telefone / WhatsApp | O número para o qual os botões de ação apontam. |

---

## 4. Formatos e Proporções (Aspect Ratio)
Padronização de medidas para evitar distorções no layout e manter a qualidade visual do player de 540px.

| Formato (Proporção) | Nome Humanizado (Painel) | Contexto de Uso |
| :--- | :--- | :--- |
| **16:9** | Cinema / Horizontal | Vídeos clássicos, apresentações e YouTube. |
| **9:16** | Social / Vertical | Reels do Instagram e TikTok. |
| **4:5** | Retrato / Feed | Formato ideal para fotos de feed mobile. |
| **1:1** | Quadrado | Logos, marcas e posts clássicos. |
| **1:1.41** | Documento (A4) | Visualização vertical de PDFs e roteiros. |

---

## 5. Construtor de Fluxo e Gestão de Mídia (Flow Builder)
Aqui mora a inteligência por trás dos projetos complexos.

| Atributo (Técnico) | Nome Humanizado (Painel) | Função no Sistema |
| :--- | :--- | :--- |
| **sourceId** | ID de Origem | Identificador único do Card Mãe. |
| **parentId** | Vinculado ao Card... | Diz ao sistema quem é o "pai" desse card na hierarquia. |
| **navigationAxis** | Eixo de Navegação | Define se o próximo card está à direita (X) ou abaixo (Y). |
| **mediaType** | Tipo de Arquivo | Identifica se o sistema deve carregar um Player de Vídeo ou de Imagem. |
| **isMuted** | Mudar Áudio | Define se o vídeo começa com som ou mudo por padrão. |
| **loopEnabled** | Repetir Infinito | Faz o vídeo ou a trilha sonora recomeçar automaticamente. |
| **swapAction** | Troca de Posição | Comando que permite reordenar cards sem deletá-los. |
| **contentOverlay** | Texto sobre Mídia | Permite escrever legendas ou títulos diretamente em cima da foto/vídeo. |

---

## 4. Gerenciamento (O que conversamos)

| Termo Técnico (Código) | Nome Humanizado (Painel) | O que faz? |
| :--- | :--- | :--- |
| **isLocked** (Sugestão) | Bloqueador de Acesso | Se ativado, o público não vê o projeto (Aparece "Sob Manutenção"). |
| **isDraft** (Sugestão) | Modo Rascunho | O projeto só fica visível para quem está logado no painel. |
