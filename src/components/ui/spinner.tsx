import { cn } from '@/lib/utils'

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
}

export function Spinner({ className, size = 'md', ...props }: SpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-current border-t-transparent',
        size === 'sm' && 'h-4 w-4 border-2',
        size === 'md' && 'h-6 w-6 border-2',
        size === 'lg' && 'h-8 w-8 border-[3px]',
        'text-primary',
        className
      )}
      {...props}
    >
      <span className="sr-only">Carregando...</span>
    </div>
  )
}
