import { Header } from "../homepage/components/Header";
import { UserLevelRewards } from "../writingrewards/user-level-rewards";

export default function Page() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-8 px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
              Writer's Journey
            </h1>
            <p className="text-black text-base max-w-3xl mx-auto">
              Track your progress, earn rewards, and level up your writing skills
            </p>
          </div>
          <UserLevelRewards />
        </div>
      </main>
    </>
  );
}
