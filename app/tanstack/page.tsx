'use client'

import InfiniteQueryTest from '../components/TanstackQueryExample/TanstackQueryExample'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function TanstackQueryPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <title>TQ + Virtual</title>
      <InfiniteQueryTest />
    </QueryClientProvider>
  )
}
