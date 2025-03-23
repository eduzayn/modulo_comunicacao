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

// Verificar se o diretório dist existe
if (!fs.existsSync(path.join(__dirname, 'dist'))) {
  console.error(`${colors.red}Diretório 'dist' não encontrado. Execute o processo de build primeiro.${colors.reset}`);
  process.exit(1);
}

// Ler o package.json para obter a versão
let version = '1.0.0';
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  version = packageJson.version;
} catch (error) {
  console.warn(`${colors.yellow}Não foi possível ler a versão do package.json: ${error.message}${colors.reset}`);
}

// Nome do arquivo de saída
const outputFile = `modulo-comunicacao-v${version}.zip`;

// Criar o arquivo ZIP
console.log(`${colors.blue}Empacotando diretório 'dist' para ${outputFile}...${colors.reset}`);

// Em Windows, podemos usar o comando zip se disponível, ou powershell
const isWindows = process.platform === 'win32';

if (isWindows) {
  // Tentar usar PowerShell para criar o ZIP
  const command = `powershell -Command "Compress-Archive -Path ./dist/* -DestinationPath ./${outputFile} -Force"`;
  if (!execute(command, 'Criando arquivo ZIP usando PowerShell...')) {
    console.error(`${colors.red}Falha ao criar o arquivo ZIP. Verifique se o PowerShell está instalado.${colors.reset}`);
    process.exit(1);
  }
} else {
  // Em sistemas Unix, usar o comando zip
  if (!execute(`zip -r ${outputFile} dist/`, 'Criando arquivo ZIP...')) {
    console.error(`${colors.red}Falha ao criar o arquivo ZIP. Verifique se o comando 'zip' está instalado.${colors.reset}`);
    process.exit(1);
  }
}

console.log(`${colors.green}Arquivo ${outputFile} criado com sucesso!${colors.reset}`);
console.log(`${colors.yellow}Instruções para implantação:${colors.reset}`);
console.log(`1. Descompacte o arquivo ${outputFile} no servidor de destino`);
console.log(`2. Navegue até o diretório extraído`);
console.log(`3. Execute 'node start.js' para iniciar a aplicação`); 