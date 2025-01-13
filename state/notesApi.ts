import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Note {
  uid: string
  name: string
  pinned: boolean
}

export interface GetNotesResponse {
  notes: Note[]
  totalCount: number
}

export interface NoteFilters {
  searchText: string
  pinnedOnly: boolean
}

const PAGE_SIZE = 50

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
        getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
          const { offset, ...filters } = firstPageParam
          if (offset - PAGE_SIZE >= 0) {
            return { ...filters, offset: offset - PAGE_SIZE }
          }
        },
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
          const { offset, ...filters } = lastPageParam
          if (lastPage.totalCount >= offset + PAGE_SIZE) {
            return { ...filters, offset: offset + PAGE_SIZE }
          }
        }
      }
    })
  }),
  refetchOnMountOrArgChange: true
})

export const { endpoints: notesApiEndpoints, useGetNotesCursorInfiniteQuery } = notesApiSlice
