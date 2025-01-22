import { useEffect } from 'react'
import { Virtualizer } from '@tanstack/react-virtual'

// Runs callback function when the loader row becomes within view. The "loader row" is a row that we include at the bottom of our
// virtualized list when we know there are more items to fetch that satisfy the currently set filters. Tanstack Virtual's "overscan" setting
// serves as a lookahead for off-screen items. The loader row will be deemed "in view" if it is within the specified lookahead distance.

// TODO IS THERE A WAY TO PASS IN THE "infiniteQuery" INSTEAD? I DON'T NEED A SOLID TYPE

interface Parameters {
  rowVirtualizer: Virtualizer<Element, Element>
  fetchedItems: Array<any>
  infiniteQuery: {
    hasNextPage: boolean
    isFetchingNextPage: boolean
    fetchNextPage: () => void
  }
}

export default function useFetchWhenLoaderRowInView({ rowVirtualizer, fetchedItems, infiniteQuery }: Parameters) {
  const { hasNextPage, isFetchingNextPage, fetchNextPage } = infiniteQuery

  useEffect(() => {
    const virtualItems = rowVirtualizer.getVirtualItems()
    const lastVirtualItem = virtualItems[virtualItems.length - 1]
    const loaderRowInView = lastVirtualItem ? lastVirtualItem.index >= fetchedItems.length - 1 : false

    if (loaderRowInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [rowVirtualizer.getVirtualItems(), fetchedItems.length, hasNextPage, isFetchingNextPage, fetchNextPage])
}
