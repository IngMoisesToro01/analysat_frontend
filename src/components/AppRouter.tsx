import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'

import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setUser, logoutAndClear } from '@/store/slices/authSlice'
import { api } from '@/store/api'

interface AppRouterProps {
  children: React.ReactNode
}

export default function AppRouter({ children }: AppRouterProps) {
  const { token, user } = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()

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

  if (token && user) {
    return <Navigate replace to={`/user/${user.id}/projects`} />
  }

  return <>{children}</>
}
