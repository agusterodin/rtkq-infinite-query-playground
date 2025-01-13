import { useEffect } from 'react'
import { Virtualizer } from '@tanstack/react-virtual'

// Runs callback function when the loader row becomes within view. The "loader row" is a row that we include at the bottom of our
// virtualized list when we know there are more items to fetch that satisfy the currently set filters. Tanstack Virtual's "overscan" setting
// serves as a lookahead for off-screen items. The loader row will be deemed "in view" if it is within the specified lookahead distance.

interface Parameters {
  rowVirtualizer: Virtualizer<Element, Element>
  fetchedItems: Array<any>
}

export default function useOnLoaderRowInView({ fetchedItems, rowVirtualizer }: Parameters, handler: () => void) {
  useEffect(() => {
    const virtualItems = rowVirtualizer.getVirtualItems()
    const lastVirtualItem = virtualItems[virtualItems.length - 1]

    if (lastVirtualItem && lastVirtualItem.index >= fetchedItems.length) {
      handler()
    }
  }, [rowVirtualizer.getVirtualItems(), fetchedItems.length, handler])
}
