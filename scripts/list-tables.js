const https = require('https');

// Configuração do Supabase
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uasnyifizdjxogowijip.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjMyMiwiZXhwIjoyMDU3MTYyMzIyfQ.MAp_vHBYhYj32rL3ALKFA919bY2EL-9fAmpI6-qg0bs';

if (!SUPABASE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY não encontrada.');
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

// Lista as tabelas do esquema "communication"
async function listTables() {
  try {
    console.log('Listando tabelas do esquema "communication"...');
    
    // Primeiro, tentar criar a função execute_sql se não existir
    try {
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
      console.log('Função execute_sql criada ou já existente.');
    } catch (error) {
      console.warn('Aviso ao criar função execute_sql:', error.message);
    }
    
    // Listar tabelas
    const listTablesSQL = `
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name LIKE 'communication.%'
    ORDER BY table_name;
    `;
    
    const result = await executeSQL(listTablesSQL);
    console.log('Tabelas encontradas:');
    console.log(result);
    
    // Verificar especificamente as tabelas de widget
    const widgetTables = [
      'communication.widget_settings',
      'communication.widget_form_fields',
      'communication.widget_domains'
    ];
    
    for (const table of widgetTables) {
      const checkTableSQL = `
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = '${table}'
      ) as exists;
      `;
      
      const tableExists = await executeSQL(checkTableSQL);
      console.log(`Tabela ${table} existe:`, tableExists);
    }
  } catch (error) {
    console.error('Erro ao listar tabelas:', error.message);
  }
}

listTables(); 