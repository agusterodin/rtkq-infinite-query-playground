import type { ReactNode } from 'react'
import { StoreProvider } from './StoreProvider'
import './components/ReduxToolkitExample/reduxToolkitMockServer'
import '../index.css'

interface Props {
  children: ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <StoreProvider>
      <html lang="en">
        <body>
          <section>
            <main>{children}</main>
          </section>
        </body>
      </html>
    </StoreProvider>
  )
}
