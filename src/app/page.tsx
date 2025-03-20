import { redirect } from 'next/navigation'

// Redirecionamento do lado do servidor para a caixa de entrada
export default function Home() {
  // Em Next.js 14, o redirect deve ser chamado diretamente, não retornado
  redirect('/inbox')
  
  // Este código nunca será executado após o redirect
  return null
}
