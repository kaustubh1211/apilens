'use client'

import { useEffect, useState } from 'react'
import LoginPage from '@/app/login/page'
import ApiLensApp from '@/components/ApiLense'

export default function AuthWrapper() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null)

  // Function to check auth
  const checkAuth = () => {
    const token = sessionStorage.getItem('apilense_token')
    setIsAuth(!!token)
  }

  useEffect(() => {
    checkAuth()
  }, [])

  if (isAuth === null) return null // Or a loader

  // If not auth, pass the checkAuth function to LoginPage
  return isAuth ? (
    <ApiLensApp />
  ) : (
    <LoginPage onLoginSuccess={checkAuth} />
  )
}