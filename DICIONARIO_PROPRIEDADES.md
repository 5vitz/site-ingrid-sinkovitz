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

## 2. Design e Estilo (Visual do Player)

| Termo Técnico (Código) | Nome Humanizado (Painel) | O que faz? |
| :--- | :--- | :--- |
| **accentColor** | Cor de Destaque | A cor principal de botões, barras de progresso e detalhes (Amarelo, Verde, etc). |
| **playerWidth** | Largura da Tela | O tamanho horizontal (em pixels) que o conteúdo terá. |
| **playerHeight** | Altura da Tela | O tamanho vertical (em pixels) que o conteúdo terá. |
| **playerBorder** | Cor da Moldura | A cor da linha que envolve a tela de exibição. |
| **borderRadius** | Arredondamento | Define se os cantos da tela são mais quadrados ou arredondados. |
| **borderWidth** | Espessura da Moldura | Define se a linha de borda é fina ou mais grossa. |

---

## 3. Conteúdo e Mídias (Os Cards)

| Termo Técnico (Código) | Nome Humanizado (Painel) | O que faz? |
| :--- | :--- | :--- |
| **type (Video/Image/PDF)** | Tipo de Mídia | Se o item que você está subindo é um Vídeo, uma Imagem ou um PDF. |
| **url** | Link do Arquivo | O endereço onde o arquivo está guardado (Firebase). |
| **aspectRatio** | Proporção da Tela | Ajusta a tela para formatos específicos (Quadrado, Cinema, Vertical, etc). |
| **objectFit (Cover/Contain)** | Enquadramento | Define se a foto deve "Preencher a tela toda" ou "Aparecer inteira com sobra". |
| **allowScroll** | Rolar Conteúdo | Ativa a rolagem para imagens muito longas (como prints de sites ou PDFs). |

---

## 4. Gerenciamento (O que conversamos)

| Termo Técnico (Código) | Nome Humanizado (Painel) | O que faz? |
| :--- | :--- | :--- |
| **isLocked** (Sugestão) | Bloqueador de Acesso | Se ativado, o público não vê o projeto (Aparece "Sob Manutenção"). |
| **isDraft** (Sugestão) | Modo Rascunho | O projeto só fica visível para quem está logado no painel. |
