import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Card, CardHeader } from '@heroui/card'
import { Chip } from '@heroui/chip'
import { Select, SelectItem } from '@heroui/select'

import DefaultLayout from '@/layouts/default'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  Task,
} from '@/store/slices/tasksSlice'

export default function TasksPage() {
  const { userId, projectId } = useParams<{
    userId: string
    projectId: string
  }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { items: tasks, status } = useAppSelector(state => state.tasks)
  const { items: projects } = useAppSelector(state => state.projects)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<Task['status'] | 'all'>(
    'all'
  )

  const currentProject = projects.find(p => p.id === Number(projectId))

  useEffect(() => {
    if (projectId) {
      dispatch(fetchTasks({ project_id: Number(projectId) }))
    }
  }, [dispatch, projectId])

  const onCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectId) return

    setCreating(true)
    try {
      await dispatch(
        createTask({
          title,
          description,
          project_id: Number(projectId),
        })
      ).unwrap()
      setTitle('')
      setDescription('')
    } finally {
      setCreating(false)
    }
  }

  const onTaskClick = (taskId: number) => {
    navigate(`/user/${userId}/projects/${projectId}/tasks/${taskId}`)
  }

  const onStatusChange = async (taskId: number, newStatus: Task['status']) => {
    await dispatch(
      updateTask({
        task_id: taskId,
        data: { status: newStatus },
      })
    ).unwrap()
  }

  const onDeleteTask = async (taskId: number) => {
    await dispatch(deleteTask({ task_id: taskId })).unwrap()
  }

  const filteredTasks = useMemo(() => {
    let filtered = tasks

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        task =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter)
    }

    return filtered
  }, [tasks, searchTerm, statusFilter])

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return 'warning'
      case 'in progress':
        return 'primary'
      case 'completed':
        return 'success'
      default:
        return 'default'
    }
  }

  return (
    <DefaultLayout>
      <section className="container mx-auto max-w-4xl py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {currentProject?.name || 'Proyecto'}
            </h1>
            <p className="text-default-500">{currentProject?.description}</p>
          </div>
          <Button
            color="secondary"
            variant="flat"
            onPress={() => navigate(`/user/${userId}/projects`)}
          >
            ← Volver a proyectos
          </Button>
        </div>

        <form
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
          onSubmit={onCreateTask}
        >
          <Input
            isRequired
            label="Título de la tarea"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <Input
            isRequired
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
            Crear tarea
          </Button>
        </form>

        <div className="flex gap-3 items-center">
          <Input
            className="flex-1"
            placeholder="Buscar tareas..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Select
            className="w-48"
            placeholder="Filtrar por estado"
            selectedKeys={[statusFilter]}
            onSelectionChange={keys => {
              const selected = Array.from(keys)[0] as Task['status'] | 'all'

              setStatusFilter(selected)
            }}
          >
            <SelectItem key="all" value="all">
              Todos
            </SelectItem>
            <SelectItem key="pending" value="pending">
              Pendiente
            </SelectItem>
            <SelectItem key="in progress" value="in progress">
              En progreso
            </SelectItem>
            <SelectItem key="completed" value="completed">
              Completada
            </SelectItem>
          </Select>
          {(searchTerm || statusFilter !== 'all') && (
            <Button
              variant="flat"
              onPress={() => {
                setSearchTerm('')
                setStatusFilter('all')
              }}
            >
              Limpiar
            </Button>
          )}
        </div>

        <div className="grid gap-3">
          {filteredTasks.map(task => (
            <Card
              key={task.id}
              isPressable
              className="hover:shadow-md transition-shadow"
              onPress={() => onTaskClick(task.id)}
            >
              <CardHeader className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold">{task.title}</h3>
                  <p className="text-sm text-default-500 mt-1">
                    {task.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Chip
                    color={getStatusColor(task.status)}
                    size="sm"
                    variant="flat"
                  >
                    {task.status}
                  </Chip>
                  <Button
                    color="danger"
                    size="sm"
                    variant="light"
                    onPress={e => {
                      e.stopPropagation()
                      onDeleteTask(task.id)
                    }}
                  >
                    Eliminar
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
          {status === 'loading' && <p>Cargando tareas...</p>}
          {filteredTasks.length === 0 && status !== 'loading' && (
            <p className="text-center text-default-500 py-8">
              {tasks.length === 0
                ? 'No hay tareas en este proyecto'
                : 'No se encontraron tareas con los filtros aplicados'}
            </p>
          )}
        </div>
      </section>
    </DefaultLayout>
  )
}
