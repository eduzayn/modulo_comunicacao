const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Cores para saída no console
const colors = {
  blue: '\x1b[34m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

// Função para executar comandos com log colorido
function execute(command, message) {
  console.log(`${colors.blue}${message}${colors.reset}`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`${colors.green}Comando executado com sucesso!${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}Erro ao executar comando: ${error.message}${colors.reset}`);
    return false;
  }
}

// Verificar se node_modules existe
if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log(`${colors.yellow}Diretório node_modules não encontrado. Instalando dependências...${colors.reset}`);
  if (!execute('npm install', 'Instalando dependências...')) {
    process.exit(1);
  }
}

// Verificar se o arquivo .env existe
if (!fs.existsSync(path.join(__dirname, '.env'))) {
  console.log(`${colors.yellow}Arquivo .env não encontrado. Verificando .env.example...${colors.reset}`);
  
  if (fs.existsSync(path.join(__dirname, '.env.example'))) {
    fs.copyFileSync(path.join(__dirname, '.env.example'), path.join(__dirname, '.env'));
    console.log(`${colors.green}Arquivo .env criado a partir do .env.example${colors.reset}`);
    console.log(`${colors.yellow}ATENÇÃO: Verifique e atualize as variáveis de ambiente no arquivo .env${colors.reset}`);
  } else {
    console.log(`${colors.red}Arquivo .env.example não encontrado. Crie manualmente um arquivo .env com as variáveis necessárias.${colors.reset}`);
  }
}

// Iniciar a aplicação
console.log(`${colors.blue}Iniciando aplicação...${colors.reset}`);
execute('npm run start', 'Executando aplicação...'); 