import { getSearchText } from '@/state/notes'
import { useAppSelector } from '@/state/store'
import { useDebounce } from 'use-debounce'

// Debounces searchbox text so that we aren't hammering the server excessively as the user is typing.
// We use "flush" on empty text value so that the list updates immediately when no search text is set.
// Immediate flush on empty text behavior is especially desirable when the user clicks "x" button to clear the value.

export default function useDebouncedSearchText() {
  const searchText = useAppSelector(getSearchText)

  const [debouncedSearchInputValue, { flush }] = useDebounce(searchText, 2000)

  if (debouncedSearchInputValue !== '' && searchText === '') {
    flush()
  }

  return debouncedSearchInputValue
}
