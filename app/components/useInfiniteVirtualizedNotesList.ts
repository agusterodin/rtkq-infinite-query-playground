import { RefObject } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { NoteFilters, useGetNotesCursorInfiniteQuery } from 'state/notesApi'
import useDebouncedSearchText from './useDebouncedSearchText'
import useOnLoaderRowInView from './useOnLoaderRowInView'
import useResetScrollOnFilterChange from './useResetScrollOnFilterChange'
import { useAppSelector } from '@/state/store'
import { getPinnedOnly } from '@/state/notes'

// An attempt to abstract the virtualization and infinite query logic out of the component so that
// things are easier to follow. Not sure if this is the ideal abstraction. It doesn't seem obvious how to,
// but perhaps I can make this work generically with any RTKQ infinite query hook so that I don't repeat
// this logic any time I want to implement a virtualized infinite list for another endpoint.

export default function useInfiniteVirtualizedNotesList<T extends HTMLElement | null>(parentRef: RefObject<T>) {
  const searchText = useDebouncedSearchText()
  const pinnedOnly = useAppSelector(getPinnedOnly)

  const filters: NoteFilters = {
    searchText,
    pinnedOnly
  }

  const infiniteQuery = useGetNotesCursorInfiniteQuery(filters, {
    // pollingInterval: 100000,
    initialPageParam: { offset: 0, ...filters }
  })

  const { hasNextPage, data, fetchNextPage, isFetchingNextPage } = infiniteQuery

  const fetchedNotes = data ? data.pages.flatMap(queryPage => queryPage.notes) : []

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? fetchedNotes.length + 1 : fetchedNotes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 23,
    overscan: 50
  })

  useOnLoaderRowInView({ rowVirtualizer, fetchedItems: fetchedNotes }, () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  })

  useResetScrollOnFilterChange(data?.pageParams, rowVirtualizer)

  return {
    fetchedNotes,
    infiniteQuery,
    rowVirtualizer
  }
}
