import { HeroSection } from '@/components/Student/StudentHeroSection'
import { checkRole } from '@/lib/checkRole'
import React from 'react'

export default async function Student() {
  await checkRole(['student']) 
  return (
    <div>
        <HeroSection className='overflow-hidden h-screen' />
    </div>
  )
}
