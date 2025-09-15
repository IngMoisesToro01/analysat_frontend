import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { api, setAuthToken } from '@/store/api'

export interface User {
  id: number
  name: string
  email: string
  created_at: string
}

export interface AuthState {
  token: string | null
  user: User | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: AuthState = {
  token: null,
  user: null,
  status: 'idle',
  error: null,
}

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload: { name: string; email: string; password: string }) => {
    const { data } = await api.post<{
      id: number
      name: string
      email: string
      created_at: string
    }>('/auth/register', payload)

    return data
  }
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string }) => {
    const { data } = await api.post<{
      access_token: string
      token_type: string
    }>('/auth/login', payload)

    setAuthToken(data.access_token)

    const userResponse = await api.get<User>('/auth/me')

    return { token: data.access_token, user: userResponse.data }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null
      state.user = null
      state.status = 'idle'
      state.error = null
    },
    setToken(state, { payload }: { payload: string | null }) {
      state.token = payload
    },
    setUser(state, { payload }: { payload: User | null }) {
      state.user = payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.token = action.payload.token
        state.user = action.payload.user
        try {
          localStorage.setItem('auth_token', action.payload.token ?? '')
        } catch {}
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Login failed'
      })
      .addCase(registerUser.pending, state => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(registerUser.fulfilled, state => {
        state.status = 'succeeded'
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Register failed'
      })
  },
})

export const { logout, setToken, setUser } = authSlice.actions

const baseLogout = logout
const baseSetToken = setToken

export const logoutAndClear = () => (dispatch: any) => {
  try {
    localStorage.removeItem('auth_token')
  } catch {}
  setAuthToken(null)
  dispatch(baseLogout())
}

export const setTokenAndPersist = (token: string | null) => (dispatch: any) => {
  try {
    if (token) localStorage.setItem('auth_token', token)
    else localStorage.removeItem('auth_token')
  } catch {}
  setAuthToken(token)
  dispatch(baseSetToken(token))
}
export default authSlice.reducer
