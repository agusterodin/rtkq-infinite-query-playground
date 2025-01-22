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
      let notes = generateMockNotes()

      const { offset: rawOffset, limit: rawLimit, searchText: rawSearchText, pinnedOnly: pinnedOnlyRaw } = request.queryParams

      const offset = typeof rawOffset === 'string' ? parseInt(rawOffset) : NaN
      const limit = typeof rawLimit === 'string' ? parseInt(rawLimit) : NaN
      const searchText = typeof rawSearchText === 'string' ? rawSearchText : ''
      const pinnedOnly = pinnedOnlyRaw === 'true'

      console.log('Server received request', { limit, offset, pinnedOnly, searchText })

      if (searchText) {
        notes = notes.filter(note => note.uid.toLowerCase().includes(searchText.toLowerCase()))
      }

      if (pinnedOnly) {
        notes = notes.filter(note => note.pinned)
      }

      const totalFilteredCount = notes.length

      if (!isNaN(offset) && !isNaN(limit)) {
        notes = notes.slice(offset, offset + limit)
      }

      await new Promise(resolve => setTimeout(resolve, 2000))

      const nextOffset = offset + limit < totalFilteredCount ? offset + limit : undefined

      return { notes, nextOffset }
    }),
      this.passthrough()
  }
})
