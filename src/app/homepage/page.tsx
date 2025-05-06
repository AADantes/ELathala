'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/app/homepage/components/Header";
import { UserPanel } from "@/app/homepage/components/UserPanel";
import { WritingHistoryPanel } from "@/app/homepage/components/WritingHistoryPanel";
import { StartWritingButton } from "@/app/homepage/components/StartWritingButton";
import DailyStreak from "@/app/homepage/components/DailyStreak"; // Import the DailyStreak component
import supabase from "../../../config/supabaseClient";

export default function HomePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [works, setWorks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false); // Add this state

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
  
      // Get the currently authenticated user
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();
  
      if (authError || !authUser) {
        console.error("Error fetching auth user:", authError);
        router.push("/login");
        return;
      }
  
      console.log("Authenticated UID:", authUser.id);
  
      // Fetch user profile from User table using auth_user_id
      const { data, error } = await supabase
        .from("User") // Or "user" depending on your table naming
        .select("username, userLevel, usercurrentExp, targetExp, userCredits")
        .eq("id", authUser.id) // <-- Match by UID
        .single();
  
      if (error) {
        console.error("Error fetching user profile:", error);
        setLoading(false);
        return;
      }
  
      if (data) {
        setUserData({
          username: data.username ?? "Unknown User",
          experience: data.usercurrentExp ?? 0,
          level: data.userLevel ?? 1,
          totalExperience: data.targetExp ?? 100,
          credits: data.userCredits ?? 0, // Add this if needed
        });
      }

      // Fetch written works
      const { data: writtenWorks, error: worksError } = await supabase
        .from("Written Works")
        .select("workID, numberofWords, noOfWordsSet, timelimitSet, timeRendered")
        .eq("id", authUser.id);

      if (worksError) {
        console.error("Error fetching written works:", worksError);
      }

      if (writtenWorks) {
        setWorks(writtenWorks);
      }

      setLoading(false);
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!userData) {
    return <div className="min-h-screen flex items-center justify-center">No user data found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Pass the necessary props to UserPanel */}
          <UserPanel 
            userData={userData} 
            isExperienceDialogOpen={isExperienceDialogOpen} 
            setIsExperienceDialogOpen={setIsExperienceDialogOpen} 
          />
          <WritingHistoryPanel works={works} />
        </div>
        <div className="mt-8 flex justify-center">
          {/* Move Start Writing Button above Daily Streak */}
          <StartWritingButton />
        </div>
        <div className="mt-8">
          {/* Add the DailyStreak component */}
          <DailyStreak />
        </div>
      </main>
    </div>
  );
}
