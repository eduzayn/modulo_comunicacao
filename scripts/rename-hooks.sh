#!/bin/bash

# Script para renomear hooks do padrão camelCase para kebab-case
# Uso: ./rename-hooks.sh [diretório]

set -e

# Função para mostrar uso
usage() {
  echo "Uso: $0 [diretório]"
  echo "Exemplo: $0 ./src/hooks"
  exit 1
}

# Verificar parâmetros
if [ $# -eq 0 ]; then
  usage
fi

DIR=$1

# Verificar se o diretório existe
if [ ! -d "$DIR" ]; then
  echo "Erro: Diretório '$DIR' não encontrado."
  exit 1
fi

echo "Renomeando hooks no diretório $DIR..."

# Encontrar arquivos com padrão useXXX.ts
find "$DIR" -name "use[A-Z]*.ts" | while read -r file; do
  # Extrair nome base do arquivo
  basename=$(basename "$file")
  dirname=$(dirname "$file")
  
  # Remover extensão
  filename="${basename%.ts}"
  
  # Converter camelCase para kebab-case
  # 1. Adicionar hífen antes de cada letra maiúscula
  # 2. Converter para minúsculas
  kebab_name=$(echo "$filename" | sed 's/use\([A-Z]\)/use-\1/g' | sed 's/\([A-Z]\)/-\1/g' | tr '[:upper:]' '[:lower:]')
  
  # Novo caminho de arquivo
  new_file="$dirname/$kebab_name.ts"
  
  if [ "$file" != "$new_file" ]; then
    echo "Renomeando: $file -> $new_file"
    git mv "$file" "$new_file"
    
    # Opcionalmente, atualizar importações
    # echo "Atualizando importações..."
    # grep -r "from.*$filename" --include="*.ts" --include="*.tsx" ./src | cut -d: -f1 | xargs -I{} sed -i "s/from.*$filename/from '..\/..\/hooks\/$kebab_name'/g" {}
  fi
done

echo "Concluído!" 