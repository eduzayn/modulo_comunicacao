// DEPRECATED: Este hook foi migrado para src/hooks/use-toast-provider.tsx
// Este arquivo será removido em uma atualização futura.
// Por favor, use o hook do novo local.

// Adaptado de shadcn/ui: https://ui.shadcn.com/docs/components/toast
import { useState, createContext, useContext } from "react"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000

type ToastActionElement = React.ReactElement<{
  className?: string
  altText?: string
  onClick?: () => void
}>

type ToastProps = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  open: boolean
  onOpenChange?: (open: boolean) => void
  variant?: "default" | "destructive"
}

type Toast = ToastProps

const ToastContext = createContext<{
  toasts: Toast[]
  addToast: (toast: Omit<ToastProps, "id" | "open">) => void
  updateToast: (
    id: string,
    toast: Partial<Omit<ToastProps, "id" | "open">>
  ) => void
  dismissToast: (id: string) => void
}>({
  toasts: [],
  addToast: () => {},
  updateToast: () => {},
  dismissToast: () => {},
})

export const useToast = () => {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error("useToast deve ser usado dentro de um ToastProvider")
  }

  return context
}

export function ToastProvider({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<ToastProps, "id" | "open">) => {
    setToasts((prev) => {
      const newToast = {
        ...toast,
        id: crypto.randomUUID(),
        open: true,
      }

      // Se exceder o limite, remova os mais antigos
      return [newToast, ...prev].slice(0, TOAST_LIMIT)
    })
  }

  const dismissToast = (id: string) => {
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id ? { ...toast, open: false } : toast
      )
    )

    // Remova após a animação
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, TOAST_REMOVE_DELAY)
  }

  const updateToast = (
    id: string,
    toast: Partial<Omit<ToastProps, "id" | "open">>
  ) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...toast } : t))
    )
  }

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, updateToast, dismissToast }}
    >
      {children}
    </ToastContext.Provider>
  )
}

export type { Toast, ToastProps, ToastActionElement } 