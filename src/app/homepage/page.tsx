"use client";

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

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      // Get the currently authenticated user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("Error fetching user:", authError);
        router.push("/login");
        return;
      }

      // Fetch user profile data
      const { data, error } = await supabase
        .from("User")
        .select("id, username, userLevel, usercurrentExp, targetExp")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
        return;
      }

      if (data) {
        setUserData({
          username: data.username ?? "Unknown User",
          experience: data.usercurrentExp ?? 0,
          level: data.userLevel ?? 1,
          totalExperience: data.targetExp ?? 100,
        });
      }

      // Fetch written works
      const { data: writtenWorks, error: worksError } = await supabase
        .from("Written Works")
        .select("workID, numberofWords, noOfWordsSet, timelimitSet, timeRendered")
        .eq("id", user.id);

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
          <UserPanel userData={userData} />
          <WritingHistoryPanel works={works} />
        </div>
        <div className="mt-8">
          {/* Add the DailyStreak component */}
          <DailyStreak />
        </div>
        <div className="mt-8 flex justify-center">
          <StartWritingButton />
        </div>
      </main>
    </div>
  );
}
