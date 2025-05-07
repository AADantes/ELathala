'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/app/homepage/components/Header";
import { UserPanel } from "@/app/homepage/components/UserPanel";
import { WritingHistoryPanel } from "@/app/homepage/components/WritingHistoryPanel";
import { StartWritingButton } from "@/app/homepage/components/StartWritingButton";
import DailyStreak from "@/app/homepage/components/DailyStreak";
import supabase from "../../../config/supabaseClient";

export default function HomePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [works, setWorks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [showLevelUpAlert, setShowLevelUpAlert] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
    
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();
    
      if (authError || !authUser) {
        console.error("Error fetching auth user:", authError);
        router.push("/login");
        return;
      }
    
      setUserId(authUser.id);
    
      const { data: profile, error: profileError } = await supabase
        .from("User")
        .select("username, userLevel, usercurrentExp, targetExp, userCredits")
        .eq("id", authUser.id)
        .single();
    
      if (profileError) {
        console.error("Error fetching user profile:", profileError);
        setLoading(false);
        return;
      }
    
      let { userLevel, usercurrentExp, targetExp } = profile;
      let leveledUp = false;
    
      if (usercurrentExp >= targetExp) {
        // Perform level-up update
        userLevel += 1;
        usercurrentExp = 0;
        targetExp *= 2;
        leveledUp = true;
    
        const { error: updateError } = await supabase
          .from("User")
          .update({
            userLevel,
            usercurrentExp,
            targetExp,
          })
          .eq("id", authUser.id);
    
        if (updateError) {
          console.error("Error updating user level data:", updateError);
        }
      }
    
      setUserData({
        username: profile.username ?? "Unknown User",
        experience: usercurrentExp,
        level: userLevel,
        totalExperience: targetExp,
        credits: profile.userCredits ?? 0,
      });
    
      if (leveledUp) setShowLevelUpAlert(true);
    
      const { data: writtenWorks, error: worksError } = await supabase
        .from("written_works")
        .select("workID, workTitle, numberofWords, noOfWordsSet, timelimitSet")
        .eq("UserID", authUser.id);
    
      if (worksError) {
        console.error("Error fetching written works:", worksError);
      } else {
        setWorks(writtenWorks || []);
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

      {showLevelUpAlert && (
        <div className="container mx-auto mt-4">
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">🎉 Level Up!</strong>
            <span className="block sm:inline"> You've reached your experience goal and leveled up!</span>
            <span
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setShowLevelUpAlert(false)}
              style={{ cursor: 'pointer' }}
            >
              <svg
                className="fill-current h-6 w-6 text-green-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 5.652a1 1 0 00-1.414-1.414L10 7.172 7.066 4.238a1 1 0 00-1.414 1.414L8.586 10l-2.934 2.934a1 1 0 101.414 1.414L10 12.828l2.934 2.934a1 1 0 001.414-1.414L11.414 10l2.934-2.934z" />
              </svg>
            </span>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          <UserPanel />
          <WritingHistoryPanel works={works} />
        </div>
        <div className="mt-8 flex justify-center">
          <StartWritingButton />
        </div>
        <div className="mt-8">
          {userId && <DailyStreak userId={userId} />}
        </div>
      </main>
    </div>
  );
}
