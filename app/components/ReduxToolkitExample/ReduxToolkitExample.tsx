'use client'

import { useRef } from 'react'
import Searchbox from '../Searchbox'
import OnlyShowPinnedCheckbox from '../PinnedCheckbox'
import Note from '../Note'
import React from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import useDebouncedSearchText from '../useDebouncedSearchText'
import { useAppSelector } from '@/state/store'
import { getPinnedOnly } from '@/state/notes'
import { NoteFilters, useGetNotesCursorInfiniteQuery } from '@/state/notesApi'

export default function VirtualInfiniteQueryTest() {
  const searchText = useDebouncedSearchText()
  const pinnedOnly = useAppSelector(getPinnedOnly)

  const parentRef = useRef<HTMLDivElement>(null)

  const filters: NoteFilters = {
    searchText,
    pinnedOnly
  }

  const { data, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage } = useGetNotesCursorInfiniteQuery(filters, {
    initialPageParam: { offset: 0, ...filters }
  })

  const fetchedNotes = data ? data.pages.flatMap(queryPage => queryPage.notes) : []

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? fetchedNotes.length + 1 : fetchedNotes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 23,
    overscan: 50
  })

  React.useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse()

    if (!lastItem) {
      return
    }

    if (lastItem.index >= fetchedNotes.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, fetchNextPage, fetchedNotes.length, isFetchingNextPage, rowVirtualizer.getVirtualItems()])

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
            height: rowVirtualizer.getTotalSize()
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
                  height: virtualRow.size,
                  transform: `translateY(${virtualRow.start}px)`
                }}
              >
                {isLoaderRow && hasNextPage ? 'Loading more items...' : <Note {...{ note }} />}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
