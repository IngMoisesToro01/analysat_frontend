import { Route, Routes, Navigate } from 'react-router-dom'

import { ProjectRoutes } from './ProjectRoutes'

export function UserRoutes() {
  return (
    <Routes>
      <Route element={<ProjectRoutes />} path="/:userId/projects/*" />
      <Route element={<Navigate replace to="/user/1/projects" />} path="*" />
    </Routes>
  )
}
