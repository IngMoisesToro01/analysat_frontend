import { Route, Routes, Navigate } from 'react-router-dom'

import { UserRoutes } from './UserRoutes'

import AppRouter from '@/components/AppRouter'
import LoginPage from '@/pages/login'
import RegisterPage from '@/pages/register'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Navigate replace to="/login" />} path="/" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<RegisterPage />} path="/register" />
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
