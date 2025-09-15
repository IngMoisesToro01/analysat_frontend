import { Route, Routes, Navigate } from 'react-router-dom'

import LoginPage from '@/pages/login'
import RegisterPage from '@/pages/register'

export function AuthRoutes() {
  return (
    <Routes>
      <Route element={<LoginPage />} path="/login" />
      <Route element={<RegisterPage />} path="/register" />
      <Route element={<Navigate replace to="/auth/login" />} path="*" />
    </Routes>
  )
}
