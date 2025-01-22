import { getPinnedOnly, setPinnedOnly } from '@/state/notes'
import { useAppDispatch, useAppSelector } from '@/state/store'

export default function OnlyShowPinnedCheckbox() {
  const dispatch = useAppDispatch()
  const onlyShowPinned = useAppSelector(getPinnedOnly)

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id="show-pinned"
        className="mr-2"
        checked={onlyShowPinned}
        onChange={event => {
          dispatch(setPinnedOnly(event.target.checked))
        }}
      />
      <label htmlFor="show-pinned">Only show pinned</label>
    </div>
  )
}
