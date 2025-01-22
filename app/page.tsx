'use client'

import Link from 'next/link'

export default function IndexPage() {
  return (
    <div className='flex flex-col'>
      <Link href="redux-toolkit">RTKQ + Virtual</Link>
      <Link href="">Tanstack Query + Virtual</Link>
    </div>
  )
}
