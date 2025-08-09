#!/bin/bash

set -e  # Para o script se qualquer comando falhar

# Detectar se usa docker-compose (legacy) ou docker compose (novo CLI plugin)
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    echo "❌ Nem 'docker-compose' nem 'docker compose' encontrados. Instale o Docker Compose."
    exit 1
fi

echo "🔧 Starting services: MySQL, PostgreSQL, and Trino..."
$DOCKER_COMPOSE up -d
echo "✅ Services started successfully."

# Função para parar containers ao receber sinal de interrupção
cleanup() {
  echo ""
  echo "🛑 Stopping Docker services..."
  $DOCKER_COMPOSE down
  echo "✅ Services stopped."
  exit 0
}

# Capturar sinais de interrupção (Ctrl+C) ou erros
trap cleanup INT TERM ERR

sleep 10  # Espera para garantir que os serviços subam

# Iniciar aplicação Node.js
echo "🚀 Starting Node.js application..."
cd app
npm install
npm start

