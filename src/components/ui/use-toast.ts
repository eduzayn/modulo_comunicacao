// Partial implementation of use-toast.ts
import { useEffect, useState } from "react"

export type ToastProps = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  open: boolean
}

export type Toast = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
}

export type ToastActionElement = React.ReactElement

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = (props: Toast) => {
    const id = props.id || String(Math.random())
    const newToast = { ...props, id, open: true }
    setToasts((prev) => [...prev, newToast])
    return id
  }

  const dismiss = (id: string) => {
    setToasts((prev) => 
      prev.map((t) => (t.id === id ? { ...t, open: false } : t))
    )
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.open))
    }, 1000)
    return () => clearTimeout(timer)
  }, [toasts])

  return {
    toast,
    dismiss,
    toasts
  }
}
