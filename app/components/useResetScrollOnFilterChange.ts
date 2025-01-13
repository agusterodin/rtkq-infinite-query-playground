import { Virtualizer } from '@tanstack/react-virtual'
import { omit } from 'lodash'
import { useDeepCompareEffect } from 'react-use'

// Resets virtual scroll position back to top of list when new filters (eg: search text) are set.

// Typically in a standard non-virtualized list, I would set parent container's "key" attribute with some sort of serialized version of the filters
// which would cause a new DOM element to be created and the scroll position to be reset. Unfortunately, scroll position is preserved
// in a virtualized setup so changing the element's "key" attribute has no effect.

// This solution doesn't feel good. For starters, I can't think of a decent way to abstract it into it's own custom hook that can be reused for
// any usage of the offset + limit pagination pattern. I also don't feel good about the way I am serializing the page filters.

// For abstraction into a custom hook, my first thought would be to have the hook take in two parameters: a "parameters" object
// which would take in any object (no expected named keys and any value type is ok as long as it is serializable) and a rowVirtualizer
// parameter (so that we can use scrollToIndex when necessary).
// Using the hook, would look like something like this: useResetScrollOnFilterChange(infiniteQuery.data?.pageParams?.[0], rowVirtualizer).
// I could make the first parameter expect an array of objects (eg: infiniteQuery.data?.pageParams) instead to make consumption of the hook a
// little bit cleaner.

// As for the page filter serialization, using JSON.stringify feels like a flaky hack. The ordering of the keys in the filter object
// aren't guaranteed. This would mean if for some reason our filters object reference changed in state and the only thing that was different about the
// was that the keys were in a different order, our list would reset scroll position against the user's will. We could
// manually manipulate/process the object to sort keys alphabetically before comparing to make things more stable, but i'd prefer not to
// go down this path if there is a more elegant solution recommended by the RTK maintainers. Regardless, i'm fine with the scroll position resetting
// in the case where a deeply nested object has keys in a different order.

// Note that I had to use the approach, I love to take advantage of Lodash's isEqual function since it doesn't care about the ordering of keys
// Unfortunately, I don't think I can take advantage of that function in the useEffect dependency array.
// Maybe I should take advantage of a custom hook like this https://github.com/kentcdodds/use-deep-compare-effect

export default function useResetScrollOnFilterChange(pageParams: Record<string, any>[] | undefined, rowVirtualizer: Virtualizer<any, any>) {
  const currentPageParams = pageParams?.[0] || {}
  const currentPageFilters = omit(currentPageParams, 'offset', 'limit')

  useDeepCompareEffect(() => {
    rowVirtualizer.scrollToIndex(0)
  }, [currentPageFilters])
}
