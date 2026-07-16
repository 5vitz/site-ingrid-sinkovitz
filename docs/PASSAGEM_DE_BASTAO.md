# Passagem de Bastão — Portfólio Ingrid Sinkovitz
**Para o próximo Agente Lincoln**

Bem-vindo! Este documento contém as orientações, o histórico recente do projeto e o backlog do que deve ser trabalhado a seguir para manter a consistência do desenvolvimento sob o **Método Lincoln** (`AGENTS.md`).

---

## 1. Contexto e Objetivo do Rebranding
O site antigo, focado em navegação baseada em grafos bidimensionais (eixos X/Y) com o player estilo stories, foi descontinuado.
Nesta sessão, consolidamos a transição para o **Cenário B** (Banco de Dados Dinâmico com Firestore + Firebase Storage), sob uma **estética editorial premium (minimalista/high-end)** baseado nas referências do site de Luana Floriani.

O deploy de produção está totalmente automatizado e integrado no Firebase Hosting:
* **URL de Teste:** [https://gen-lang-client-0706232208.web.app](https://gen-lang-client-0706232208.web.app)
* **Domínio Customizado:** `www.ingridsinkovitz.com.br`

---

## 2. O que foi feito hoje (16 de Julho de 2026)

### 📸 Otimização e Conversão de Imagens (WebP & LCP)
* **Redução de Mídia Local:** Implementamos um script em lote (`scripts/convert-images.js`) usando a biblioteca `sharp` para converter todas as imagens locais em `public/fotos` (incluindo as 15 imagens do carrossel do "Sobre Mim" e a foto principal da Ingrid) de `.png`/`.jpg` para `.webp`. O tamanho total de mídias locais foi reduzido em **mais de 92%** (de ~30MB para ~2.3MB).
* **Carregamento Prioritário (LCP):** Ajustamos o [AboutCarousel.tsx](file:///home/artz/Documentos/Antigravity/site-ingrid-sinkovitz/src/components/AboutCarousel.tsx) para buscar os novos arquivos `.webp` e adicionamos `fetchPriority="high"` na primeira imagem visível do carrossel (e `fetchPriority="low"` nas demais ocultas) para otimizar o LCP do Core Web Vitals.

### 🌐 Integração com Firebase SDK
* **Inicialização Centralizada:** Criamos o [firebase.ts](file:///home/artz/Documentos/Antigravity/site-ingrid-sinkovitz/src/firebase.ts), conectando o frontend ao Firebase Auth, Cloud Firestore (com o ID de banco customizado `gen-lang-client-0706232208`) e Firebase Storage do projeto.

### 🔒 Tela de Manutenção com Controle de Acesso
* **Design Editorial de Bloqueio:** Desenvolvemos a [Maintenance.tsx](file:///home/artz/Documentos/Antigravity/site-ingrid-sinkovitz/src/pages/Maintenance.tsx) exibindo o logotipo `LogoCirculo.png` acima do nome estilizado da Ingrid e o aviso de manutenção.
* **Modal de Acesso Restrito:** Criamos uma entrada discreta solicitando E-mail e Senha. Apenas os e-mails `sinkando@gmail.com` e `ingridsinkovitz@gmail.com.br` com a senha `Ingrid2026!` possuem acesso ao site completo.
* **Guarda de Rotas:** Configuramos o controle de rotas no [App.tsx](file:///home/artz/Documentos/Antigravity/site-ingrid-sinkovitz/src/App.tsx) para redirecionar usuários não autenticados/visitantes para a tela de manutenção.

### 🛠️ Painel Administrativo / Dashboard
* **Gerenciador de Cases ([AdminDashboard.tsx](file:///home/artz/Documentos/Antigravity/site-ingrid-sinkovitz/src/pages/AdminDashboard.tsx)):** Criamos uma interface protegida por Firebase Auth que permite criar, editar, deletar e ordenar os projetos.
* **Conversor Automático no Cliente:** O formulário de upload de mídia converte qualquer imagem selecionada (`.png`, `.jpg`, `.jpeg`) para `.webp` compactada diretamente no navegador (client-side) usando a API HTML5 Canvas antes de enviá-la para o Storage na pasta `/v3/`. Isso economiza banda e espaço.
* **Importador de Dados (Seeding):** Adicionamos um botão que popula o Firestore a partir das constantes locais de dados do projeto de forma automática.

### ⚡ Consumo Dinâmico com Fallback Seguro
* Atualizamos as páginas [Home.tsx](file:///home/artz/Documentos/Antigravity/site-ingrid-sinkovitz/src/pages/Home.tsx), [ProjectDetail.tsx](file:///home/artz/Documentos/Antigravity/site-ingrid-sinkovitz/src/pages/ProjectDetail.tsx), [Services.tsx](file:///home/artz/Documentos/Antigravity/site-ingrid-sinkovitz/src/pages/Services.tsx) e [About.tsx](file:///home/artz/Documentos/Antigravity/site-ingrid-sinkovitz/src/pages/About.tsx) para carregar os dados de forma assíncrona do Firestore.
* Se o banco estiver offline ou vazio (antes do seeding), a lógica carrega automaticamente os fallbacks locais, mantendo o site funcional.

### 🚀 Deploy Automatizado (Um Clique)
* **Script de Deploy ([deploy.sh](file:///home/artz/Documentos/Antigravity/site-ingrid-sinkovitz/deploy.sh)):** Automatiza a compilação (`npm run build`), faz commit com data/hora, envia para o GitHub (`git push`), faz deploy no Firebase Hosting, emite notificações nativas e abre o navegador.
* **Lançador na Área de Trabalho ([install_launcher.py](file:///home/artz/Documentos/Antigravity/site-ingrid-sinkovitz/install_launcher.py)):** Atalho que abre um console para acompanhar o progresso em um clique.

### 🐛 Ajuste Fino de Layout (Mobile Overflow)
* Corrigimos um problema de deslocamento horizontal para a direita nas telas menores. O título "SERVIÇOS & ENTREGAS" em [Services.tsx](file:///home/artz/Documentos/Antigravity/site-ingrid-sinkovitz/src/pages/Services.tsx#L44) possuía a classe `whitespace-nowrap lg:whitespace-normal` invertida. Agora ela está definida como `whitespace-normal lg:whitespace-nowrap`, permitindo quebra de linha em celulares/tablets e linha única apenas no desktop.

---

## 3. Arquivos Importantes para Inspecionar
* `src/firebase.ts` — Inicialização do Firebase SDK.
* `src/App.tsx` — Roteamento das páginas com React Router v7 e lógica do Gatekeeper.
* `src/pages/Maintenance.tsx` — Tela de manutenção com modal de login oculto.
* `src/pages/AdminDashboard.tsx` — Painel administrativo com Seeding e upload client-side convertendo para WebP.
* `src/pages/Services.tsx` — Exibição de serviços integrada ao Firestore com fallback.
* `deploy.sh` — Script automatizado de deploy.

---

## 4. Backlog de Próximos Passos (Para a próxima sessão)
1. **Paleta de Cores Definitiva:**
   * O usuário mencionou que a paleta de cores final será fornecida depois. Quando ele a passar, os valores hexadecimais devem ser atualizados nas variáveis do Tailwind v4 localizadas no arquivo [index.css](file:///home/artz/Documentos/Antigravity/site-ingrid-sinkovitz/src/index.css).
2. **Revisões de Estética e Copy:**
   * Verificar se Ingrid quer ajustar algum dos textos do Firestore ou posições dos blocos nas páginas.
3. **Validação do Seeding Completo em Produção:**
   * O seeding já foi efetuado, mas se forem adicionados novos campos no Firestore ou novas mídias via painel, garantir que elas estejam sob o diretório `v3/` no Storage para preservar os arquivos das versões antigas (2.0) que estão em backup.

---
*Assinado: Agente Lincoln — 16 de Julho de 2026.*
