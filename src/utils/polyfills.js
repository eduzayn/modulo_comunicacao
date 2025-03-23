// Polyfills para o ambiente do servidor Next.js
if (typeof self === 'undefined') {
  // eslint-disable-next-line no-global-assign
  global.self = global;
}

if (typeof window === 'undefined') {
  // eslint-disable-next-line no-global-assign
  global.window = global;
}

// Polyfill para exports
if (typeof exports === 'undefined') {
  global.exports = {};
}

if (typeof document === 'undefined') {
  global.document = {
    createElement: () => ({}),
    getElementsByTagName: () => [],
    querySelector: () => null,
    querySelectorAll: () => [],
    documentElement: {
      style: {},
      setAttribute: () => {},
      getAttribute: () => null,
      removeAttribute: () => {},
      appendChild: () => {},
      removeChild: () => {},
      contains: () => false,
    },
    createEvent: () => ({
      initEvent: () => {},
    }),
    addEventListener: () => {},
    removeEventListener: () => {},
    body: {
      appendChild: () => {},
      removeChild: () => {},
    },
  };
}

// Adição para localStorage e sessionStorage
if (typeof localStorage === 'undefined') {
  global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    length: 0
  };
}

if (typeof sessionStorage === 'undefined') {
  global.sessionStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    length: 0
  };
}

// Adição para navigator
if (typeof navigator === 'undefined') {
  global.navigator = {
    userAgent: 'node',
    language: 'pt-BR',
    languages: ['pt-BR'],
    appName: 'Node.js',
    appVersion: process.version,
    platform: process.platform,
    onLine: true,
    cookieEnabled: false,
    doNotTrack: '1',
    javaEnabled: () => false,
  };
}

// Polyfill para URL global
if (typeof URL === 'undefined' && typeof require !== 'undefined') {
  const { URL } = require('url');
  global.URL = URL;
}

// Polyfill para eventos DOM básicos
if (typeof Event === 'undefined') {
  global.Event = function Event(type, eventInitDict) {
    this.type = type;
    this.bubbles = eventInitDict?.bubbles || false;
    this.cancelable = eventInitDict?.cancelable || false;
  };
}

// Polyfill para Fetch se não estiver disponível
if (typeof fetch === 'undefined' && typeof require !== 'undefined') {
  // Usar node-fetch no ambiente Node.js
  try {
    const nodeFetch = require('node-fetch');
    global.fetch = nodeFetch;
    global.Headers = nodeFetch.Headers;
    global.Request = nodeFetch.Request;
    global.Response = nodeFetch.Response;
  } catch (err) {
    // Silenciar erro se node-fetch não estiver disponível
    console.warn('node-fetch não está disponível para polyfill de fetch');
  }
}

// History API stub
if (typeof history === 'undefined') {
  global.history = {
    scrollRestoration: 'auto',
    state: null,
    length: 1,
    pushState: () => {},
    replaceState: () => {},
    go: () => {},
    back: () => {},
    forward: () => {},
  };
}

// Console.error patch para evitar crashes em determinados ambientes
if (typeof console !== 'undefined' && console.error) {
  const originalConsoleError = console.error;
  console.error = function(...args) {
    // Ignorar erros específicos que podem quebrar o SSR
    if (args.length > 0 && typeof args[0] === 'string' && 
        (args[0].includes('Warning: Text content') || 
         args[0].includes('hydration') ||
         args[0].includes('React.Children.only'))) {
      return;
    }
    originalConsoleError.apply(console, args);
  };
} 