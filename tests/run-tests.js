const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Carrega as variáveis de ambiente
dotenv.config({ path: path.resolve(__dirname, '..', '.env.test') });

// Obtém argumentos da linha de comando
const args = process.argv.slice(2);
const testType = args[0] || 'all'; // Tipo de teste a executar

// Define o caminho e argumentos para os testes
let testPath = '.';
let additionalArgs = [];

switch (testType) {
  case 'auth':
    testPath = 'tests/auth.spec.ts';
    break;
  case 'inbox':
    testPath = 'tests/inbox.spec.ts';
    break;
  case 'setup':
    testPath = 'tests/auth.setup.ts';
    break;
  case 'ui':
    additionalArgs.push('--ui');
    break;
  case 'debug':
    additionalArgs.push('--debug');
    break;
  case 'headed':
    additionalArgs.push('--headed');
    break;
  case 'report':
    additionalArgs.push('--reporter=html');
    break;
}

// Verifica se o diretório de fixtures existe
const fixturesDir = path.join(__dirname, 'fixtures');
if (!fs.existsSync(fixturesDir)) {
  fs.mkdirSync(fixturesDir, { recursive: true });
}

// Executa os testes
const command = 'npx';
const commandArgs = ['playwright', 'test', testPath, ...additionalArgs];

console.log(`Executando: ${command} ${commandArgs.join(' ')}`);

const testProcess = spawn(command, commandArgs, {
  stdio: 'inherit',
  shell: true
});

testProcess.on('close', (code) => {
  if (code !== 0) {
    console.error(`Os testes falharam com código de saída ${code}`);
  }
  
  if (testType === 'report' || args.includes('--report')) {
    // Abre o relatório ao finalizar se for o comando de relatório
    spawn('npx', ['playwright', 'show-report'], {
      stdio: 'inherit',
      shell: true
    });
  }
  
  process.exit(code);
}); 