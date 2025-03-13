// Funções de autenticação
function checkAuth() {
  const userData = JSON.parse(localStorage.getItem('edunexia_user') || '{}');
  return userData.isAuthenticated === true;
}

function login(email, password) {
  // Mock de autenticação para testes
  if ((email === 'admin@edunexia.com' && password === 'admin123') || 
      (email === 'user@edunexia.com' && password === 'user123')) {
    
    const userRole = email.includes('admin') ? 'admin' : 'user';
    const userData = {
      email: email,
      name: userRole === 'admin' ? 'Administrador' : 'Usuário',
      role: userRole,
      isAuthenticated: true
    };
    
    localStorage.setItem('edunexia_user', JSON.stringify(userData));
    return true;
  }
  return false;
}

function logout() {
  localStorage.removeItem('edunexia_user');
  window.location.href = '/login.html';
}

// Funções de navegação
function navigateTo(page) {
  if (!checkAuth() && page !== 'login.html') {
    window.location.href = '/login.html';
    return;
  }
  
  window.location.href = '/' + page;
}

// Inicialização da página
function initPage() {
  const currentPage = window.location.pathname.split('/').pop();
  
  // Redirecionar para login se não estiver autenticado
  if (!checkAuth() && currentPage !== 'login.html' && currentPage !== 'index.html') {
    window.location.href = '/login.html';
    return;
  }
  
  // Redirecionar para dashboard se já estiver autenticado e tentar acessar login
  if (checkAuth() && (currentPage === 'login.html' || currentPage === 'index.html')) {
    window.location.href = '/dashboard.html';
    return;
  }
  
  // Inicializar elementos específicos da página
  if (currentPage === 'login.html') {
    initLoginPage();
  } else if (currentPage === 'dashboard.html') {
    initDashboardPage();
  }
}

function initLoginPage() {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      if (login(email, password)) {
        window.location.href = '/dashboard.html';
      } else {
        alert('Credenciais inválidas. Por favor, use as credenciais de teste fornecidas.');
      }
    });
  }
}

function initDashboardPage() {
  const userData = JSON.parse(localStorage.getItem('edunexia_user') || '{}');
  const userRoleElement = document.getElementById('userRole');
  
  if (userRoleElement) {
    userRoleElement.textContent = userData.role === 'admin' ? 'Administrador' : 'Usuário';
  }
  
  // Configurar navegação entre seções
  const sectionLinks = document.querySelectorAll('nav a');
  const sections = document.querySelectorAll('.section-content');
  const sectionTitle = document.getElementById('sectionTitle');
  
  sectionLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const sectionId = this.getAttribute('data-section');
      
      // Esconder todas as seções
      sections.forEach(section => {
        section.classList.add('hidden');
      });
      
      // Remover classe ativa de todos os links
      sectionLinks.forEach(link => {
        link.classList.remove('bg-blue-700');
      });
      
      // Mostrar seção selecionada
      document.getElementById(sectionId).classList.remove('hidden');
      
      // Adicionar classe ativa ao link clicado
      this.classList.add('bg-blue-700');
      
      // Atualizar título da seção
      if (sectionTitle) {
        sectionTitle.textContent = this.textContent.trim();
      }
    });
  });
  
  // Configurar botão de logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
}

// Função auxiliar para selecionar botões pelo texto
function getButtonByText(text) {
  const buttons = document.querySelectorAll('button');
  for (let button of buttons) {
    if (button.textContent.trim().includes(text)) {
      return button;
    }
  }
  return null;
}

// Funções para modais
function openModal(modalId) {
  document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
}

// Inicializar modais e botões
function initModals() {
  // Template Modal
  const newTemplateBtn = getButtonByText('Novo Template');
  const closeTemplateModal = document.getElementById('closeTemplateModal');
  const cancelTemplateBtn = document.getElementById('cancelTemplateBtn');
  const newTemplateForm = document.getElementById('newTemplateForm');
  
  if (newTemplateBtn) {
    newTemplateBtn.addEventListener('click', function() {
      openModal('newTemplateModal');
    });
  }
  
  if (closeTemplateModal) {
    closeTemplateModal.addEventListener('click', function() {
      closeModal('newTemplateModal');
    });
  }
  
  if (cancelTemplateBtn) {
    cancelTemplateBtn.addEventListener('click', function() {
      closeModal('newTemplateModal');
    });
  }
  
  if (newTemplateForm) {
    newTemplateForm.addEventListener('submit', function(e) {
      e.preventDefault();
      // Aqui seria implementada a lógica para salvar o template
      alert('Template salvo com sucesso!');
      closeModal('newTemplateModal');
    });
  }
  
  // Channel Modal
  const newChannelBtn = getButtonByText('Configurar Novo Canal');
  const closeChannelModal = document.getElementById('closeChannelModal');
  const cancelChannelBtn = document.getElementById('cancelChannelBtn');
  const newChannelForm = document.getElementById('newChannelForm');
  const channelType = document.getElementById('channelType');
  
  if (newChannelBtn) {
    newChannelBtn.addEventListener('click', function() {
      openModal('newChannelModal');
    });
  }
  
  if (closeChannelModal) {
    closeChannelModal.addEventListener('click', function() {
      closeModal('newChannelModal');
    });
  }
  
  if (cancelChannelBtn) {
    cancelChannelBtn.addEventListener('click', function() {
      closeModal('newChannelModal');
    });
  }
  
  if (newChannelForm) {
    newChannelForm.addEventListener('submit', function(e) {
      e.preventDefault();
      // Aqui seria implementada a lógica para salvar o canal
      alert('Canal configurado com sucesso!');
      closeModal('newChannelModal');
    });
  }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  initPage();
  
  // Remover scripts inline e usar apenas o script.js para inicialização
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Atualizar o display do papel do usuário
  const userData = JSON.parse(localStorage.getItem('edunexia_user') || '{}');
  const userRoleElement = document.getElementById('userRole');
  if (userRoleElement) {
    userRoleElement.textContent = userData.role === 'admin' ? 'Administrador' : 'Usuário';
  }
  
  // Configurar botão de logout em todas as páginas
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      localStorage.removeItem('edunexia_user');
      window.location.href = '/login.html';
    });
  }
  
  // Inicializar modais em todas as páginas
  initModals();
});
