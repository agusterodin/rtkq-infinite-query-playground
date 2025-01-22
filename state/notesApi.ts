import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Note {
  uid: string
  name: string
  pinned: boolean
}

export interface GetNotesResponse {
  notes: Note[]
  nextOffset: number
}

export interface NoteFilters {
  searchText: string
  pinnedOnly: boolean
}

export const PAGE_SIZE = 50

export const notesApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/mock' }),
  reducerPath: 'notesApi',
  endpoints: builder => ({
    // Generic: <Response type, input type (filters), cache key (page + filters)>
    getNotesCursor: builder.infiniteQuery<GetNotesResponse, NoteFilters, { offset: number } & NoteFilters>({
      query: filtersAndOffset => {
        return {
          url: '/notes',
          params: { ...filtersAndOffset, limit: PAGE_SIZE }
        }
      },
      infiniteQueryOptions: {
        initialPageParam: { offset: 0, searchText: '', pinnedOnly: false },
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
          const { offset, ...filters } = lastPageParam
          if (lastPage.nextOffset) {
            return { ...filters, offset: lastPage.nextOffset }
          }
        }
      }
    })
  }),
  refetchOnMountOrArgChange: true
})

export const { endpoints: notesApiEndpoints, useGetNotesCursorInfiniteQuery } = notesApiSlice
