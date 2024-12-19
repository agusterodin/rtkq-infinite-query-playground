'use client'

import { createServer } from 'miragejs'
import { Note } from './lib/notesApi'

function generateMockNotes(offset: number, limit: number): Note[] {
  const notes: Note[] = []
  for (let i = offset; i < offset + limit; i++) {
    notes.push({ uid: i.toString(), name: `Note ${i}` })
  }
  return notes
}

createServer({
  routes() {
    this.get('/mock/notes', (schema, request) => {
      const { offset, limit } = request.queryParams
      return { notes: generateMockNotes(parseInt(offset as string), parseInt(limit as string)), totalCount: 1000 }
    })
  }
})
