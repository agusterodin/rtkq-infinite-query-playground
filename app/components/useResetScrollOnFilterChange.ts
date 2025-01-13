import { Virtualizer } from '@tanstack/react-virtual'
import { omit } from 'lodash'
import { useDeepCompareEffect } from 'react-use'

// Resets virtual scroll position back to top of list when new filters (eg: search text) are set.

// Typically in a standard non-virtualized list, We would set parent container's "key" attribute with some sort of serialized version of the filters
// which would cause a new DOM element to be created and the scroll position to be reset. Unfortunately, scroll position is preserved
// in a virtualized setup so changing the element's "key" attribute had no effect.

export default function useResetScrollOnFilterChange(pageParams: Record<string, any>[] | undefined, rowVirtualizer: Virtualizer<any, any>) {
  const currentPageParams = pageParams?.[0] || {}
  const currentPageFilters = omit(currentPageParams, 'offset', 'limit')

  useDeepCompareEffect(() => {
    rowVirtualizer.scrollToIndex(0)
  }, [currentPageFilters])
}
