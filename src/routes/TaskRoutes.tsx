import { Route, Routes, Navigate } from 'react-router-dom'

import TasksPage from '@/pages/tasks'
import TaskDetailPage from '@/pages/task-detail'

export function TaskRoutes() {
  return (
    <Routes>
      <Route element={<TasksPage />} path="/" />
      <Route element={<TasksPage />} path="/tasks" />
      <Route element={<TaskDetailPage />} path="/tasks/:taskId" />
      <Route element={<Navigate replace to="." />} path="*" />
    </Routes>
  )
}
