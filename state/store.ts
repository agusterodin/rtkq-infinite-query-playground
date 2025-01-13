import { combineSlices, configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'

import notes from './notes'
import { notesApiSlice } from './notesApi'

const rootReducer = combineSlices({ notes, [notesApiSlice.reducerPath]: notesApiSlice.reducer })

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => {
      return getDefaultMiddleware().concat(notesApiSlice.middleware)
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type State = ReturnType<typeof rootReducer>
export type AppDispatch = AppStore['dispatch']

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<State>()
