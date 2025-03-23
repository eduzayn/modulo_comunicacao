export function Footer() {
  return (
    <footer className="border-t py-4 bg-background">
      <div className="container flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Módulo de Comunicação. Todos os direitos reservados.
        </p>
        <p className="text-sm text-muted-foreground">
          Versão 1.0.0
        </p>
      </div>
    </footer>
  )
} 