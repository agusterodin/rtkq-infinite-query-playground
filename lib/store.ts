import { combineSlices, configureStore } from '@reduxjs/toolkit'
import { notesApiSlice } from './notesApi'

const rootReducer = combineSlices(notesApiSlice)

export type RootState = ReturnType<typeof rootReducer>

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => {
      return getDefaultMiddleware().concat(notesApiSlice.middleware)
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>
