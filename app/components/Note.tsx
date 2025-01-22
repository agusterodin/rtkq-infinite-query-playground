import { Note } from '@/state/notesApi'
import React from 'react'

interface Props {
  note: Note
}

function NoteItem({ note }: Props) {
  return (
    <div className="px-2">
      {note.uid} - {note.name} {note.pinned && '(Pinned)'}
    </div>
  )
}

export default React.memo(NoteItem)
