'use client'

import { createServer } from 'miragejs'
import { Note } from '../../../state/notesApi'

export function generateMockNotes(): Note[] {
  const notes: Note[] = []
  for (let i = 0; i < 5000; i++) {
    notes.push({ uid: i.toString(), name: `Note ${i}`, pinned: i % 3 === 0 })
  }
  return notes
}

createServer({
  routes() {
    this.get('/mock/notes', async (schema, request) => {
      const { offset, limit, searchText, pinnedOnly } = request.queryParams

      let notes = generateMockNotes()

      if (searchText && typeof searchText === 'string') {
        notes = notes.filter(note => note.uid.toLowerCase().includes(searchText.toLowerCase()))
      }

      if (pinnedOnly === 'true') {
        notes = notes.filter(note => note.pinned)
      }

      const totalCount = notes.length

      if (typeof offset === 'string' && typeof limit === 'string') {
        notes = notes.slice(parseInt(offset), parseInt(offset) + parseInt(limit))
      }

      await new Promise(resolve => setTimeout(resolve, 2000))

      return { notes, totalCount }
    }),
      this.passthrough()
  }
})
