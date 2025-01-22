'use client'

import Link from 'next/link'

export default function IndexPage() {
  return (
    <div className="flex flex-col">
      <Link href="redux">RTKQ + Virtual</Link>
      <Link href="tanstack">Tanstack Query + Virtual</Link>
    </div>
  )
}
