import { Route, Routes, Navigate, useParams } from 'react-router-dom'

import { ProjectRoutes } from './ProjectRoutes'

function UserRoutesContent() {
  const { userId } = useParams<{ userId: string }>()

  return (
    <Routes>
      <Route element={<ProjectRoutes />} path="/:userId/projects/*" />
      <Route
        element={<Navigate replace to={`/user/${userId}/projects`} />}
        path="*"
      />
    </Routes>
  )
}

export function UserRoutes() {
  return <UserRoutesContent />
}
