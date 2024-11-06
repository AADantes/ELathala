import { Header } from '@/app/homepage/components/Header'
import { UserPanel } from '@/app/homepage/components/UserPanel'
import { WritingHistoryPanel } from '@/app/homepage/components/WritingHistoryPanel'
import { StartWritingButton } from '@/app/homepage/components/StartWritingButton'

// Mock data for demonstration
const userData = {
  username: "JohnDoe",
  experience: 7500,
  level: 15,
  totalExperience: 10000,
  works: [
    { id: 1, title: "My First Story", wordCount: 1500, timeSpent: 120 },
    { id: 2, title: "Poetry Collection", wordCount: 500, timeSpent: 60 },
    { id: 3, title: "Novel Chapter 1", wordCount: 3000, timeSpent: 180 },
  ],
}

export default function HomePage() {
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