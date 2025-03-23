# Módulo de Comunicação

Este pacote contém uma versão distribuível do Módulo de Comunicação.

## Requisitos

- Node.js 18.x ou superior
- NPM 9.x ou superior

## Instalação

1. Descompacte o arquivo em um diretório de sua escolha
2. Certifique-se de que o arquivo `.env` está configurado corretamente
3. Execute o script de inicialização:

```bash
node start.js
```

Este script irá:
- Verificar e instalar as dependências necessárias (se não encontradas)
- Verificar a existência do arquivo .env
- Iniciar a aplicação

## Configuração

Verifique se o arquivo `.env` contém todas as variáveis de ambiente necessárias:

- `NEXT_PUBLIC_SUPABASE_URL`: URL da sua instância Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave anônima do Supabase
- Outras variáveis específicas da aplicação

## Problemas Comuns

### Erro de conexão com o banco de dados

Verifique se as credenciais do Supabase estão corretas no arquivo `.env`.

### Aplicação não inicia

Verifique se todas as dependências foram instaladas corretamente:

```bash
npm install
```

### Portas já em uso

Por padrão, a aplicação utiliza a porta 3000. Se esta porta já estiver em uso, você pode modificá-la configurando a variável de ambiente `PORT` no arquivo `.env`:

```
PORT=3001
```

## Suporte

Para suporte adicional, entre em contato com a equipe de desenvolvimento. 