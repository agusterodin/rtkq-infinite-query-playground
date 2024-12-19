import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Note {
  uid: string
  name: string
}

export interface GetNotesResponse {
  notes: Note[]
  totalCount: number
}

export interface NoteFilters {
  all?: boolean
  orderby?: 'id|DESC'
}

const PAGE_SIZE = 50

export const notesApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/mock' }),
  reducerPath: 'notesApi',
  endpoints: builder => ({
    // Generic: <Response type, input type (filters), cache key (page + filters)>
    getQueriesCursor: builder.infiniteQuery<GetNotesResponse, NoteFilters, { offset: number } & NoteFilters>({
      query: filtersAndOffset => {
        console.log('filters and offset being sent with request', filtersAndOffset)
        return {
          url: '/notes',
          params: { ...filtersAndOffset, limit: PAGE_SIZE }
        }
      },
      infiniteQueryOptions: {
        initialPageParam: { offset: 0 },
        getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
          const { offset, ...filters } = firstPageParam
          if (offset - PAGE_SIZE >= 0) {
            return { ...filters, offset: offset - PAGE_SIZE }
          }
        },
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
          const { offset, ...filters } = lastPageParam
          if (lastPage.totalCount >= offset + PAGE_SIZE) {
            console.log('There is a next page and its offset is: ', offset + PAGE_SIZE)
            return { ...filters, offset: offset + PAGE_SIZE }
          }
        }
      }
    })
  })
  // Uncomment the line below and the infinite query will break (additional pages will never get fetched)
  // refetchOnMountOrArgChange: true
})

export const { endpoints: notesApiEndpoints } = notesApiSlice
