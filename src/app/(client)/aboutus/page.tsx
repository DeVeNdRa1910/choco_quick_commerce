import React from 'react'
import Header from '../components/Header'
import { BackgroundBeams } from '@/components/ui/BackgroundBeams'
import About from '../components/About'

function page() {
  return (
    <div>
      <Header />
      <div className='flex items-center justify-center'>
        <About />
      </div>
      {/* <BackgroundBeams /> */}
    </div>
  )
}

export default page
