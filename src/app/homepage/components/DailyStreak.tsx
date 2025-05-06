"use client";

import { useState, useEffect } from "react";
import supabase from "../../../../config/supabaseClient";
import {
  FaLock,
  FaGift,
  FaCheckCircle,
  FaDice,
  FaStar,
  FaTrophy,
  FaTicketAlt,
  FaFire,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

const rewardIcons = [
  <FaTicketAlt className="text-red-500 w-6 h-6" />,
  <FaGift className="text-orange-500 w-6 h-6" />,
  <FaDice className="text-pink-500 w-6 h-6" />,
  <FaStar className="text-purple-500 w-6 h-6" />,
  <FaTrophy className="text-yellow-500 w-6 h-6" />,
  <FaLock className="text-gray-400 w-6 h-6" />,
  <FaGift className="text-green-500 w-6 h-6" />,
];

export default function DailyStreak() {
  const [streak, setStreak] = useState(0);
  const [lastCheckIn, setLastCheckIn] = useState<Date | null>(null);
  const [reward, setReward] = useState<string | null>(null);

  useEffect(() => {
    const fetchStreakData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("DailyStreak")
        .select("streak, lastCheckIn")
        .eq("userId", user.id)
        .single();

      if (data) {
        setStreak(data.streak);
        setLastCheckIn(new Date(data.lastCheckIn));
      }
    };

    fetchStreakData();
  }, []);

  const handleCheckIn = async () => {
    const today = new Date();
    const isSameDay =
      lastCheckIn &&
      today.toDateString() === new Date(lastCheckIn).toDateString();

    if (isSameDay) {
      alert("🔥 You've already checked in today!");
      return;
    }

    const isConsecutive =
      lastCheckIn &&
      today.getDate() - new Date(lastCheckIn).getDate() === 1;

    const newStreak = isConsecutive ? streak + 1 : 1;
    setStreak(newStreak);
    setLastCheckIn(today);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("DailyStreak").upsert({
      userId: user.id,
      streak: newStreak,
      lastCheckIn: today.toISOString(),
    });

    let bonus = "🎁 +10 XP!";
    if (newStreak % 30 === 0) bonus = "🏆 Monthly Bonus: +500 XP!";
    else if (newStreak % 7 === 0) bonus = "⭐ Weekly Bonus: +100 XP!";

    setReward(bonus);
    alert(`✅ Check-in successful! ${bonus}`);
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
