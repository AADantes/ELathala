"use client"

import Link from "next/link"
import { Header } from "@/app/homepage/components/Header"
import { HelpCircle, User, FileText, CheckCircle, Star, Bell } from "lucide-react"

export default function HelpPage() {
  const helpContent = [
    {
      title: "Welcome to E-LATHALA! Need assistance?",
      content: "We're here to help you get started and make the most of your writing journey. Whether you're new or just need a refresher, this guide will walk you through everything you need to know.",
      icon: <HelpCircle className="text-blue-600" size={24} />
    },
    {
      title: "Getting Started",
      content: "<strong>Register/Login</strong> – Create an account or sign in to access your personal writing dashboard.\n\n<strong>User Profile</strong> – Update your display name, track your writing stats, and view your current level.\n\n<strong>Create Writing Task</strong> – Click 'Start Writing' to select a topic, adjust word count, set a timer, or choose a genre-based challenge.",
      icon: <User className="text-teal-600" size={24} />
    },
    {
      title: "Auto-Save on Completion",
      content: "Your writing session will be automatically saved when both the word count and time limit requirements are successfully met.",
      icon: <CheckCircle className="text-green-600" size={24} />
    },
    {
      title: "Manual Save with Credits",
      content: "If you stop writing before completing the set word count or time limit, you will need to use in-game credits to manually save your work. This encourages focus and rewards consistent progress.",
      icon: <FileText className="text-yellow-600" size={24} />
    },
    {
      title: "Reminder:",
      content: "Incomplete tasks without a credit-based save will be discarded to maintain system integrity and motivation-based writing.",
      icon: <Bell className="text-orange-600" size={24} />
    },
    {
      title: "Earn Points & Credits",
      content: "Complete tasks to gain XP and in-game currency.",
      icon: <Star className="text-purple-600" size={24} />
    },
    {
      title: "Unlock Levels",
      content: "Level up to access harder challenges and unlock new prompts.",
      icon: <Star className="text-indigo-600" size={24} />
    },
    {
      title: "Rewards",
      content: "Use earned credits to save work, unlock bonus themes, or view performance insights.",
      icon: <Star className="text-pink-600" size={24} />
    },
    {
      title: "Saved Works",
      content: "View all saved drafts and completed writing tasks.",
      icon: <FileText className="text-teal-600" size={24} />
    },
    {
      title: "Progress Tracker",
      content: "Monitor your daily writing streaks, points earned, and overall improvements.",
      icon: <CheckCircle className="text-green-600" size={24} />
    },
    {
      title: "Daily Prompts",
      content: "Get fresh ideas and themes to keep writing fun.",
      icon: <Bell className="text-yellow-600" size={24} />
    },
    {
      title: "Timed Challenges",
      content: "Boost your creativity under pressure by setting a time limit.",
      icon: <CheckCircle className="text-blue-600" size={24} />
    },
    {
      title: "Genre Quests",
      content: "Practice writing across different genres like poetry, fiction, essays, or personal narratives.",
      icon: <Star className="text-red-600" size={24} />
    },
    {
      title: "Admin Support (if applicable)",
      content: "Reporting Issues – Found a bug or error? Use the 'Report Issue' form.\n\nFeedback & Suggestions – Help us improve by submitting your thoughts in the 'Feedback' tab.\n\nNeed More Help? – Contact our team at support@elathala.com or chat with us via the message icon.",
      icon: <User className="text-gray-600" size={24} />
    },
    {
      title: "Tips:",
      content: "Keep writing consistently to maintain your streaks.\n\nCustomize tasks to match your writing goals.\n\nExplore your performance report to track improvement over time.",
      icon: <Bell className="text-green-600" size={24} />
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <section className="space-y-8">
          {helpContent.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
            >
              <div className="flex items-center gap-4 mb-4">
                {item.icon}
                <h2 className="text-2xl font-semibold text-gray-800">{item.title}</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line" dangerouslySetInnerHTML={{ __html: item.content }}></p>
            </div>
          ))}
        </section>

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            Still have questions?{" "}
            <Link href="/contact" className="text-blue-600 font-semibold underline">
              Contact Us
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
