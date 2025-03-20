#!/bin/bash

# Script para verificar arquivos de configuração duplicados
# Uso: ./check-config-files.sh

# Diretório atual
DIR="$(pwd)"

# Lista de padrões a serem verificados
declare -A CONFIG_PATTERNS=(
  ["next"]="next.config.*"
  ["eslint"]=".eslintrc.*"
  ["postcss"]="postcss.config.*"
  ["jest"]="jest.config.*"
  ["tsconfig"]="tsconfig*.json"
  ["tailwind"]="tailwind.config.*"
  ["prettier"]=".prettier*"
)

# Arquivos padrão aceitos
declare -A STANDARD_FILES=(
  ["next"]="next.config.js"
  ["eslint"]=".eslintrc.js"
  ["postcss"]="postcss.config.js"
  ["jest"]="jest.config.js"
  ["tsconfig"]="tsconfig.json"
  ["tailwind"]="tailwind.config.ts"
  ["prettier"]=".prettierrc"
)

echo "Verificando arquivos de configuração duplicados em $DIR..."
echo "======================================================================================"
echo "Arquivos padrão aceitos:"
for tool in "${!STANDARD_FILES[@]}"; do
  echo "  - ${STANDARD_FILES[$tool]} (${tool})"
done
echo "======================================================================================"

# Verificar cada padrão
for tool in "${!CONFIG_PATTERNS[@]}"; do
  pattern="${CONFIG_PATTERNS[$tool]}"
  standard="${STANDARD_FILES[$tool]}"
  
  echo "Verificando $tool (padrão: $standard)..."
  
  # Encontrar todos os arquivos correspondentes ao padrão
  files=$(find "$DIR" -maxdepth 1 -name "$pattern" | sort)
  
  if [ -z "$files" ]; then
    echo "  Nenhum arquivo encontrado para $tool"
    continue
  fi
  
  # Contar arquivos
  file_count=$(echo "$files" | wc -l)
  
  if [ "$file_count" -gt 1 ]; then
    echo "  ❌ DUPLICADOS ENCONTRADOS para $tool:"
    while IFS= read -r file; do
      filename=$(basename "$file")
      if [ "$filename" == "$standard" ]; then
        echo "    - $filename (PADRÃO ✓)"
      else
        echo "    - $filename (deve ser removido ou mesclado com $standard)"
      fi
    done <<< "$files"
  else
    filename=$(basename "$(echo "$files")")
    if [ "$filename" == "$standard" ]; then
      echo "  ✅ OK - $filename"
    else
      echo "  ⚠️ AVISO - $filename encontrado, mas o padrão é $standard"
    fi
  fi
done

echo "======================================================================================"
echo "Verificação concluída."
echo "Consulte src/docs/configuration-standards.md para mais informações sobre os padrões de configuração." 