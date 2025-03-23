const https = require('https');

// Configuração do Supabase
const SUPABASE_URL = 'https://uasnyifizdjxogowijip.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjMyMiwiZXhwIjoyMDU3MTYyMzIyfQ.MAp_vHBYhYj32rL3ALKFA919bY2EL-9fAmpI6-qg0bs';

// Função para fazer requisição GET à API REST do Supabase
function makeRequest(path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'uasnyifizdjxogowijip.supabase.co',
      port: 443,
      path,
      method,
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
          console.error(`Status: ${res.statusCode}`, data);
          reject(new Error(`Erro HTTP: ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('Erro na requisição:', error);
      reject(error);
    });
    
    req.end();
  });
}

// Verifica se o widget existe tentando obter registros da tabela
async function checkWidgetTablesExist() {
  try {
    console.log('Verificando se as tabelas de widget existem...');
    
    // Tenta buscar registros da tabela communication.widget_settings
    try {
      const result = await makeRequest('/rest/v1/communication.widget_settings?limit=1');
      if (Array.isArray(result)) {
        console.log('Tabela communication.widget_settings existe!');
        return true;
      }
    } catch (error) {
      console.log('Tabela communication.widget_settings NÃO existe ou ocorreu um erro:', error.message);
    }
    
    // Tenta buscar registros da tabela communication.widget_form_fields
    try {
      const result = await makeRequest('/rest/v1/communication.widget_form_fields?limit=1');
      if (Array.isArray(result)) {
        console.log('Tabela communication.widget_form_fields existe!');
        return true;
      }
    } catch (error) {
      console.log('Tabela communication.widget_form_fields NÃO existe ou ocorreu um erro:', error.message);
    }

    // Tenta buscar registros da tabela communication.widget_domains
    try {
      const result = await makeRequest('/rest/v1/communication.widget_domains?limit=1');
      if (Array.isArray(result)) {
        console.log('Tabela communication.widget_domains existe!');
        return true;
      }
    } catch (error) {
      console.log('Tabela communication.widget_domains NÃO existe ou ocorreu um erro:', error.message);
    }
    
    console.log('Verificação concluída.');
    
  } catch (error) {
    console.error('Erro ao verificar tabelas:', error.message);
  }
}

checkWidgetTablesExist(); 