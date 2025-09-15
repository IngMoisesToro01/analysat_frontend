import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setUser, logoutAndClear } from '@/store/slices/authSlice'
import { api } from '@/store/api'

interface AppRouterProps {
  children: React.ReactNode
}

export default function AppRouter({ children }: AppRouterProps) {
  const { token, user } = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()
  const location = useLocation()

  useEffect(() => {
    if (token && !user) {
      api
        .get('/auth/me')
        .then(({ data }) => {
          dispatch(setUser(data))
        })
        .catch(() => {
          dispatch(logoutAndClear() as any)
        })
    }
  }, [token, user, dispatch])

  if (!token) {
    return <Navigate replace to="/login" />
  }

  if (token && !user) {
    return <div>Cargando...</div>
  }

  // Solo redirigir si no estamos ya en una ruta de usuario
  if (token && user && !location.pathname.startsWith('/user/')) {
    return <Navigate replace to={`/user/${user.id}/projects`} />
  }

  return <>{children}</>
}
