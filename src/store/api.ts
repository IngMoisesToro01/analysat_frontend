import axios from 'axios'

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function setAuthToken(token?: string | null) {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  else delete api.defaults.headers.common['Authorization']
}

export function attachAuthInterceptor(onUnauthorized: () => void) {
  const id = api.interceptors.response.use(
    response => response,
    error => {
      const status = error?.response?.status

      if (status === 401) onUnauthorized()

      return Promise.reject(error)
    }
  )

  return () => api.interceptors.response.eject(id)
}
