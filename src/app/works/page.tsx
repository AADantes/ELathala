'use client';

import Link from "next/link"
import { FileText, Search, Filter } from "lucide-react"
import { Button } from "../works/components/ui/button"
import { Input } from "../works/components/ui/input"
import { Header } from "../homepage/components/Header"
import supabase from "../../../config/supabaseClient"
import { useEffect, useState } from "react"

export default function SavedDocuments() {
  const [documents, setDocuments] = useState<any[]>([]) // Store documents fetched from the database
  const [loading, setLoading] = useState<boolean>(true)

  // Fetch current user ID and load documents
  useEffect(() => {
    const fetchDocuments = async () => {
      const { data: user, error: userError } = await supabase.auth.getUser() // Use getUser() instead of user()
      if (userError) {
        console.error("Error fetching user:", userError)
        return
      }

      if (user) {
        const { data, error } = await supabase
          .from("worksFolder")
          .select("title, fileUrl")
          .eq("userID", user.user.id) // Accessing user ID here

        if (error) {
          console.error("Error fetching documents:", error)
        } else {
          setDocuments(data) // Set the fetched documents in the state
        }
      }
      setLoading(false)
    }

    fetchDocuments()
  }, [])

  const handleDownload = (fileUrl: string) => {
    // Trigger file download
    window.location.href = fileUrl
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Simple Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6">
          <h1 className="text-lg font-semibold">My Saved Documents</h1>

        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6 sm:px-6">
        {/* Search and Filter */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search documents..." className="pl-8" />
          </div>
        </div>

        {/* Documents List */}
        <div className="rounded-lg border">
          <div className="grid grid-cols-1 divide-y">
            {loading ? (
              <div>Loading...</div>
            ) : documents.length > 0 ? (
              documents.map((doc, index) => (
                <div key={index} className="flex items-center p-4 transition-colors hover:bg-muted/50">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-md border bg-background">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium leading-none">{doc.title}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(doc.fileUrl)} // Download button
                  >
                    View and Download
                  </Button>
                </div>
              ))
            ) : (
              <div className="mt-16 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-medium">No documents yet</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  You haven't saved any documents. Start Writing and gain credits to save your work!.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
