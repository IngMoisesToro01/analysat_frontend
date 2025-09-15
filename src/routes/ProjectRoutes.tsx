import { Route, Routes, Navigate } from 'react-router-dom'

import { TaskRoutes } from './TaskRoutes'

import ProjectsPage from '@/pages/projects'

export function ProjectRoutes() {
  return (
    <Routes>
      <Route element={<ProjectsPage />} path="/" />
      <Route element={<TaskRoutes />} path="/:projectId/*" />
      <Route element={<Navigate replace to="." />} path="*" />
    </Routes>
  )
}
