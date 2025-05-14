'use client'

import Link from "next/link"
import { FileText, Search } from "lucide-react"
import { Button } from "../works/components/ui/button"
import { Input } from "../works/components/ui/input"
import { Header } from "../homepage/components/Header"
import supabase from "../../../config/supabaseClient"
import { useEffect, useState } from "react"

export default function SavedDocuments() {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchDocuments = async () => {
      const { data: user, error: userError } = await supabase.auth.getUser()
      if (userError) {
        console.error("Error fetching user:", userError)
        return
      }

      if (user) {
        const { data, error } = await supabase
          .from("worksFolder")
          .select("title, fileUrl, date_saved")
          .eq("userID", user.user.id)

        if (error) {
          console.error("Error fetching documents:", error)
        } else {
          setDocuments(data)
        }
      }
      setLoading(false)
    }

    fetchDocuments()
  }, [])

  const handleDownload = (fileUrl: string) => {
    window.open(fileUrl, "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex flex-col">
      <Header />

      <header className="border-b bg-white dark:bg-gray-900 shadow-sm">
        <div className="container mx-auto max-w-7xl flex h-24 items-center justify-center px-6">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white tracking-tight">
            My Saved Documents
          </h1>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-start w-full px-6 py-12">
        <div className="mb-10 w-full max-w-7xl flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documents..."
              className="pl-10 h-12 text-base rounded-md border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="w-full max-w-7xl rounded-xl border bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 divide-y">
            {loading ? (
              <div className="flex justify-center items-center py-16 text-lg text-muted-foreground">Loading...</div>
            ) : documents.length > 0 ? (
              documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-center justify-between p-6 gap-6 sm:gap-4 transition-all hover:bg-muted/30"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="flex h-14 w-14 items-center justify-center rounded-md border bg-background shadow-sm">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-lg font-medium text-gray-900 dark:text-white">{doc.title}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                    {doc.date_saved && (
                      <p className="text-sm text-muted-foreground">
                        Saved on {new Date(doc.date_saved).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-sm px-6 py-2"
                      onClick={() => handleDownload(doc.fileUrl)}
                    >
                      View & Download
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="mt-20 flex flex-col items-center justify-center p-10 text-center">
                <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">No documents yet</h3>
                <p className="text-base text-muted-foreground">
                  You haven't saved any documents. Start writing to begin saving your work!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
