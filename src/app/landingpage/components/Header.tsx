'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation' // Import useRouter from Next.js
import Link from 'next/link'
import { Pen } from 'lucide-react'
import { Button } from "@/app/landingpage/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/app/landingpage/ui/dialog"
import { Input } from "@/app/landingpage/ui/input"
import { Label } from "@/app/landingpage/ui/label"

export default function Header() {
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const router = useRouter() // Initialize useRouter

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Replace these with the actual credentials
    const correctEmail = 'user@example.com'
    const correctPassword = 'password123'

    if (loginEmail === correctEmail && loginPassword === correctPassword) {
      // Redirect to another page on successful login
      router.push('/homepage') // Adjust the path as needed
    } else {
      alert('Incorrect email or password')
    }

    // Reset form fields
    setLoginEmail('')
    setLoginPassword('')
  }

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center">
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
            <Button type="submit" className="w-full">Log In</Button>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  )
}
