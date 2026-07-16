#!/bin/bash
# Garante que o script rode a partir do diretorio onde ele esta localizado
cd "$(dirname "$0")" || { echo "❌ ERRO: Nao foi possivel acessar a pasta do projeto!"; exit 1; }

echo "🚀 INICIANDO DEPLOY AUTOMÁTICO — PORTFÓLIO INGRID SINKOVITZ"
echo "------------------------------------------------------------"

# Notificação local de início
if command -v notify-send >/dev/null 2>&1; then
    notify-send "Portfólio Ingrid" "Iniciando deploy automático no Firebase..."
fi

# 1. Compilação local do site
echo "📦 1. Compilando aplicação React (Vite)..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ ERRO: Falha ao compilar a aplicação (npm run build)."
    if command -v notify-send >/dev/null 2>&1; then
        notify-send "Portfólio Ingrid" "Erro na compilação do build! Verifique o terminal."
    fi
    if [ -t 0 ]; then
      read -p "Pressione [Enter] para fechar..."
    fi
    exit 1
fi
echo "✅ Compilação concluída com sucesso."

# 2. Git Commit & Push
echo "📦 2. Enviando alterações locais para o GitHub..."
git add .
if ! git diff-index --quiet HEAD --; then
    git commit -m "deploy: automatic sync $(date '+%Y-%m-%d %H:%M:%S')"
else
    echo "ℹ️ Nenhuma alteração pendente para commitar."
fi

git push
if [ $? -ne 0 ]; then
    echo "❌ ERRO: Falha ao enviar alterações para o GitHub (git push). Verifique se há conflitos!"
    if command -v notify-send >/dev/null 2>&1; then
        notify-send "Portfólio Ingrid" "Erro no git push. Verifique o terminal."
    fi
    if [ -t 0 ]; then
      read -p "Pressione [Enter] para fechar..."
    fi
    exit 1
fi
echo "✅ Alterações enviadas com sucesso ao GitHub."

# 3. Deploy no Firebase Hosting
echo "🔥 3. Publicando no Firebase Hosting..."
npx firebase deploy --only hosting
if [ $? -ne 0 ]; then
    echo "❌ ERRO: Falha no deploy para o Firebase Hosting."
    if command -v notify-send >/dev/null 2>&1; then
        notify-send "Portfólio Ingrid" "Erro no deploy para o Firebase Hosting."
    fi
    if [ -t 0 ]; then
      read -p "Pressione [Enter] para fechar..."
    fi
    exit 1
fi

echo "------------------------------------------------------------"
echo "✅ DEPLOY CONCLUÍDO COM SUCESSO NO FIREBASE HOSTING E GITHUB!"
echo "------------------------------------------------------------"

if command -v notify-send >/dev/null 2>&1; then
    notify-send "Portfólio Ingrid" "Deploy concluído com sucesso!"
fi

# Abre o site no navegador padrão do sistema
if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "https://www.ingridsinkovitz.com.br" &
elif command -v firefox >/dev/null 2>&1; then
    firefox "https://www.ingridsinkovitz.com.br" &
fi

# Se estiver em terminal interativo, segura a janela aberta para leitura do log
if [ -t 0 ]; then
  echo ""
  read -p "Pressione [Enter] para fechar esta janela..."
fi
