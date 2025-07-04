"use client"
import { Home, User, Briefcase, FileText, LogIn, UserPlus, LogOut, Shield } from 'lucide-react'
import { NavBar } from "@/components/ui/navbar"
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/client'
import { useRouter } from 'next/navigation'
import type { NavItem } from '@/components/ui/navbar'

export function Header() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

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
    { name: 'Home', url: '/', icon: Home },
    { name: 'About', url: '#', icon: User },
    { name: 'Projects', url: '#', icon: Briefcase },
    { name: 'Resume', url: '#', icon: FileText }
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
      { name: 'Protected', url: '/protected', icon: Shield },
      { name: 'Logout', url: '#logout', icon: LogOut, onClick: handleLogout }
    ]
  }

  return <NavBar items={navItems} />
}