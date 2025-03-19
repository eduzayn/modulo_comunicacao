// Edunexia Color System
export const colors = {
  // Primary colors for each module
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  // Neutral colors (shared across modules)
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  // Semantic colors (shared across modules)
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
};

// CSS Variables for use in Tailwind CSS
export const cssVariables = {
  // Primary colors
  '--color-communication-light': colors.primary.communication.light,
  '--color-communication-main': colors.primary.communication.main,
  '--color-communication-dark': colors.primary.communication.dark,
  '--color-communication-gradient': colors.primary.communication.gradient,
  
  '--color-student-light': colors.primary.student.light,
  '--color-student-main': colors.primary.student.main,
  '--color-student-dark': colors.primary.student.dark,
  '--color-student-gradient': colors.primary.student.gradient,
  
  '--color-content-light': colors.primary.content.light,
  '--color-content-main': colors.primary.content.main,
  '--color-content-dark': colors.primary.content.dark,
  '--color-content-gradient': colors.primary.content.gradient,
  
  '--color-enrollment-light': colors.primary.enrollment.light,
  '--color-enrollment-main': colors.primary.enrollment.main,
  '--color-enrollment-dark': colors.primary.enrollment.dark,
  '--color-enrollment-gradient': colors.primary.enrollment.gradient,
  
  // Neutral colors
  '--color-neutral-50': colors.neutral[50],
  '--color-neutral-100': colors.neutral[100],
  '--color-neutral-200': colors.neutral[200],
  '--color-neutral-300': colors.neutral[300],
  '--color-neutral-400': colors.neutral[400],
  '--color-neutral-500': colors.neutral[500],
  '--color-neutral-600': colors.neutral[600],
  '--color-neutral-700': colors.neutral[700],
  '--color-neutral-800': colors.neutral[800],
  '--color-neutral-900': colors.neutral[900],
  
  // Semantic colors
  '--color-success': colors.semantic.success,
  '--color-warning': colors.semantic.warning,
  '--color-error': colors.semantic.error,
  '--color-info': colors.semantic.info,
};

// Helper function to get module color
export const getModuleColor = (module: 'communication' | 'student' | 'content' | 'enrollment', variant: 'light' | 'main' | 'dark' | 'gradient' = 'main') => {
  return colors.primary[module][variant];
};

// Helper function to get semantic color
export const getSemanticColor = (type: 'success' | 'warning' | 'error' | 'info') => {
  return colors.semantic[type];
};

// Helper function to get neutral color
export const getNeutralColor = (shade: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900) => {
  return colors.neutral[shade];
};
