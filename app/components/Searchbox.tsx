import { useAppDispatch, useAppSelector } from 'state/store'
import { getSearchText, setSearchText } from 'state/notes'

export default function Searchbox() {
  const dispatch = useAppDispatch()
  const searchText = useAppSelector(getSearchText)

  return (
    <div className="flex relative w-fit">
      <div className="mr-2">Search:</div>
      <input
        className="border rounded"
        value={searchText}
        onChange={event => {
          dispatch(setSearchText(event.target.value))
        }}
      />
      {searchText !== '' && (
        <button
          className="absolute right-0 inset-y-0 cursor-pointer px-2"
          onClick={() => {
            dispatch(setSearchText(''))
          }}
        >
          X
        </button>
      )}
    </div>
  )
}
