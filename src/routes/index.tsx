import { Route, Routes, Navigate } from 'react-router-dom'

import { AuthRoutes } from './AuthRoutes'
import { UserRoutes } from './UserRoutes'

import { AppRouter } from '@/components/AppRouter'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Navigate replace to="/login" />} path="/" />
      <Route element={<AuthRoutes />} path="/auth/*" />
      <Route
        element={
          <AppRouter>
            <UserRoutes />
          </AppRouter>
        }
        path="/user/*"
      />
      <Route element={<Navigate replace to="/login" />} path="*" />
    </Routes>
  )
}
