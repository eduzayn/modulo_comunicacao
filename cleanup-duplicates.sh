#!/bin/bash

# Script para limpar estruturas duplicadas no sistema
echo "Iniciando limpeza de estruturas duplicadas..."

# 1. Providers duplicados
echo "Removendo providers duplicados..."
rm -f src/providers/ReactQueryProvider.tsx
rm -f src/providers/QueryProvider.tsx

# 2. Hooks duplicados
echo "Removendo hooks duplicados..."
rm -rf src/components/hooks

# 3. Providers em locais duplicados
echo "Consolidando providers..."
mv src/components/providers/colors.ts src/contexts/
mv src/components/providers/AccessibilityProvider.tsx src/contexts/
rm -rf src/components/providers

# 4. Diretórios duplicados
echo "Removendo diretórios duplicados..."
rm -rf src/shared
rm -rf src/modules

# 5. Arquivos SQL duplicados
echo "Removendo arquivos SQL duplicados..."
rm -f check_table_exists.sql

# 6. Diretórios de build redundantes
echo "Removendo diretórios de build redundantes..."
rm -rf static-build

# 7. Padronização de nomenclatura
echo "Padronizando nomenclatura..."
rm -rf src/app/access-denied
rm -rf src/app/communication

# 8. Organizando documentação
echo "Organizando documentação..."
mkdir -p docs
mv *.md docs/ 2>/dev/null
mv README.md ./
mv docs/MIGRATION.md ./

echo "Limpeza concluída!" 