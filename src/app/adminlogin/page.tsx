"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import  supabase  from "../../../config/supabaseClient"
import { Button } from "@/app/components/ui/Button"
import { Input } from "@/app/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card"

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
    } else {
      router.push("/admin") // Redirect to admin dashboard
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleLogin}>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div>
              <Input type="email" placeholder="Email" className="w-full" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Input type="password" placeholder="Password" className="w-full" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
