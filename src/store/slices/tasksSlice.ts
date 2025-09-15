import type { RootState } from '@/store'

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { api } from '@/store/api'

export type TaskStatus = 'pending' | 'in progress' | 'completed'

export interface Task {
  id: number
  title: string
  description: string
  status: TaskStatus
  project_id: number
  user_id: number
  created_at: string
}

export interface TasksState {
  items: Task[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: TasksState = {
  items: [],
  status: 'idle',
  error: null,
}

function authHeader(getState: () => RootState) {
  const token = getState().auth.token ?? undefined

  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const fetchTasks = createAsyncThunk<
  Task[],
  { status?: TaskStatus; project_id?: number } | void,
  { state: RootState }
>('tasks/fetchAll', async (params = {}, { getState }) => {
  const query = new URLSearchParams()

  if (params && params.status) query.set('status', params.status)
  if (params && params.project_id)
    query.set('project_id', String(params.project_id))
  const { data } = await api.get<Task[]>(
    `/tasks/${query.toString() ? `?${query.toString()}` : ''}`,
    {
      headers: authHeader(getState),
    }
  )

  return data
})

export const createTask = createAsyncThunk<
  Task,
  {
    title: string
    description: string
    status?: TaskStatus
    project_id: number
  },
  { state: RootState }
>('tasks/create', async (payload, { getState }) => {
  const { data } = await api.post<Task>('/tasks/', payload, {
    headers: authHeader(getState),
  })

  return data
})

export const updateTask = createAsyncThunk<
  Task,
  {
    task_id: number
    data: Partial<Omit<Task, 'id' | 'user_id' | 'created_at'>>
  },
  { state: RootState }
>('tasks/update', async ({ task_id, data }, { getState }) => {
  const { data: updated } = await api.put<Task>(`/tasks/${task_id}`, data, {
    headers: authHeader(getState),
  })

  return updated
})

export const deleteTask = createAsyncThunk<
  number,
  { task_id: number },
  { state: RootState }
>('tasks/delete', async ({ task_id }, { getState }) => {
  await api.delete<void>(`/tasks/${task_id}`, {
    headers: authHeader(getState),
  })

  return task_id
})

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<Task[]>) {
      state.items = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTasks.pending, state => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to fetch tasks'
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.items.findIndex(t => t.id === action.payload.id)

        if (idx >= 0) state.items[idx] = action.payload
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t.id !== action.payload)
      })
  },
})

export const { setTasks } = tasksSlice.actions
export default tasksSlice.reducer
