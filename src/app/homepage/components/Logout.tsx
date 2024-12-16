import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Logout() {
  const router = useRouter()

  useEffect(() => {
    // Add your logout logic here (e.g., clearing authentication tokens, session cleanup)
    console.log('User logged out')
    router.replace('/landingpage') // Redirect to login page after logout
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-xl font-bold">Logging you out...</h1>
    </div>
  )
}
