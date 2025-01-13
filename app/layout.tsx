import type { ReactNode } from 'react'
import { StoreProvider } from './StoreProvider'
import '../mockServer'
import '../index.css'

interface Props {
  children: ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <StoreProvider>
      <html lang="en">
        <body>
          <title>RTKQ + Tanstack Virtual</title>
          <section>
            <main>{children}</main>
          </section>
        </body>
      </html>
    </StoreProvider>
  )
}
