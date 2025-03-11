/**
 * Edunéxia Communication Module Color System
 * 
 * This file defines the color palette for the Edunéxia Communication Module.
 * The palette is based on a blue, black, and white color scheme with gradients
 * for depth and modern aesthetics.
 */

export const colors = {
  // Primary colors
  primary: {
    50: '#e6f1ff',
    100: '#cce3ff',
    200: '#99c7ff',
    300: '#66aaff',
    400: '#338eff',
    500: '#0072ff', // Main primary color
    600: '#005bd9',
    700: '#0044b3',
    800: '#002e8c',
    900: '#001766',
  },
  
  // Secondary colors
  secondary: {
    50: '#e6f9ff',
    100: '#ccf3ff',
    200: '#99e7ff',
    300: '#66dbff',
    400: '#33cfff',
    500: '#00c3ff', // Main secondary color
    600: '#009cc9',
    700: '#007594',
    800: '#004e5f',
    900: '#00272a',
  },
  
  // Neutral colors
  neutral: {
    50: '#f8f9fa',
    100: '#f1f3f5',
    200: '#e9ecef',
    300: '#dee2e6',
    400: '#ced4da',
    500: '#adb5bd',
    600: '#6c757d',
    700: '#495057',
    800: '#343a40',
    900: '#212529', // Near black
  },
  
  // Accent colors
  accent: {
    blue: '#0072ff',
    teal: '#00c3ff',
    purple: '#6e56cf',
    indigo: '#4263eb',
    cyan: '#0dcaf0',
  },
  
  // Semantic colors
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  
  // Gradient definitions
  gradients: {
    primary: 'linear-gradient(135deg, #0072ff 0%, #00c3ff 100%)',
    dark: 'linear-gradient(135deg, #212529 0%, #343a40 100%)',
    card: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    accent: 'linear-gradient(135deg, #0072ff 0%, #6e56cf 100%)',
  },
  
  // Pure colors
  white: '#ffffff',
  black: '#000000',
};

export default colors;
