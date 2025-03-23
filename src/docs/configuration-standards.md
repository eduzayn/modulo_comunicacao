# Padrões de Configuração - Módulo Comunicação

Este documento estabelece os padrões para arquivos de configuração no projeto, eliminando duplicações e padronizando o formato dos arquivos.

## Problema

Atualmente, o projeto contém múltiplos arquivos de configuração para a mesma ferramenta, o que causa problemas como:

1. Configurações conflitantes
2. Dificuldade para determinar qual arquivo está sendo usado
3. Maior esforço de manutenção ao atualizar configurações
4. Confusão para novos desenvolvedores

## Arquivos de Configuração Padrão

Para padronizar o projeto, os seguintes arquivos de configuração são considerados os oficiais:

| Ferramenta | Arquivo Padrão | Formato | Justificativa |
|------------|----------------|---------|---------------|
| Next.js | `next.config.js` | CJS | Compatibilidade com todas as versões do Next.js e plugins de terceiros |
| ESLint | `.eslintrc.js` | CJS | Suporta comentários e permite configurações mais complexas |
| PostCSS | `postcss.config.js` | CJS | Compatibilidade com o ecossistema Tailwind e outros plugins |
| Jest | `jest.config.js` | CJS | Formato mais comum e bem suportado |
| TypeScript | `tsconfig.json` | JSON | Formato padrão para TypeScript |
| Tailwind | `tailwind.config.ts` | TS | Melhor suporte a tipos e autocompletion |
| Playwright | `playwright.config.ts` | TS | Formato recomendado pelo Playwright |

## Arquivos Depreciados

Os seguintes arquivos estão depreciados e serão removidos:

- `next.config.ts` - Substituído por `next.config.js`
- `next.config.mjs` - Substituído por `next.config.js`
- `postcss.config.mjs` - Substituído por `postcss.config.js`
- `.eslintrc.json` - Substituído por `.eslintrc.js`
- `eslint.config.mjs` - Substituído por `.eslintrc.js`

## Processo de Migração

Para garantir uma transição suave, siga estas etapas:

1. Verifique se há configurações únicas nos arquivos depreciados que devem ser mescladas com o arquivo padrão.
2. Atualize o arquivo padrão para incluir todas as configurações necessárias.
3. Remova os arquivos depreciados.
4. Atualize a documentação conforme necessário.

## Configurações Atuais

### Next.js (next.config.js)

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['placehold.co', 'cloudflare-ipfs.com', 'images.unsplash.com'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
  poweredByHeader: false,
  generateEtags: false
};

module.exports = nextConfig;
```

### ESLint (.eslintrc.js)

```js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'filenames'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'import/no-anonymous-default-export': 'warn',
    'react/no-unescaped-entities': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'import/no-named-as-default': 'off',
    'filenames/match-regex': [
      'error',
      '^[a-z0-9\\-\\.]+$|^[A-Z][a-zA-Z0-9]+$',
      true
    ],
    'filenames/match-exported': ['error', 'pascal'],
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  overrides: [
    {
      files: ['**/use-*.ts', '**/use-*.tsx'],
      rules: {
        'filenames/match-regex': ['error', '^use-[a-z0-9\\-\\.]+$', true],
      },
    },
    {
      files: ['**/*.tsx'],
      excludedFiles: ['**/use-*.tsx', '**/*.test.tsx', '**/*.spec.tsx', '**/page.tsx', '**/layout.tsx', '**/error.tsx', '**/loading.tsx', '**/not-found.tsx'],
      rules: {
        'filenames/match-regex': ['error', '^[A-Z][a-zA-Z0-9]+$|^[a-z0-9\\-\\.]+$', true],
      },
    },
    {
      files: ['**/*.types.ts'],
      rules: {
        'filenames/match-regex': ['error', '^[a-z0-9\\-\\.]+\\.types$', true],
      },
    },
    {
      files: ['**/*.context.tsx'],
      rules: {
        'filenames/match-regex': ['error', '^[a-z0-9\\-\\.]+\\.context$', true],
      },
    },
  ],
};
```

### PostCSS (postcss.config.js)

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
``` 