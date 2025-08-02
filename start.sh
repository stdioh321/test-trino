#!/bin/bash

set -e  # Encerra o script se algum comando falhar

echo "🔧 Iniciando serviços: MySQL, PostgreSQL e Trino..."
docker-compose up -d
echo "✅ Serviços iniciados com sucesso."

# Define função para encerrar containers ao receber sinal de interrupção
cleanup() {
  echo ""
  echo "🛑 Encerrando serviços Docker..."
  docker-compose down
  echo "✅ Serviços finalizados."
  exit 0
}

# Captura sinais de interrupção (Ctrl+C) ou erro
trap cleanup INT TERM ERR

sleep 10  # Aguarda 10 segundos para garantir que os serviços sejam iniciados corretamente
# Inicia a aplicação Node
echo "🚀 Iniciando aplicação Node.js..."
echo "✅ Servidor Express rodando em http://localhost:3000"
echo "📌 Use os seguintes endpoints:"
echo "➡️  [GET] /generate - Gera leads e attendances"
echo "    Exemplo: curl http://localhost:3000/generate"
echo "➡️  [GET] /result   - Retorna dados combinados entre PostgreSQL e MySQL via Trino"
echo "    Exemplo: curl http://localhost:3000/result"

echo
{
  cd app
  npm install
  npm start
}
