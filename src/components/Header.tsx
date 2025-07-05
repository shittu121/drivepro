/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { Home, User, LogIn, UserPlus, LogOut } from 'lucide-react'
import { NavBar } from "@/components/ui/navbar"
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/client'
import { useRouter, usePathname } from 'next/navigation'
import type { NavItem } from '@/components/ui/navbar'

export function Header() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null)
    })
    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  // Handler for logout nav item
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  let navItems: NavItem[] = [
    { name: 'Home', url: '/student', icon: Home },
    { name: 'Manage Account', url: '/student/my_profile', icon: User },
  ]

  if (!user) {
    navItems = [
      ...navItems,
      { name: 'Login', url: '/auth/login', icon: LogIn },
      { name: 'Sign Up', url: '/auth/sign-up', icon: UserPlus }
    ]
  } else {
    navItems = [
      ...navItems,
      { name: 'Logout', url: '#logout', icon: LogOut, onClick: handleLogout }
    ]
  }

  // Determine active tab based on current pathname
  const getActiveTab = () => {
    if (pathname === '/student') return 'Home'
    if (pathname === '/student/my_profile') return 'Manage Account'
    if (pathname === '/auth/login') return 'Login'
    if (pathname === '/auth/sign-up') return 'Sign Up'
    return 'Home' // default
  }

  return <NavBar items={navItems} activeTab={getActiveTab()} />
}