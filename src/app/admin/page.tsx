import AdminDashboard from '@/components/Admin'
import { checkRole } from '@/lib/checkRole'
import React from 'react'

export default async function Admin() {
  await checkRole(['admin']) 
  return (
    <div className='flex justify-center'>
        {/* <h1 className='text-center text-7xl my-auto mt-20'>Admin Page IN PROGRESS</h1> */}
        <AdminDashboard />
    </div>
  )
}
