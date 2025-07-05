import ProfileView from '@/components/Student/Profile'
import { checkRole } from '@/lib/checkRole'
import React from 'react'

export default async function MyProfile() {
  await checkRole(['student']) 
  return (
    <div className='overflow-x-hidden'>
        <ProfileView />
    </div>
  )
}
