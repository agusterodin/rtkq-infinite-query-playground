'use client'

import React from 'react'
import { useInView } from 'react-intersection-observer'
import { notesApiEndpoints, NoteFilters } from 'lib/notesApi'

const filters: NoteFilters = {
  all: true,
  orderby: 'id|DESC' as const
}

export default function PlainInfiniteQueryTest() {
  const { data, error, fetchNextPage, fetchPreviousPage, hasNextPage, isFetchingNextPage, isFetching, isError } =
     notesApiEndpoints.getQueriesCursor.useInfiniteQuery(filters, { initialPageParam: { offset: 0, ...filters } })

  const { ref, inView } = useInView()

  React.useEffect(() => {
    if (inView) {
      console.log('Fetching next page')
      fetchNextPage()
    }
  }, [fetchNextPage, inView])

  return (
    <div className="overflow-auto">
      <h2>Infinite Scroll Example</h2>
      {isFetching ? <p>Loading...</p> : isError ? <span>Error: {error.message}</span> : null}
      {
        <>
          <div>
            <button
              onClick={() => fetchPreviousPage()}
              // disabled={!hasPreviousPage || isFetchingPreviousPage}
            >
              {/* {isFetchingPreviousPage
                ? "Loading more..."
                : hasPreviousPage
                  ? "Load Older"
                  : "Nothing more to load"} */}
            </button>
          </div>
          {data?.pages.map(page => (
            <React.Fragment key={page.notes[0].uid}>
              {page.notes.map(note => (
                <p
                  style={{
                    border: '1px solid gray',
                    borderRadius: '5px',
                    padding: '1rem 1rem',
                    background: 'gray'
                  }}
                  key={note.uid}
                >
                  {note.name}
                </p>
              ))}
            </React.Fragment>
          ))}
          <div>
            <button ref={ref} onClick={() => {
              console.log('Clicked "load newer" button')
              fetchNextPage()
            }} disabled={!hasNextPage || isFetchingNextPage}>
              {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load Newer' : 'Nothing more to load'}
            </button>
          </div>
          <div>{isFetching ? 'Background Updating...' : null}</div>
        </>
      }
      <hr />
    </div>
  )
}
