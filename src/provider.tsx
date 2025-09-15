import type { NavigateOptions } from 'react-router-dom'

import { useEffect } from 'react'
import { HeroUIProvider } from '@heroui/system'
import { useHref, useNavigate } from 'react-router-dom'
import { Provider as ReduxProvider } from 'react-redux'

import { store } from '@/store'
import { logoutAndClear, setToken } from '@/store/slices/authSlice'
import { setAuthToken, attachAuthInterceptor } from '@/store/api'

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NavigateOptions
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()

  try {
    const t = localStorage.getItem('auth_token')

    if (t) {
      store.dispatch(setToken(t))
      setAuthToken(t)
    }
  } catch {}

  useEffect(() => {
    const detach = attachAuthInterceptor(() => {
      store.dispatch(logoutAndClear() as any)
      navigate('/login', { replace: true })
    })

    return detach
  }, [navigate])

  return (
    <ReduxProvider store={store}>
      <HeroUIProvider navigate={navigate} useHref={useHref}>
        {children}
      </HeroUIProvider>
    </ReduxProvider>
  )
}
