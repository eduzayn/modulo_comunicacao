// Cores do sistema
export const colors = {
  primary: {
    DEFAULT: 'hsl(222.2 47.4% 11.2%)',
    foreground: 'hsl(210 40% 98%)',
  },
  muted: {
    DEFAULT: 'hsl(210 40% 96.1%)',
    foreground: 'hsl(215.4 16.3% 46.9%)',
  },
  accent: {
    DEFAULT: 'hsl(210 40% 96.1%)',
    foreground: 'hsl(222.2 47.4% 11.2%)',
  },
}

// Espaçamentos
export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '2.5rem',  // 40px
  '3xl': '3rem',    // 48px
}

// Tamanhos de fonte
export const fontSize = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
}

// Larguras
export const sizes = {
  sidebar: '240px',
  chatList: '320px',
  details: '320px',
}

// Status de usuário
export const userStatus = {
  online: {
    color: 'hsl(142.1 76.2% 36.3%)',
    text: 'Online',
  },
  offline: {
    color: 'hsl(0 84.2% 60.2%)',
    text: 'Offline',
  },
  away: {
    color: 'hsl(48 96.5% 53.9%)',
    text: 'Ausente',
  },
}

// Prioridades
export const priorities = {
  low: {
    color: 'hsl(142.1 76.2% 36.3%)',
    text: 'Baixa',
  },
  medium: {
    color: 'hsl(48 96.5% 53.9%)',
    text: 'Média',
  },
  high: {
    color: 'hsl(0 84.2% 60.2%)',
    text: 'Alta',
  },
}

// Layout
export const layout = {
  maxWidth: '1920px',
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    full: '9999px',
  },
  zIndex: {
    modal: 50,
    dropdown: 40,
    header: 30,
    sidebar: 20,
    base: 10,
  },
} 