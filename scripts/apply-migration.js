const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuração do Supabase
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uasnyifizdjxogowijip.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY não encontrada.');
  process.exit(1);
}

// Lê o arquivo de migração
const migrationPath = path.join(__dirname, '../supabase/migrations/20240320000001_create_widget_tables.sql');
let sql;

try {
  sql = fs.readFileSync(migrationPath, 'utf8');
} catch (error) {
  console.error(`Erro ao ler o arquivo de migração: ${error.message}`);
  process.exit(1);
}

// Função para executar SQL via API REST
function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const apiUrl = new URL(SUPABASE_URL);
    const hostname = apiUrl.hostname;
    
    const options = {
      hostname,
      port: 443,
      path: '/rest/v1/rpc/execute_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(data);
          }
        } else {
          reject(new Error(`Erro HTTP: ${res.statusCode} - ${data}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    const payload = JSON.stringify({
      sql,
      params: {}
    });
    
    req.write(payload);
    req.end();
  });
}

// Executa a migração
async function runMigration() {
  try {
    console.log('Aplicando migração...');
    const result = await executeSQL(sql);
    console.log('Migração aplicada com sucesso!');
    console.log(result);
  } catch (error) {
    console.error('Erro ao aplicar migração:', error.message);
    
    // Se a falha foi devido à função não existir, vamos criar uma função temporária para executar SQL
    if (error.message.includes('function') && error.message.includes('does not exist')) {
      try {
        console.log('Criando função para executar SQL...');
        const createFunctionSQL = `
        CREATE OR REPLACE FUNCTION execute_sql(sql text, params jsonb DEFAULT '{}'::jsonb)
        RETURNS jsonb
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          result jsonb;
        BEGIN
          EXECUTE sql INTO result;
          RETURN result;
        EXCEPTION
          WHEN OTHERS THEN
            RETURN jsonb_build_object(
              'error', SQLERRM,
              'detail', SQLSTATE
            );
        END;
        $$;
        `;
        
        await executeSQL(createFunctionSQL);
        console.log('Função criada, tentando executar migração novamente...');
        const result = await executeSQL(sql);
        console.log('Migração aplicada com sucesso!');
        console.log(result);
      } catch (innerError) {
        console.error('Erro ao criar função ou aplicar migração:', innerError.message);
      }
    }
  }
}

runMigration(); 