'use client'

import { useRef } from 'react'
import useInfiniteVirtualizedQueryList from './useInfiniteVirtualizedNotesList'
import Searchbox from './Searchbox'
import OnlyShowPinnedCheckbox from './PinnedCheckbox'

export default function InfiniteQueryTest() {
  const parentRef = useRef<HTMLDivElement>(null)

  const { fetchedNotes, infiniteQuery, rowVirtualizer } = useInfiniteVirtualizedQueryList(parentRef)
  const { isLoading, isError, hasNextPage } = infiniteQuery

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Could not load data.</div>
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-4">
        <Searchbox />
        <OnlyShowPinnedCheckbox />
      </div>
      <div ref={parentRef} className="h-96 w-full max-w-full overflow-auto rounded-lg border border-gray-400 bg-white">
        <div
          className="relative w-full"
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`
          }}
        >
          {rowVirtualizer.getVirtualItems().map(virtualRow => {
            const isLoaderRow = virtualRow.index > fetchedNotes.length - 1
            const note = fetchedNotes[virtualRow.index]

            return (
              <div
                key={virtualRow.index}
                className="absolute left-0 top-0 w-full"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`
                }}
              >
                {isLoaderRow && hasNextPage ? (
                  'Loading more items...'
                ) : (
                  <div className="px-2">
                    {note.uid} - {note.name} {note.pinned && '(Pinned)'}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
