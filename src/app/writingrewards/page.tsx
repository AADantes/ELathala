'use client';

import { useEffect, useState } from "react";
import supabase from "../../../config/supabaseClient";
import { Badge } from "./components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { Lock, Unlock } from "lucide-react";
import { Button } from "./components/ui/button";
import { Header } from "../homepage/components/Header";

export default function LevelRewardsPage() {
  const [claimedLevels, setClaimedLevels] = useState<number[]>([]); // Ensure this is an array of numbers
  const [userData, setUserData] = useState({
    level: 1,
    currentExp: 0,
    targetExp: 1000,
    username: "Loading...",
    creditMultiplier: 1,
    expMultiplier: 1,
    credits: 0,
  });

  const rewards = [
    {
      id: 2,
      level: 2,
      name: "Level 2 Reward",
      description: "You’ve earned a bonus!",
      rewardType: "Credits + Multipliers",
      creditBonus: 1000,
      multiplierBonus: 1,
    },
    {
      id: 4,
      level: 4,
      name: "Level 4 Reward",
      description: "Big gains ahead!",
      rewardType: "Credits + Multipliers",
      creditBonus: 2000,
      multiplierBonus: 1.5,
    },
    {
      id: 6,
      level: 6,
      name: "Level 6 Reward",
      description: "You're on fire!",
      rewardType: "Credits + Multipliers",
      creditBonus: 3000,
      multiplierBonus: 1.5,
    },
    {
      id: 8,
      level: 8,
      name: "Level 8 Reward",
      description: "Almost a legend.",
      rewardType: "Credits + Multiplier",
      creditBonus: 4000,
      multiplierBonus: 2,
    },
    {
      id: 10,
      level: 10,
      name: "Level 10 Reward",
      description: "Ultimate Champion!",
      rewardType: "Credits + Multiplier",
      creditBonus: 5000,
      multiplierBonus: 2,
    },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
  
      const { data: userDataRaw, error } = await supabase
        .from("User")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error || !userDataRaw) return;
  
      const { data: claimed, error: claimErr } = await supabase
        .from("claimed_Rewards")
        .select("rewardLevel")
        .eq("userID", user.id); // Match userID with the logged-in user's UUID
  
      const claimedList = claimed?.map((r: { rewardLevel: number }) => r.rewardLevel) || [];
  
      setUserData({
        level: userDataRaw.userLevel,
        currentExp: userDataRaw.usercurrentExp,
        targetExp: userDataRaw.targetExp,
        username: userDataRaw.username,
        creditMultiplier: userDataRaw.userCreditMultiplier,
        expMultiplier: userDataRaw.userExpMultiplier,
        credits: userDataRaw.userCredits,
      });
  
      setClaimedLevels(claimedList); // Store claimed rewards in state
    };
  
    fetchUserData();
  }, []);

  const handleClaim = async (reward: (typeof rewards)[0]) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Check if the reward has already been claimed
    if (claimedLevels.includes(reward.level)) {
      alert("You've already claimed this reward.");
      return;
    }

    try {
      // Insert into claimed_rewards with the current timestamp for claimed_at
      const { data, error } = await supabase.from("claimed_Rewards").insert({
        userID: user.id, // User ID
        rewardLevel: reward.level, // Reward Level
        claimed_at: new Date().toISOString(), // Timestamp for when it was claimed
      });

      if (error) {
        console.error("Error inserting into claimed_Rewards:", error);
        alert("There was an error claiming the reward. Please try again.");
        return;
      }

      console.log("Claim successful:", data); // Log successful insertion

      const updatedCredits = userData.credits + reward.creditBonus;
      const updatedExpMultiplier = userData.expMultiplier + reward.multiplierBonus;
      const updatedCreditMultiplier = userData.creditMultiplier + reward.multiplierBonus;

      // Update user data with new credits and multipliers
      const { error: updateError } = await supabase
        .from("User")
        .update({
          userCredits: updatedCredits,
          userExpMultiplier: updatedExpMultiplier,
          userCreditMultiplier: updatedCreditMultiplier,
        })
        .eq("id", user.id);

      if (updateError) {
        console.error("Error updating user:", updateError);
        alert("There was an error updating your user data. Please try again.");
        return;
      }

      // Update local state
      setUserData((prev) => ({
        ...prev,
        credits: updatedCredits,
        expMultiplier: updatedExpMultiplier,
        creditMultiplier: updatedCreditMultiplier,
      }));

      // Update the list of claimed rewards
      setClaimedLevels((prev) => [...prev, reward.level]);

    } catch (error) {
      console.error("Unexpected error in claim handler:", error);
      alert("There was an unexpected error. Please try again later.");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Header />
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <div className="text-center mb-2">
            <span className="font-bold text-3xl text-black dark:text-white">Level {userData.level}</span>
          </div>

          <div className="flex justify-center gap-2 mt-2">
            <Badge className="bg-blue-500 text-white">EXP x{userData.expMultiplier}</Badge>
            <Badge className="bg-purple-600 text-white">Credits x{userData.creditMultiplier}</Badge>
          </div>

          <div className="text-center mt-4">
            <span className="text-2xl font-semibold text-black dark:text-white">
              {userData.currentExp} / {userData.targetExp} XP
            </span>
          </div>

          <p className="mt-4 text-lg text-center">
            {userData.targetExp - userData.currentExp} XP needed for Level {userData.level + 1}
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-6">Rewards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((reward) => {
            const isUnlocked = userData.level >= reward.level;
            const isClaimed = claimedLevels.includes(reward.level);

            return (
              <Card key={reward.id} className={`transition-all ${isUnlocked ? "border-green-500" : "opacity-80"}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{reward.name}</CardTitle>
                    <Badge variant={isUnlocked ? "default" : "outline"} className={isUnlocked ? "bg-green-500" : ""}>
                      {isUnlocked ? <Unlock className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
                      Level {reward.level}
                    </Badge>
                  </div>
                  <CardDescription>{reward.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`flex flex-col justify-center items-center h-24 rounded-md ${isUnlocked
                      ? "bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30"
                      : "bg-gray-100 dark:bg-gray-800"
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{reward.rewardType}</span>
                    <span
                      className={`text-xl font-bold mt-1 ${isUnlocked ? "text-purple-600 dark:text-purple-400" : "text-gray-400 dark:text-gray-500"
                        }`}
                    >
                      {reward.creditBonus} credits, +{reward.multiplierBonus}x Multipliers
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 flex justify-center">
  {isUnlocked ? (
    isClaimed ? (
      <p className="text-sm text-green-600 dark:text-green-400">Claimed</p>
    ) : (
      <Button
        onClick={() => handleClaim(reward)}
        disabled={isClaimed} // Disable the button if the reward has been claimed
        className={`border-2 rounded-md px-4 py-2 ${
          isClaimed
            ? "bg-gray-300 text-gray-500 cursor-not-allowed" // Disabled button style
            : "bg-purple-600 text-white hover:bg-purple-700" // Active button style
        }`}
      >
        Claim
      </Button>
    )
  ) : (
    <p className="text-sm text-gray-500">Unlock at Level {reward.level}</p>
  )}
</CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
