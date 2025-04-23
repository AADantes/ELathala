import { UserLevelRewards } from "@/components/user-level-rewards"

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          {/* Title with Dark Sky Blue */}
          <h1 className="text-4xl md:text-5xl font-bold text-sky-800 mb-3">
            Writer's Journey
          </h1>
          {/* Subtitle/Text in Black */}
          <p className="text-black text-lg max-w-2xl mx-auto">
            Track your progress, earn rewards, and level up your writing skills
          </p>
        </div>
        {/* User Level Rewards Component */}
        <UserLevelRewards />
      </div>
    </main>
  )
}
