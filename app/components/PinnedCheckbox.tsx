import { getPinnedOnly, setPinnedOnly } from '@/state/notes'
import { useAppDispatch, useAppSelector } from '@/state/store'
import { on } from 'events'

export default function OnlyShowPinnedCheckbox() {
  const dispatch = useAppDispatch()
  const onlyShowPinned = useAppSelector(getPinnedOnly)

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id="onlyShowPinned"
        className="mr-2"
        checked={onlyShowPinned}
        onChange={event => {
          dispatch(setPinnedOnly(event.target.checked))
        }}
      />
      <label htmlFor="onlyShowPinned">Only show pinned</label>
    </div>
  )
}
