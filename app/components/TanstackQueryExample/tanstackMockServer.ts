import { generateMockNotes } from '@/app/components/ReduxToolkitExample/reduxToolkitMockServer'
import { Note } from '@/state/notesApi'

interface FetchPageParameters {
  limit: number
  offset: number
  searchText: string
  pinnedOnly: boolean
}

export async function fetchServerPage({ limit, offset, pinnedOnly, searchText }: FetchPageParameters) {
  let notes = generateMockNotes()

  console.log('Server received request', { limit, offset, pinnedOnly, searchText })

  if (searchText) {
    notes = notes.filter(note => note.uid.toLowerCase().includes(searchText.toLowerCase()))
  }

  if (pinnedOnly) {
    notes = notes.filter(note => note.pinned)
  }

  const totalFilteredCount = notes.length

  notes = notes.slice(offset, offset + limit)

  await new Promise(resolve => setTimeout(resolve, 2000))

  const nextOffset = offset + limit < totalFilteredCount ? offset + limit : undefined

  return { notes, nextOffset }
}
