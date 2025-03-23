import axios, { type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem('token')
  
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }
  }
  
  return config
})

// Interceptor para tratar erros
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Redirecionar para login se o token expirou
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
) 