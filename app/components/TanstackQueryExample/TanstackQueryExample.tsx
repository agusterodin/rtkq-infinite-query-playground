'use client'

import React from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import Searchbox from '../Searchbox'
import OnlyShowPinnedCheckbox from '../PinnedCheckbox'
import { useAppSelector } from '@/state/store'
import { getPinnedOnly } from '@/state/notes'
import { fetchServerPage } from './tanstackMockServer'
import Note from '../Note'
import useDebouncedSearchText from '../useDebouncedSearchText'
import { NoteFilters, PAGE_SIZE } from '@/state/notesApi'

export default function App() {
  const searchText = useDebouncedSearchText()
  const pinnedOnly = useAppSelector(getPinnedOnly)

  const parentRef = React.useRef<HTMLDivElement>(null)

  const filters: NoteFilters = {
    searchText,
    pinnedOnly
  }

  const { status, data, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['projects', searchText, pinnedOnly],
    queryFn: ctx => fetchServerPage({ limit: PAGE_SIZE, offset: ctx.pageParam, ...filters }),
    getNextPageParam: lastGroup => lastGroup.nextOffset,
    initialPageParam: 0
  })

  const fetchedNotes = data ? data.pages.flatMap(d => d.notes) : []

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

  if (status === 'pending') {
    return <div>Loading...</div>
  }

  if (status === 'error') {
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
