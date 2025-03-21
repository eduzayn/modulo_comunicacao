// Configuração consolidada do PostCSS
// Combine as configurações de postcss.config.js e postcss.config.mjs
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // Inclua aqui quaisquer outros plugins necessários
    // '@tailwindcss/postcss' foi mencionado em postcss.config.mjs, mas parece ser um erro
    // já que o plugin correto do Tailwind já está incluído acima
  },
}
