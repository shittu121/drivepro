import { checkRole } from '@/lib/checkRole'

export default async function Protected() {
  await checkRole(['']) 
  return (
    <> 
    </>
  )
}
