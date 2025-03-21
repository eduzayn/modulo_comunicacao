// TODO: Este arquivo será movido para src/hooks/use-toast.ts no futuro.
// Mantido aqui temporariamente para compatibilidade com a estrutura atual.
// Shadcn UI - Toast Hook
import { useContext } from "react"
import { ToastActionElement, ToastProps } from "./toast"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: string
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: string
    }

interface State {
  toasts: ToasterToast[]
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action

      if (toastId) {
        return {
          ...state,
          toasts: state.toasts.map((t) =>
            t.id === toastId
              ? {
                  ...t,
                  open: false,
                }
              : t
          ),
        }
      }

      return {
        ...state,
        toasts: state.toasts.map((t) => ({
          ...t,
          open: false,
        })),
      }
    }

    case actionTypes.REMOVE_TOAST: {
      const { toastId } = action

      if (toastId) {
        return {
          ...state,
          toasts: state.toasts.filter((t) => t.id !== toastId),
        }
      }

      return {
        ...state,
        toasts: [],
      }
    }
  }
}

export function useToast() {
  const dispatch = (action: Action) => {
    // Aqui iríamos usar o contexto do toast, mas vamos simplificar
    // o exemplo apenas para compilar o projeto
    console.log("Toast action:", action)
  }

  return {
    toast: (props: Omit<ToasterToast, "id">) => {
      const id = genId()
      const toast = { ...props, id }
      dispatch({
        type: actionTypes.ADD_TOAST,
        toast,
      })
      return toast
    },
    dismiss: (toastId?: string) => {
      dispatch({ type: actionTypes.DISMISS_TOAST, toastId })
    },
    update: (props: Partial<ToasterToast>) => {
      if (!props.id) {
        return
      }
      dispatch({
        type: actionTypes.UPDATE_TOAST,
        toast: props,
      })
    },
  }
}

// Criar uma instância do hook que pode ser importada diretamente
const { toast, dismiss, update } = useToast()

// Exportar funções individuais
export { toast, dismiss, update }
export type { ToasterToast } 