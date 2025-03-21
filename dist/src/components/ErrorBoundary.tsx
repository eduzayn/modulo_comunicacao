'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    // Atualiza o state para que o próximo render mostre o fallback UI
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary capturou um erro:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      // Você pode renderizar um fallback UI customizado
      return this.props.fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <h2 className="text-lg font-medium text-red-800">Algo deu errado</h2>
          <p className="text-sm text-red-600 mt-1">
            Ocorreu um erro ao carregar este componente. Tente recarregar a página.
          </p>
          <button
            className="mt-3 px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            Recarregar
          </button>
        </div>
      )
    }

    return this.props.children
  }
} 