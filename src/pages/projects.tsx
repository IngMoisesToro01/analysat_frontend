import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Card, CardHeader } from '@heroui/card'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { createProject, fetchProjects } from '@/store/slices/projectsSlice'
import { fetchTasks, Task } from '@/store/slices/tasksSlice'
import { logoutAndClear } from '@/store/slices/authSlice'

export default function ProjectsPage() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { items: projects, status: projStatus } = useAppSelector(
    s => s.projects
  )
  const { items: tasks } = useAppSelector(s => s.tasks)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    dispatch(fetchProjects())
    dispatch(fetchTasks())
  }, [dispatch])

  const tasksByProject = useMemo(() => {
    const map: Record<number, Task[]> = {}

    for (const t of tasks) {
      if (!map[t.project_id]) map[t.project_id] = []
      map[t.project_id].push(t)
    }

    return map
  }, [tasks])

  const filteredProjects = useMemo(() => {
    if (!searchTerm) return projects

    return projects.filter(
      project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [projects, searchTerm])

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      await dispatch(createProject({ name, description })).unwrap()
      setName('')
      setDescription('')
    } finally {
      setCreating(false)
    }
  }

  const handleLogout = () => {
    dispatch(logoutAndClear() as any)
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex justify-end p-4">
        <Button color="danger" variant="flat" onPress={handleLogout}>
          Cerrar sesión
        </Button>
      </div>
      <section className="container mx-auto max-w-3xl py-8 space-y-8">
        <form
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
          onSubmit={onCreate}
        >
          <Input
            label="Nombre"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Input
            label="Descripción"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <Button
            className="w-full"
            color="primary"
            isLoading={creating}
            type="submit"
          >
            Crear proyecto
          </Button>
        </form>

        <div className="flex gap-3 items-center">
          <Input
            className="flex-1"
            placeholder="Buscar proyectos..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button variant="flat" onPress={() => setSearchTerm('')}>
              Limpiar
            </Button>
          )}
        </div>

        <div className="grid gap-4">
          {filteredProjects.map(p => (
            <Card
              key={p.id}
              isPressable
              className="hover:shadow-md transition-shadow"
              shadow="sm"
              onPress={() => navigate(`/user/${userId}/projects/${p.id}`)}
            >
              <CardHeader className="flex justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-sm text-default-500">{p.description}</p>
                  <p className="text-xs text-default-400 mt-1">
                    {tasksByProject[p.id]?.length || 0} tareas
                  </p>
                </div>
                <Button
                  color="primary"
                  size="sm"
                  variant="flat"
                  onPress={() => navigate(`/user/${userId}/projects/${p.id}`)}
                >
                  Ver tareas
                </Button>
              </CardHeader>
            </Card>
          ))}
          {projStatus === 'loading' && <p>Cargando...</p>}
        </div>
      </section>
    </div>
  )
}
