import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { State } from './store'

interface QueryListDownloadState {
  searchText: string
  pinnedOnly: boolean
}

// Initial State

const initialState: QueryListDownloadState = {
  searchText: '',
  pinnedOnly: false
}

// Selectors

export const getSearchText = (state: State) => state.notes.searchText
export const getPinnedOnly = (state: State) => state.notes.pinnedOnly

// Slices

const queryListSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setSearchText(state, action: PayloadAction<string>) {
      state.searchText = action.payload
    },
    setPinnedOnly(state, action: PayloadAction<boolean>) {
      state.pinnedOnly = action.payload
    }
  }
})

export const { setSearchText, setPinnedOnly } = queryListSlice.actions

export default queryListSlice.reducer
