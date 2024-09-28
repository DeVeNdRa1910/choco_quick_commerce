import React from 'react'
import NewsLetter from '../components/NewsLatter'
import { BackgroundBeams } from '@/components/ui/BackgroundBeams'
import Header from '../components/Header'

function page() {
  return (
    <div>
      <Header />
      <NewsLetter />
      <BackgroundBeams />
    </div>
  )
}

export default page
