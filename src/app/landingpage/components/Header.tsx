'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation' // Import useRouter from Next.js
import Link from 'next/link'
import { Pen } from 'lucide-react'
import { Button } from "@/app/landingpage/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/app/landingpage/ui/dialog"
import { Input } from "@/app/landingpage/ui/input"
import { Label } from "@/app/landingpage/ui/label"
import  supabase  from "../../../../config/supabaseClient"

export default function Header() {
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // Use Supabase's signInWithPassword method
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    })

    if (error) {
      setErrorMessage(error.message) // Show error message on failure
    } else {
      // Redirect to another page on successful login
      router.push('/homepage') // Adjust the path as needed
    }

    // Reset form fields
    setLoginEmail('')
    setLoginPassword('')
  }

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center border border-gray-300">
      <Link className="flex items-center justify-center" href="#">
        <Pen className="h-6 w-6 mr-2 text-primary" />
        <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">Elathala</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        {/* Other navigation links */}
      </nav>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="ml-4" variant="outline">Log In</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Log in to Elathala</DialogTitle>
            <DialogDescription>
              Enter your email and password to access your account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}
            <Button type="submit" className="w-full">Log In</Button>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  )
}