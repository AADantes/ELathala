'use client'

import { useEffect, useState } from "react";
import { FaLock, FaGift, FaCheckCircle, FaDice, FaStar, FaTrophy, FaTicketAlt, FaFire } from "react-icons/fa";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import supabase from "../../../../config/supabaseClient";

// Define the types for the subscription payload
interface UserPayload {
  new: { userStreak: number };
  old: { userStreak: number };
}

export default function DailyStreak({ userId }: { userId: string }) {
  const [streak, setStreak] = useState(0);
  const [lastCheckIn, setLastCheckIn] = useState<Date | null>(null);
  const [reward, setReward] = useState<string | null>(null);

  useEffect(() => {
    const fetchStreakData = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from("User")
        .select("userStreak")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user data:", error.message);
        return;
      }

      if (data) {
        setStreak(data.userStreak || 0);
      }
    };

    fetchStreakData();
  }, [userId]);

  const handleCheckIn = async () => {
    const today = new Date();
    const isSameDay =
      lastCheckIn && today.toDateString() === new Date(lastCheckIn).toDateString();

    if (isSameDay) {
      alert("🔥 You've already checked in today!");
      return;
    }

    const isConsecutive =
      lastCheckIn && today.getDate() - new Date(lastCheckIn).getDate() === 1;

    const newStreak = isConsecutive ? streak + 1 : 1;
    setStreak(newStreak);
    setLastCheckIn(today);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Calculate bonus based on streak
    let bonusExp = 0;
    let bonusCredits = 0;
    let bonusMessage = "🎁 +10 XP!";

    if (newStreak % 30 === 0) {
      bonusExp = 500;
      bonusCredits = 100;
      bonusMessage = "🏆 Monthly Bonus: +500 XP and +100 Credits!";
    } else if (newStreak % 7 === 0) {
      bonusExp = 100;
      bonusCredits = 20;
      bonusMessage = "⭐ Weekly Bonus: +100 XP and +20 Credits!";
    } else {
      bonusExp = 10;
      bonusCredits = 5;
    }

    // Fetch current user data from the "User" table to update their EXP and Credits
    const { data: userData, error: userDataError } = await supabase
      .from("User")
      .select("usercurrentExp, userCredits")
      .eq("id", user.id)
      .single();

    if (userDataError) {
      console.error("Error fetching user data from User table:", userDataError.message);
      return;
    }

    if (!userData) {
      console.warn("No user data found.");
      return;
    }

    // Calculate new user EXP and Credits based on bonus
    const newExp = (userData.usercurrentExp || 0) + bonusExp;
    const newCredits = (userData.userCredits || 0) + bonusCredits;

    // Update user data in the User table (including userStreak and LastLoggedIn)
    const { error: userUpdateError } = await supabase
      .from("User")
      .update({
        usercurrentExp: newExp,
        userCredits: newCredits,
        userStreak: newStreak,  // Update the streak
      })
      .eq("id", user.id);

    if (userUpdateError) {
      console.error("Error updating User in Supabase:", userUpdateError.message);
      return;
    }

    setReward(bonusMessage);
    alert(`✅ Check-in successful! ${bonusMessage}`);
  };

  return (
    <div className="bg-white p-4 w-full max-w-4xl mx-auto mt-6 text-black border border-gray-200 rounded-md shadow-md relative overflow-hidden">
      {/* Fire icon */}
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
        className="absolute top-2 right-2"
      >
        <FaFire className="text-red-500 w-6 h-6" />
      </motion.div>

      <div className="flex justify-center items-center gap-2 mb-4">
        <h2 className="text-xl font-bold text-black tracking-tight">
          Daily Streak
        </h2>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-4">
        {[...Array(7)].map((_, i) => {
          const isUnlocked = streak > i;
          const isToday = streak === i;

          return (
            <motion.div
              key={i}
              className={twMerge(
                "p-2 flex flex-col items-center justify-center transition-all duration-300 group rounded-md relative",
                isUnlocked ? "bg-sky-100" : "bg-gray-100 text-gray-400",
                isToday && "ring-2 ring-sky-500"
              )}
              animate={isUnlocked ? { scale: [1, 1.05, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <div className="text-xs font-medium">Day {i + 1}</div>

              <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded shadow">
                {isUnlocked ? "Completed" : "Locked"} — Day {i + 1}
              </div>

              <motion.div
                className="my-1"
                animate={isUnlocked ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {isUnlocked
                  ? rewardIcons[i] ?? <FaCheckCircle />
                  : <FaLock className="w-6 h-6" />}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <div className="w-full bg-gray-200 h-3 overflow-hidden mb-4 rounded-full">
        <motion.div
          className="h-full bg-gradient-to-r from-sky-400 to-sky-600 animate-pulse"
          initial={{ width: 0 }}
          animate={{ width: `${(streak % 7) * (100 / 7)}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>

      <div className="text-center">
        <motion.button
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.01 }}
          onClick={handleCheckIn}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-sky-600 to-sky-500 text-white font-semibold 
                     rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out 
                     focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
        >
          🔥 Check In Today
        </motion.button>
      </div>

      {reward && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-4 p-2.5 bg-green-100 border border-green-300 text-green-800 text-center text-sm rounded-md"
        >
          {reward}
        </motion.div>
      )}
    </div>
  );
}
