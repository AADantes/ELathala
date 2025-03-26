"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/app/homepage/components/Header"
import { UserPanel } from "@/app/homepage/components/UserPanel"
import { WritingHistoryPanel } from "@/app/homepage/components/WritingHistoryPanel"
import { StartWritingButton } from "@/app/homepage/components/StartWritingButton"
import supabase from "../../../config/supabaseClient"

export default function HomePage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)

      // Get the current authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        console.error("Error fetching user:", authError)
        router.push("/login")
        return
      }

      // Fetch user details
      const { data: userData, error: userError } = await supabase
        .from("User")
        .select("id, username, userLevel, usercurrentExp, targetExp")
        .eq("id", user.id)
        .single()

      if (userError) {
        console.error("Error fetching user data:", userError)
        setLoading(false)
        return
      }

      // Fetch user's works
      const { data: works, error: worksError } = await supabase
        .from("works")
        .select("id, title, wordCount, timeSpent")
        .eq("user_id", user.id) // Ensure `user_id` exists in `works` table

      if (worksError) {
        console.error("Error fetching works:", worksError)
      }

      setUserData({ ...userData, works: works || [] })
      setLoading(false)
    }

    fetchUserData()
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!userData) {
    return <div className="min-h-screen flex items-center justify-center">No user data found</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          <UserPanel userData={userData} />
          <WritingHistoryPanel works={userData.works} />
        </div>
        <StartWritingButton />
      </main>
    </div>
  )
}
