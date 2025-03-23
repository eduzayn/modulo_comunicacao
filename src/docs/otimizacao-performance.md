# Otimização de Performance

Este documento descreve as estratégias e técnicas implementadas para otimizar a performance do Módulo de Comunicação, com foco especial em melhorar métricas de Web Vitals e tempos de carregamento.

## Core Web Vitals

O projeto prioriza as três métricas principais de Core Web Vitals:

1. **LCP (Largest Contentful Paint)**: Tempo de renderização do maior elemento visível
2. **FID (First Input Delay)**: Tempo de resposta para a primeira interação do usuário
3. **CLS (Cumulative Layout Shift)**: Estabilidade visual durante o carregamento

### Metas de Performance

| Métrica | Meta    | Descrição                                     |
|---------|---------|-----------------------------------------------|
| LCP     | < 2.5s  | Maior elemento visível carregado rapidamente  |
| FID     | < 100ms | Resposta à interação do usuário quase imediata|
| CLS     | < 0.1   | Mínima mudança de layout durante carregamento |
| TTI     | < 3.8s  | Tempo até interatividade completa da página   |
| FCP     | < 1.8s  | Primeira renderização de qualquer conteúdo    |

## Estratégias de Otimização

### 1. Server Components

Utilizamos Server Components do Next.js para:

- Reduzir o JavaScript enviado ao cliente
- Manter a lógica pesada no servidor
- Evitar hidratação desnecessária no cliente

Exemplo implementado:

```tsx
// Componente de servidor (sem 'use client')
export default async function DashboardStats() {
  // Busca de dados diretamente no servidor
  const stats = await fetchStatistics();
  
  return (
    <section>
      <h2>Estatísticas</h2>
      <StatsDisplay data={stats} />
    </section>
  );
}

// Componente de cliente (apenas o necessário)
'use client'
export function StatsDisplay({ data }) {
  // Lógica de interatividade no cliente apenas onde necessário
  return (
    <div className="stats-grid">
      {data.map(stat => (
        <StatCard key={stat.id} {...stat} />
      ))}
    </div>
  );
}
```

### 2. Carregamento de Imagens

Otimização de imagens usando o componente `next/image`:

- Dimensionamento automático
- Formatos modernos (WebP/AVIF)
- Carregamento lazy por padrão
- Placeholder durante carregamento

Implementação:

```tsx
import Image from 'next/image';

export function OptimizedImage() {
  return (
    <Image
      src="/images/profile.jpg"
      alt="Perfil do usuário"
      width={240}
      height={240}
      priority={false}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j..."
      sizes="(max-width: 768px) 100vw, 33vw"
    />
  );
}
```

### 3. Suspense e Carregamento Progressivo

Implementação de carregamento progressivo com React Suspense:

```tsx
import { Suspense } from 'react';
import { Loading } from '@/components/ui/loading';

export default function ContactsPage() {
  return (
    <main>
      <h1>Contatos</h1>
      <Suspense fallback={<Loading />}>
        <ContactList />
      </Suspense>
      
      <Suspense fallback={<Loading variant="skeleton" />}>
        <RecentActivity />
      </Suspense>
    </main>
  );
}
```

### 4. Streaming de UI

Uso de streaming para carregar a UI progressivamente:

```tsx
import { unstable_noStore as noStore } from 'next/cache';

export default async function Dashboard() {
  noStore(); // Opt out of static rendering
  
  return (
    <div className="dashboard-layout">
      <Suspense fallback={<HeaderSkeleton />}>
        {/* Este componente pode carregar depois */}
        <DashboardHeader />
      </Suspense>
      
      <div className="dashboard-content">
        {/* Este componente carrega imediatamente */}
        <WelcomeCard />
        
        <Suspense fallback={<StatsSkeleton />}>
          {/* Este componente pode demorar para carregar */}
          <DashboardStats />
        </Suspense>
      </div>
    </div>
  );
}
```

### 5. Code Splitting

Implementação de carregamento sob demanda:

```tsx
import dynamic from 'next/dynamic';

// Carregado somente quando necessário
const MessageComposer = dynamic(() => import('@/components/MessageComposer'), {
  loading: () => <p>Carregando editor...</p>,
  ssr: false // Desabilitar SSR para componentes pesados com APIs do browser
});

// Pré-carregamento em hover/foco
const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), {
  ssr: false,
  loading: () => <div className="video-placeholder" />
});

export function preloadVideoPlayer() {
  // Chamada quando o usuário passa o mouse sobre um botão de vídeo
  import('@/components/VideoPlayer');
}
```

### 6. Font Optimization

Otimização de fontes com Next.js:

```tsx
// src/app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google';

// Otimização de font primária
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

// Font secundária apenas para código ou elementos específicos
const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
  preload: false,
});

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

### 7. Bundle Analysis e Redução

Utilizamos ferramentas para analisar e reduzir o tamanho do bundle:

- `@next/bundle-analyzer` para análise de pacotes
- Substituição de bibliotecas pesadas por alternativas leves
- Importações seletivas de componentes/funções

Exemplo de configuração:

```js
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Outras configurações
});
```

### 8. Pré-carregamento de Rotas

Implementamos pré-carregamento de rotas frequentemente acessadas:

```tsx
'use client'
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export function NavigationMenu() {
  const router = useRouter();
  const pathname = usePathname();
  
  const prefetchRoute = (route) => {
    router.prefetch(route);
  };
  
  return (
    <nav>
      <Link href="/messages" onMouseEnter={() => prefetchRoute('/messages')}>
        Mensagens
      </Link>
      <Link href="/contacts" onMouseEnter={() => prefetchRoute('/contacts')}>
        Contatos
      </Link>
      {/* Outras opções de menu */}
    </nav>
  );
}
```

### 9. Rendering Strategies

Uso das diferentes estratégias de renderização do Next.js conforme necessidade:

- **Static Site Generation (SSG)**: Para páginas que raramente mudam
- **Server-Side Rendering (SSR)**: Para conteúdo personalizado
- **Incremental Static Regeneration (ISR)**: Para dados que mudam com frequência moderada
- **Client-Side Rendering (CSR)**: Apenas para conteúdo altamente dinâmico/interativo

Exemplos de implementação:

```tsx
// Static rendering (default)
export default function AboutPage() {
  return <div>Sobre nós - Conteúdo estático</div>;
}

// Dynamic rendering
export const dynamic = 'force-dynamic';
export default async function DashboardPage() {
  const data = await fetchDashboardData();
  return <Dashboard data={data} />;
}

// ISR com revalidate
export async function generateStaticParams() {
  const messages = await fetchMessages();
  return messages.map(message => ({ id: message.id }));
}

export const revalidate = 3600; // Revalidar a cada hora
```

### 10. Parallelization de Requests

Utilizamos `Promise.all` para paralelizar múltiplas requisições:

```tsx
export default async function UserProfilePage({ params }) {
  // Executa as requisições em paralelo
  const [userDetails, userMessages, userActivity] = await Promise.all([
    fetchUserDetails(params.id),
    fetchUserMessages(params.id),
    fetchUserActivity(params.id)
  ]);
  
  return (
    <UserProfile 
      details={userDetails}
      messages={userMessages}
      activity={userActivity}
    />
  );
}
```

## Monitoramento de Performance

### Ferramentas de Monitoramento

- **Lighthouse**: Análise automática em pipeline CI/CD
- **Web Vitals**: Coleta de métricas reais de usuários
- **Vercel Analytics**: Monitoramento em produção

### Implementação de Web Vitals

```tsx
// app/layout.tsx
import { useReportWebVitals } from 'next/web-vitals';

export function WebVitalsReporter() {
  useReportWebVitals(metric => {
    // Envio para serviço de analytics
    console.log(metric);
    
    const { id, name, label, value } = metric;
    
    // Envio para serviço de analytics
    sendToAnalytics({
      id,
      name,
      label,
      value,
      // Outras propriedades se necessário
    });
  });
  
  return null;
}
```

## Técnicas Específicas para Módulo de Comunicação

### Virtualização de Listas Longas

```tsx
'use client'
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

export function MessagesList({ messages }) {
  const parentRef = useRef(null);
  
  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // altura estimada por item
  });
  
  return (
    <div 
      ref={parentRef} 
      className="messages-container"
      style={{ height: '600px', overflow: 'auto' }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <MessageItem message={messages[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Debounce e Throttling

```tsx
'use client'
import { useState, useEffect, useMemo } from 'react';
import { debounce } from 'lodash-es';

export function SearchMessages() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Debounce para não fazer chamadas a cada tecla digitada
  const debouncedSearch = useMemo(
    () => debounce(async (searchText) => {
      setIsSearching(true);
      try {
        const results = await fetchMessageSearch(searchText);
        setResults(results);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );
  
  useEffect(() => {
    if (query.length > 2) {
      debouncedSearch(query);
    } else {
      setResults([]);
    }
    
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);
  
  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Pesquisar mensagens..."
      />
      {isSearching && <span>Buscando...</span>}
      <ul className="search-results">
        {results.map(item => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Checklists

### Checklist de Performance Front-end

- [ ] Uso correto de Server Components e Client Components
- [ ] Implementação adequada de Suspense para carregamento progressivo
- [ ] Otimização de imagens com next/image
- [ ] Code splitting para carregar apenas o necessário
- [ ] Otimização de fontes
- [ ] Pré-carregamento de rotas frequentes
- [ ] Virtualização para listas longas
- [ ] Lazy loading para componentes pesados
- [ ] Uso de debounce/throttle para inputs de pesquisa
- [ ] Minimização de JavaScript não essencial

### Checklist de Performance de Dados

- [ ] Paralelização de requisições
- [ ] Uso adequado de cache (SWR/TanStack Query)
- [ ] Estratégia de revalidação adequada para cada página
- [ ] Streaming de dados grandes
- [ ] Paginação para listas longas
- [ ] Implementação de previsão/prefetching onde apropriado 