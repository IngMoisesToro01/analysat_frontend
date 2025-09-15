import type { RootState } from '@/store'

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { api } from '@/store/api'

export interface Project {
  id: number
  name: string
  description: string
  user_id: number
  created_at: string
}

export interface ProjectsState {
  items: Project[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: ProjectsState = {
  items: [],
  status: 'idle',
  error: null,
}

function authHeader(getState: () => RootState) {
  const token = getState().auth.token ?? undefined

  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const fetchProjects = createAsyncThunk<
  Project[],
  { name?: string } | void,
  { state: RootState }
>('projects/fetchAll', async (params = {}, { getState }) => {
  const query = new URLSearchParams()

  if (params && params.name) query.set('name', params.name)
  const { data } = await api.get<Project[]>(
    `/projects/${query.toString() ? `?${query.toString()}` : ''}`,
    {
      headers: authHeader(getState),
    }
  )

  return data
})

export const createProject = createAsyncThunk<
  Project,
  { name: string; description: string },
  { state: RootState }
>('projects/create', async (payload, { getState }) => {
  const { data } = await api.post<Project>('/projects/', payload, {
    headers: authHeader(getState),
  })

  return data
})

export const updateProject = createAsyncThunk<
  Project,
  { project_id: number; data: Partial<Pick<Project, 'name' | 'description'>> },
  { state: RootState }
>('projects/update', async ({ project_id, data }, { getState }) => {
  const { data: updated } = await api.put<Project>(
    `/projects/${project_id}`,
    data,
    {
      headers: authHeader(getState),
    }
  )

  return updated
})

export const deleteProject = createAsyncThunk<
  number,
  { project_id: number },
  { state: RootState }
>('projects/delete', async ({ project_id }, { getState }) => {
  await api.delete<void>(`/projects/${project_id}`, {
    headers: authHeader(getState),
  })

  return project_id
})

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects(state, action: PayloadAction<Project[]>) {
      state.items = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProjects.pending, state => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to fetch projects'
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const idx = state.items.findIndex(p => p.id === action.payload.id)

        if (idx >= 0) state.items[idx] = action.payload
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload)
      })
  },
})

export const { setProjects } = projectsSlice.actions
export default projectsSlice.reducer
