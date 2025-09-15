import { configureStore } from '@reduxjs/toolkit'

import authReducer from '@/store/slices/authSlice'
import projectsReducer from '@/store/slices/projectsSlice'
import tasksReducer from '@/store/slices/tasksSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
  },
  devTools: true,
})

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
