'use client'

import { useEffect, useState } from "react";
import { FaLock, FaGift, FaCheckCircle, FaDice, FaStar, FaTrophy, FaTicketAlt, FaFire } from "react-icons/fa";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import supabase from "../../../../config/supabaseClient";

interface UserPayload {
  new: { userStreak: number };
  old: { userStreak: number };
}

export default function DailyStreak({ userId }: { userId: string }) {
  const [streak, setStreak] = useState(0);
  const [lastCheckIn, setLastCheckIn] = useState<Date | null>(null);
  const [reward, setReward] = useState<string | null>(null);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  

useEffect(() => {
  const fetchStreakData = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("User")
      .select("userStreak, lastCheckIn")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user data:", error.message);
      return;
    }

    if (data) {
      setStreak(data.userStreak || 0);
      const last = data.lastCheckIn ? new Date(data.lastCheckIn) : null;
      setLastCheckIn(last);

      const today = new Date().toDateString();
      const lastCheckInDate = last?.toDateString();
      setHasCheckedInToday(lastCheckInDate === today);
    }
  };

  fetchStreakData();
}, [userId]);

useEffect(() => {
  const interval = setInterval(() => {
    const now = new Date();
    const tomorrowMidnight = new Date();
    tomorrowMidnight.setHours(24, 0, 0, 0);

    const diff = tomorrowMidnight.getTime() - now.getTime();

    if (diff <= 0) {
      setHasCheckedInToday(false);
      setCountdown("");
    } else {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(`${hours}h ${minutes}m ${seconds}s`);
    }
  }, 1000);

  return () => clearInterval(interval);
}, []);

const handleCheckIn = async () => {
  const today = new Date();
  const todayDate = today.toDateString();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: userData, error: userDataError } = await supabase
    .from("User")
    .select("userStreak, lastCheckIn, usercurrentExp, userCredits")
    .eq("id", user.id)
    .single();

  if (userDataError) {
    console.error("Error fetching user data:", userDataError.message);
    return;
  }

  const lastCheckInDate = userData?.lastCheckIn
    ? new Date(userData.lastCheckIn).toDateString()
    : null;

  // Check if the user has already claimed today
  if (lastCheckInDate === todayDate) {
    alert("🔥 You've already checked in today!");
    setIsButtonDisabled(true); // Disable the button if already checked in
    return;
  }

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const isConsecutive = lastCheckInDate === yesterday.toDateString();

  const newStreak = isConsecutive ? userData.userStreak + 1 : 1;

  let bonusExp = 10;
  let bonusCredits = 5;
  let bonusMessage = "🎁 +10 XP!";

  if (newStreak % 30 === 0) {
    bonusExp = 500;
    bonusCredits = 100;
    bonusMessage = "🏆 Monthly Bonus: +500 XP and +100 Credits!";
  } else if (newStreak % 7 === 0) {
    bonusExp = 100;
    bonusCredits = 20;
    bonusMessage = "⭐ Weekly Bonus: +100 XP and +20 Credits!";
  }

  const newExp = (userData.usercurrentExp || 0) + bonusExp;
  const newCredits = (userData.userCredits || 0) + bonusCredits;

  const now = new Date();

  const { error: userUpdateError } = await supabase
    .from("User")
    .update({
      usercurrentExp: newExp,
      userCredits: newCredits,
      userStreak: newStreak,
      lastCheckIn: now, // Save the current timestamp, not +16h
    })
    .eq("id", user.id);

  if (userUpdateError) {
    console.error("Error updating User in Supabase:", userUpdateError.message);
    return;
  }

  setStreak(newStreak);
  setLastCheckIn(now);
  setReward(bonusMessage);
  alert(`✅ Check-in successful! ${bonusMessage}`);
  setIsButtonDisabled(true); // Disable the button after claiming the reward
  window.location.reload(); // Reload the page to reflect changes
};


  return (
    <div className="bg-white p-4 w-full max-w-4xl mx-auto mt-6 text-black border border-gray-200 rounded-md shadow-md relative overflow-hidden">
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
          whileTap={!hasCheckedInToday ? { scale: 0.98 } : {}}
          whileHover={!hasCheckedInToday ? { scale: 1.01 } : {}}
          onClick={handleCheckIn}
          disabled={hasCheckedInToday}
          className={twMerge(
            "w-full py-2.5 px-4 font-semibold rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2",
            hasCheckedInToday
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-sky-600 to-sky-500 text-white hover:shadow-lg focus:ring-sky-400"
          )}
        >
{hasCheckedInToday
  ? `✅ Checked In — Next in ${countdown}`
  : "🔥 Check In Today"}
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
