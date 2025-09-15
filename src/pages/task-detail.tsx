import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Textarea } from '@heroui/input'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Chip } from '@heroui/chip'
import { Select, SelectItem } from '@heroui/select'

import DefaultLayout from '@/layouts/default'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchTasks,
  updateTask,
  deleteTask,
  Task,
} from '@/store/slices/tasksSlice'

const STATUS_OPTIONS = [
  { key: 'pending', label: 'Pendiente' },
  { key: 'in progress', label: 'En progreso' },
  { key: 'completed', label: 'Completada' },
]

export default function TaskDetailPage() {
  const { userId, projectId, taskId } = useParams<{
    userId: string
    projectId: string
    taskId: string
  }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { items: tasks } = useAppSelector(state => state.tasks)
  const { items: projects } = useAppSelector(state => state.projects)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<Task['status']>('pending')
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const currentTask = tasks.find(t => t.id === Number(taskId))
  const currentProject = projects.find(p => p.id === Number(projectId))

  useEffect(() => {
    if (currentTask) {
      setTitle(currentTask.title)
      setDescription(currentTask.description)
      setStatus(currentTask.status)
    }
  }, [currentTask])

  useEffect(() => {
    if (projectId) {
      dispatch(fetchTasks({ project_id: Number(projectId) }))
    }
  }, [dispatch, projectId])

  const onSave = async () => {
    if (!taskId) return

    setSaving(true)
    try {
      await dispatch(
        updateTask({
          task_id: Number(taskId),
          data: { title, description, status },
        })
      ).unwrap()
      setIsEditing(false)
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    if (!taskId) return

    await dispatch(deleteTask({ task_id: Number(taskId) })).unwrap()
    navigate(`/user/${userId}/projects/${projectId}/tasks`)
  }

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

  if (!currentTask) {
    return (
      <DefaultLayout>
        <div className="container mx-auto max-w-2xl py-8 text-center">
          <p>Cargando tarea...</p>
        </div>
      </DefaultLayout>
    )
  }

  return (
    <DefaultLayout>
      <section className="container mx-auto max-w-2xl py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Button
            color="secondary"
            variant="flat"
            onPress={() =>
              navigate(`/user/${userId}/projects/${projectId}/tasks`)
            }
          >
            ← Volver a tareas
          </Button>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button color="primary" isLoading={saving} onPress={onSave}>
                  Guardar
                </Button>
                <Button variant="flat" onPress={() => setIsEditing(false)}>
                  Cancelar
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  variant="flat"
                  onPress={() => setIsEditing(true)}
                >
                  Editar
                </Button>
                <Button color="danger" variant="flat" onPress={onDelete}>
                  Eliminar
                </Button>
              </>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <h1 className="text-2xl font-bold">
                {isEditing ? (
                  <Input
                    className="text-2xl font-bold"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                ) : (
                  currentTask.title
                )}
              </h1>
              <Chip color={getStatusColor(currentTask.status)} variant="flat">
                {currentTask.status}
              </Chip>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Descripción</h3>
              {isEditing ? (
                <Textarea
                  minRows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              ) : (
                <p className="text-default-600">{currentTask.description}</p>
              )}
            </div>

            {isEditing && (
              <div>
                <h3 className="font-semibold mb-2">Estado</h3>
                <Select
                  selectedKeys={[status]}
                  onSelectionChange={keys => {
                    const selected = Array.from(keys)[0] as Task['status']

                    setStatus(selected)
                  }}
                >
                  {STATUS_OPTIONS.map(option => (
                    <SelectItem key={option.key} value={option.key}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            )}

            <div className="text-sm text-default-500">
              <p>Proyecto: {currentProject?.name}</p>
              <p>
                Creado: {new Date(currentTask.created_at).toLocaleDateString()}
              </p>
            </div>
          </CardBody>
        </Card>
      </section>
    </DefaultLayout>
  )
}
