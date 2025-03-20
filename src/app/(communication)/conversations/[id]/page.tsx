'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ConversationDetailRedirect() {
  const params = useParams();
  const router = useRouter();
  
  useEffect(() => {
    // Redireciona para a caixa de entrada unificada mantendo o ID da conversa
    if (params?.id) {
      router.push(`/inbox?conversation=${params.id}`);
    } else {
      router.push('/inbox');
    }
  }, [params, router]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-muted-foreground">Redirecionando para a caixa de entrada unificada...</p>
    </div>
  );
}
