import { redirect } from 'next/navigation'
import { createClient } from '@/lib/server'

export async function checkRole(allowedRoles: string[]) {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()

  // If no user is found, redirect to login
  if (!authData?.user) {
    redirect('/auth/login')
    return
  }

  // Fetch the user profile and check the role
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', authData.user.id)
    .single()

  if (error || !profile) {
    redirect('/auth/login')
    return
  }

  if (!profile.role) {
    redirect('/') 
    return
  }


  // Check if the profile role is in the allowed roles
  if (!allowedRoles.includes(profile.role)) {
    // Redirect based on the user's role
    switch (profile.role) {
      case 'admin':
        redirect('/admin')
        break
      case 'student':
        const { data: onboardingData, error:onboardingerror } = await supabase
          .from('students')
          .select('terms_accepted')
          .eq('user_id', authData.user.id)
          .single()
        
        if (onboardingerror) {
          redirect('/student/onboardingForm')
        }
        
        if (onboardingData?.terms_accepted) {
          redirect('/student/onboardingForm')
        } else {
          redirect('/student/onboardingForm')
        }
        break
      default:
        redirect('/student')
    }
    return
  }

  // Return profile if role is valid
  return profile
}
