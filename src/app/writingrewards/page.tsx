'use client';

import { useEffect, useMemo, useState } from 'react';
import supabase from '../../../config/supabaseClient';
import { Badge } from './components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './components/ui/card';
import {
  Lock,
  Unlock,
  Gift,
  Award,
  Star,
  Trophy,
  FlaskConical,
  Coins,
} from 'lucide-react';
import { Button } from './components/ui/button';
import { Header } from '../homepage/components/Header';

export default function LevelRewardsPage() {
  const [claimedLevels, setClaimedLevels] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<number | null>(null);

  const [userData, setUserData] = useState({
    level: 1,
    currentExp: 0,
    targetExp: 1000,
    username: 'Loading...',
    creditMultiplier: 1,
    expMultiplier: 1,
    credits: 0,
  });

  const rewards = useMemo(
    () => [
      { id: 2, level: 2, name: 'Level 2 Reward', description: 'You’ve earned a bonus!', rewardType: 'Credits + Multipliers', creditBonus: 1000, multiplierBonus: 1 },
      { id: 4, level: 4, name: 'Level 4 Reward', description: 'Big gains ahead!', rewardType: 'Credits + Multipliers', creditBonus: 2000, multiplierBonus: 1.5 },
      { id: 6, level: 6, name: 'Level 6 Reward', description: "You're on fire!", rewardType: 'Credits + Multipliers', creditBonus: 3000, multiplierBonus: 1.5 },
      { id: 8, level: 8, name: 'Level 8 Reward', description: 'Almost a legend.', rewardType: 'Credits + Multiplier', creditBonus: 4000, multiplierBonus: 2 },
      { id: 10, level: 10, name: 'Level 10 Reward', description: 'Ultimate Champion!', rewardType: 'Credits + Multiplier', creditBonus: 5000, multiplierBonus: 2 },
    ],
    []
  );

  const rewardIcons = useMemo(() => [
    <Gift className="animate-bounce text-sky-400" />,
    <Award className="animate-ping text-orange-400" />,
    <Star className="animate-spin text-yellow-400" />,
    <Trophy className="animate-bounce text-lime-400" />,
    <Trophy className="animate-bounce text-sky-500" />,
  ], []);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userDataRaw } = await supabase
        .from('User')
        .select('*')
        .eq('id', user.id)
        .single();

      const { data: claimed } = await supabase
        .from('claimed_Rewards')
        .select('rewardLevel')
        .eq('userID', user.id);

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

      setClaimedLevels(claimedList);
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleClaim = async (reward: typeof rewards[0]) => {
    setClaiming(reward.level);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (claimedLevels.includes(reward.level)) {
      setClaiming(null);
      return;
    }

    const { error } = await supabase.from('claimed_Rewards').insert({
      userID: user.id,
      rewardLevel: reward.level,
      claimed_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Claim failed:', error);
      setClaiming(null);
      return;
    }

    const updatedCredits = userData.credits + reward.creditBonus;
    const updatedExpMultiplier = userData.expMultiplier + reward.multiplierBonus;
    const updatedCreditMultiplier = userData.creditMultiplier + reward.multiplierBonus;

    const { error: updateError } = await supabase
      .from('User')
      .update({
        userCredits: updatedCredits,
        userExpMultiplier: updatedExpMultiplier,
        userCreditMultiplier: updatedCreditMultiplier,
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('User update failed:', updateError);
      setClaiming(null);
      return;
    }

    setUserData((prev) => ({
      ...prev,
      credits: updatedCredits,
      expMultiplier: updatedExpMultiplier,
      creditMultiplier: updatedCreditMultiplier,
    }));

    setClaimedLevels((prev) => [...prev, reward.level]);
    setClaiming(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading your rewards...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="w-full shadow-sm bg-white sticky top-0 z-30">
        <Header />
      </div>
      <div className="container mx-auto py-10 px-2 sm:px-4">
        <div className="max-w-6xl mx-auto">
          {/* User Info - removed card/rectangle, just centered content */}
          <div className="relative mb-10">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-black">
                {`Level ${userData.level} - ${userData.username}`}
              </h1>
              <p className="text-lg text-black mt-2">
                {`You're on Level ${userData.level} now, keep it up! Only `} 
                <span className="text-yellow-500 font-semibold">
                  {userData.targetExp - userData.currentExp} EXP
                </span>{' '}
                until the next level!
              </p>
              <div className="flex justify-center gap-3 mt-4">
                <Badge className="bg-sky-500 text-white text-base px-4 py-2 animate-pulse flex items-center gap-1">
                  <FlaskConical className="h-4 w-4" /> x{userData.expMultiplier}
                </Badge>
                <Badge className="bg-black text-white text-base px-4 py-2 animate-bounce flex items-center gap-1">
                  <Coins className="h-4 w-4" /> x{userData.creditMultiplier}
                </Badge>
              </div>
              {/* XP Bar */}
              <div className="w-full bg-white rounded-full h-6 mt-4 max-w-4xl mx-auto border border-gray-300 relative">
                <div
                  className="h-6 rounded-full bg-yellow-500 transition-all duration-1000 ease-in-out transform"
                  style={{ width: `${(userData.currentExp / userData.targetExp) * 100}%` }}
                ></div>
                {/* Text inside the XP bar */}
                <div className="absolute inset-0 flex items-center justify-center text-black font-medium text-sm animate-pulse">
                  {userData.currentExp} / {userData.targetExp} XP
                </div>
              </div>
            </div>
          </div>

          {/* Rewards Section */}
          <h2 className="text-2xl font-bold mb-6 text-black flex items-center gap-2">
            <Trophy className="text-yellow-400 animate-bounce" size={28} /> Rewards
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward, idx) => {
              const isUnlocked = userData.level >= reward.level;
              const isClaimed = claimedLevels.includes(reward.level);

              return (
                <Card
                  key={reward.id}
                  className={`transition-transform duration-300 transform hover:scale-[1.05] hover:shadow-xl border rounded-2xl 
                    bg-white w-full
                    ${!isUnlocked ? 'opacity-70' : ''}
                    ${isUnlocked ? 'border-sky-300' : 'border-gray-200'}
                    shadow-sm`}
                  style={{ minHeight: 200, minWidth: 0, maxWidth: '100%' }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base flex items-center gap-2">
                        <span className="text-xl">{rewardIcons[idx % rewardIcons.length]}</span>
                        {reward.name}
                      </CardTitle>
                      <Badge
                        className={`flex items-center gap-1 text-sm px-3 py-1 rounded-lg
                          ${isUnlocked ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}
                      >
                        {isUnlocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                        Lv {reward.level}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-500 mt-1 text-sm">
                      {reward.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex flex-col justify-center items-center h-24 rounded-lg w-full px-4 text-center bg-white">
                      <span className="text-xs font-medium text-gray-500">{reward.rewardType}</span>
                      <span className={`text-lg font-bold mt-2 
                        ${isUnlocked ? 'text-sky-600' : 'text-gray-400'}`}>
                        +{reward.creditBonus} credits • +{reward.multiplierBonus}x
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-2 flex justify-center">
                    {isUnlocked ? (
                      isClaimed ? (
                        <p className="text-sm font-medium text-green-600 animate-pulse">
                          🎉 Reward Claimed!
                        </p>
                      ) : (
                        <Button
                          onClick={() => handleClaim(reward)}
                          disabled={claiming === reward.level}
                          className="w-full bg-sky-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-600 disabled:opacity-50"
                        >
                          <Gift className="mr-2 -mt-1" />
                          {claiming === reward.level ? 'Claiming...' : 'Claim Reward'}
                        </Button>
                      )
                    ) : (
                      <p className="text-sm text-gray-400">Unlock at Level {reward.level}</p>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
