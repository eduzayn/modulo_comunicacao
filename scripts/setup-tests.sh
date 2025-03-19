#!/bin/bash

# Instala as dependências do Playwright
npm install -D @playwright/test @types/node

# Instala os navegadores necessários
npx playwright install chromium

# Cria diretório para os testes se não existir
mkdir -p e2e/setup

# Copia arquivos de ambiente
cp .env.local .env.test

# Instala outras dependências necessárias
npm install recharts @types/recharts
npm install @supabase/supabase-js
npm install openai ai

echo "✓ Ambiente de testes configurado com sucesso!" 