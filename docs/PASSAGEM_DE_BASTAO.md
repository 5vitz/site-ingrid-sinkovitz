# Passagem de Bastão — Portfólio Ingrid Sinkovitz
**Para o próximo Agente Lincoln**

Bem-vindo! Este documento contém as orientações, o histórico recente do projeto e o backlog do que deve ser trabalhado a seguir para manter a consistência do desenvolvimento sob o **Método Lincoln** (`AGENTS.md`).

---

## 1. Contexto e Objetivo do Rebranding
O site antigo, focado em navegação baseada em grafos bidimensionais (eixos X/Y) com o player estilo stories, foi descontinuado.
Nesta sessão, realizamos uma **refatoração total do zero**, criando um site com **estética editorial premium (minimalista/high-end)** baseado nas referências do site de Luana Floriani (`https://www.luanafloriani.com/`). 

O deploy de produção está automatizado e integrado no Firebase Hosting:
* **URL de Teste:** [https://gen-lang-client-0706232208.web.app](https://gen-lang-client-0706232208.web.app)
* **Domínio Customizado:** `www.ingridsinkovitz.com.br`

---

## 2. O que foi feito nesta sessão
* **Limpeza e Backup:** Limpamos todas as pastas de mídia e código legado do site antigo (`src/`, `scripts/`, `dist/` antigas). O usuário fez um backup completo da estrutura anterior antes do início dos trabalhos.
* **Preservação de Configuração:** Mantivemos as credenciais de deploy, regras de banco (`firestore.rules` e `storage.rules`) e os arquivos de versionamento do Git e GitHub Actions intactos.
* **Design System (Tailwind CSS v4):**
  * Paleta: Fundo Marfim/Creme (`#FEFCF5`), texto principal em Preto (`#000000`), texto descritivo em Carvão Quente (`#35291D`) e links/botões em Azul Royal (`#3D54C8`).
  * Tipografia: Serif de Títulos (*Cormorant Garamond*) e Sans-serif de leitura (*Outfit*).
* **Banco de Dados Local (`src/data/`):**
  * Criamos dados estáticos iniciais com base nos Google Docs descriptografados pelo usuário: `aboutData.ts` (história da Ingrid), `servicesData.ts` (lista de 5 categorias de serviços) e `projectsData.ts` (reestruturação de Metavix, Elo Bike, Good Storage e Lion Jump com ficha técnica e métricas).
* **Carrossel de Curiosidades (`src/components/AboutCarousel.tsx`):**
  * O usuário baixou manualmente a pasta de fotos sob `public/fotos/CARROSEL CURIOSIDADES SOBRE MIM/` (15 imagens de `1.png` a `15.png`).
  * Implementamos um carrossel estilo Instagram com suporte a deslizar em celulares (swipe) e bolinhas dinâmicas que encolhem de tamanho de forma inteligente para não quebrar o layout do rodapé.
* **Compilação e Deploy:** O build de produção gerado com `npm run build` compila com **zero erros e zero avisos**, sendo publicado de forma síncrona no Firebase.

---

## 3. Arquivos Importantes para Inspecionar
* `src/types.ts` — Contratos de tipos de dados.
* `src/App.tsx` — Roteamento das páginas com React Router v7.
* `src/index.css` — Configuração do Tailwind CSS v4, imports de fontes e estilização base.
* `src/components/AboutCarousel.tsx` — O componente do carrossel do "Sobre Mim".
* `src/data/projectsData.ts` — Banco de dados local contendo os cases.
* `public/BRIEFING REBRANDING.pdf` — O arquivo PDF com todas as informações originais passadas pelo usuário.

---

## 4. Backlog de Próximos Passos (Para a próxima sessão)
1. **Logotipos e Mídias de Alta Definição:**
   * O usuário compartilhou pastas do Drive com os logotipos e novas mídias no arquivo `public/BRIEFING REBRANDING.pdf`. No momento da última verificação, o download via utilitários retornava 401 Unauthorized (pastas restritas no Drive).
   * Alinhar com o usuário para baixar esses logotipos (SVG/PNG) e mídias de projetos de forma manual e organizá-los nas pastas `public/logos/` e `public/fotos/` ou atualizar os links públicos no banco de dados.
2. **Integração com o Firebase Firestore:**
   * Atualmente, o portfólio consome o arquivo local `src/data/projectsData.ts` para agilizar o desenvolvimento. Caso o usuário queira que a gestão de cases de projetos seja feita de forma dinâmica (permitindo cadastro pelo painel futuramente), será necessário reativar as chamadas assíncronas do Firestore usando o schema do `types.ts`.
3. **Revisões do Usuário:**
   * Obter o feedback da Ingrid e do usuário sobre a estética das novas páginas (`Home`, `Sobre`, `Expertise`, `Detalhes dos Projetos`) e ajustar detalhes de layout conforme demandado.
4. **Biblioteca de Agentes Especialistas (`docs/agentes/`):**
   * O usuário adicionou uma biblioteca completa de manifestos de agentes especialistas sob `docs/agentes/` (veja `INDEX.md`).
   * **Instrução para o Próximo Lincoln:** Utilize as ferramentas `define_subagent` e `invoke_subagent` com base nas instruções e perfis desses manifestos (como `Minimal Change Engineer` para diffs mínimos, ou `Whimsy Injector` para detalhes de UX/UI) para delegar tarefas específicas e aumentar a performance da sessão.

---
*Assinado: Agente Lincoln — Julho de 2026.*
