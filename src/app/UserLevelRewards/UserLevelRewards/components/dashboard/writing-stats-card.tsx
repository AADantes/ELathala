"use client";

import { BarChart, Calendar, Clock, Edit, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // Check this path
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Check this path
import type { WritingStats } from "@/types";
import { formatNumber } from "@/lib/utils";

interface WritingStatsCardProps {
  stats: WritingStats;
}

// Define a set of icon colors for variety
const iconColors = {
  words: {
    bg: "bg-sky-100 dark:bg-sky-900/30",
    icon: "text-sky-600 dark:text-sky-400",
  },
  time: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    icon: "text-blue-600 dark:text-blue-400",
  },
  sessions: {
    bg: "bg-teal-100 dark:bg-teal-900/30",
    icon: "text-teal-600 dark:text-teal-400",
  },
  average: {
    bg: "bg-gray-100 dark:bg-gray-800/30",
    icon: "text-gray-600 dark:text-gray-400",
  },
};

export default function WritingStatsCard({ stats }: WritingStatsCardProps) {
  return (
    <Card className="overflow-hidden card-hover-effect">
      <CardHeader className="bg-gray-100 dark:bg-gray-800/30">
        <CardTitle className="text-black">Writing Analytics</CardTitle>
        <CardDescription>Track your writing productivity</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="today" className="w-full">
          {/* Add margin-top here to space out the tabs */}
          <TabsList className="grid w-full grid-cols-3 p-1 bg-gray-100/50 dark:bg-gray-800/20 rounded-lg mt-4">
            <TabsTrigger
              value="today"
              className="px-4 py-3 rounded-md font-medium transition-all data-[state=active]:bg-sky-500 data-[state=active]:text-white dark:data-[state=active]:bg-sky-600"
            >
              Today
            </TabsTrigger>
            <TabsTrigger
              value="week"
              className="px-4 py-3 rounded-md font-medium transition-all data-[state=active]:bg-sky-500 data-[state=active]:text-white dark:data-[state=active]:bg-sky-600"
            >
              This Week
            </TabsTrigger>
            <TabsTrigger
              value="month"
              className="px-4 py-3 rounded-md font-medium transition-all data-[state=active]:bg-sky-500 data-[state=active]:text-white dark:data-[state=active]:bg-sky-600"
            >
              This Month
            </TabsTrigger>
          </TabsList>

         {/* TODAY TAB */}
<TabsContent value="today" className="space-y-4 mt-4">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    <div className="bg-gradient-to-r from-sky-200 to-sky-300 dark:from-sky-800 dark:to-sky-600/20 rounded-lg p-4 flex flex-col items-start shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out">
      <div className={`${iconColors.words.bg} rounded-full p-2 mb-3`}>
        <FileText className={`h-6 w-6 ${iconColors.words.icon}`} />
      </div>
      <div>
        <div className="text-sm text-gray-600 dark:text-gray-300">Words Written</div>
        <div className="text-2xl font-bold text-sky-800 dark:text-sky-400">{stats.today.wordsWritten}</div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-blue-200 to-blue-300 dark:from-blue-800 dark:to-blue-600/20 rounded-lg p-4 flex flex-col items-start shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out">
      <div className={`${iconColors.time.bg} rounded-full p-2 mb-3`}>
        <Clock className={`h-6 w-6 ${iconColors.time.icon}`} />
      </div>
      <div>
        <div className="text-sm text-gray-600 dark:text-gray-300">Time Writing</div>
        <div className="text-2xl font-bold text-blue-800 dark:text-blue-400">{stats.today.timeSpent}</div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-teal-200 to-teal-300 dark:from-teal-800 dark:to-teal-600/20 rounded-lg p-4 flex flex-col items-start shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out">
      <div className={`${iconColors.sessions.bg} rounded-full p-2 mb-3`}>
        <Edit className={`h-6 w-6 ${iconColors.sessions.icon}`} />
      </div>
      <div>
        <div className="text-sm text-gray-600 dark:text-gray-300">Sessions</div>
        <div className="text-2xl font-bold text-teal-800 dark:text-teal-400">{stats.today.sessionsCompleted}</div>
      </div>
    </div>
  </div>
</TabsContent>

{/* WEEK TAB */}
<TabsContent value="week" className="space-y-4 mt-4">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    <div className="bg-gradient-to-r from-sky-200 to-sky-300 dark:from-sky-800 dark:to-sky-600/20 rounded-lg p-4 flex flex-col items-start shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out">
      <div className={`${iconColors.words.bg} rounded-full p-2 mb-3`}>
        <FileText className={`h-6 w-6 ${iconColors.words.icon}`} />
      </div>
      <div>
        <div className="text-sm text-gray-600 dark:text-gray-300">Words Written</div>
        <div className="text-2xl font-bold text-sky-800 dark:text-sky-400">{formatNumber(stats.week.wordsWritten)}</div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-blue-200 to-blue-300 dark:from-blue-800 dark:to-blue-600/20 rounded-lg p-4 flex flex-col items-start shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out">
      <div className={`${iconColors.time.bg} rounded-full p-2 mb-3`}>
        <Clock className={`h-6 w-6 ${iconColors.time.icon}`} />
      </div>
      <div>
        <div className="text-sm text-gray-600 dark:text-gray-300">Time Writing</div>
        <div className="text-2xl font-bold text-blue-800 dark:text-blue-400">{stats.week.timeSpent}</div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-teal-200 to-teal-300 dark:from-teal-800 dark:to-teal-600/20 rounded-lg p-4 flex flex-col items-start shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out">
      <div className={`${iconColors.sessions.bg} rounded-full p-2 mb-3`}>
        <Edit className={`h-6 w-6 ${iconColors.sessions.icon}`} />
      </div>
      <div>
        <div className="text-sm text-gray-600 dark:text-gray-300">Sessions</div>
        <div className="text-2xl font-bold text-teal-800 dark:text-teal-400">{stats.week.sessionsCompleted}</div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-600/20 rounded-lg p-4 flex flex-col items-start shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out">
      <div className={`${iconColors.average.bg} rounded-full p-2 mb-3`}>
        <BarChart className={`h-6 w-6 ${iconColors.average.icon}`} />
      </div>
      <div>
        <div className="text-sm text-gray-600 dark:text-gray-300">Avg. Words/Day</div>
        <div className="text-2xl font-bold text-gray-800 dark:text-gray-400">{stats.week.avgWordsPerDay}</div>
      </div>
    </div>
  </div>
</TabsContent>


     {/* MONTH TAB */}
<TabsContent value="month" className="space-y-4 mt-4">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
    {/* Words Written */}
    <div className="bg-gradient-to-r from-sky-100 to-sky-200 dark:from-sky-900 dark:to-sky-700/30 rounded-lg p-4 flex flex-col items-start shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:scale-105">
      <div className={`${iconColors.words.bg} rounded-full p-2 mb-3`}>
        <FileText className={`h-6 w-6 ${iconColors.words.icon}`} />
      </div>
      <div>
        <div className="text-sm text-gray-600 dark:text-gray-300">Words Written</div>
        <div className="text-xl font-semibold text-sky-700 dark:text-sky-300">{formatNumber(stats.month.wordsWritten)}</div>
      </div>
    </div>

    {/* Time Writing */}
    <div className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-700/30 rounded-lg p-4 flex flex-col items-start shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:scale-105">
      <div className={`${iconColors.time.bg} rounded-full p-2 mb-3`}>
        <Clock className={`h-6 w-6 ${iconColors.time.icon}`} />
      </div>
      <div>
        <div className="text-sm text-gray-600 dark:text-gray-300">Time Writing</div>
        <div className="text-xl font-semibold text-blue-700 dark:text-blue-300">{stats.month.timeSpent}</div>
      </div>
    </div>

    {/* Active Days */}
    <div className="bg-gradient-to-r from-teal-100 to-teal-200 dark:from-teal-900 dark:to-teal-700/30 rounded-lg p-4 flex flex-col items-start shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:scale-105">
      <div className={`${iconColors.sessions.bg} rounded-full p-2 mb-3`}>
        <Calendar className={`h-6 w-6 ${iconColors.sessions.icon}`} />
      </div>
      <div>
        <div className="text-sm text-gray-600 dark:text-gray-300">Active Days</div>
        <div className="text-xl font-semibold text-teal-700 dark:text-teal-300">{stats.month.sessionsCompleted}</div>
      </div>
    </div>

    {/* Avg. Words/Day */}
    <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700/30 rounded-lg p-4 flex flex-col items-start shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:scale-105">
      <div className={`${iconColors.average.bg} rounded-full p-2 mb-3`}>
        <BarChart className={`h-6 w-6 ${iconColors.average.icon}`} />
      </div>
      <div>
        <div className="text-sm text-gray-600 dark:text-gray-300">Avg. Words/Day</div>
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">{stats.month.avgWordsPerDay}</div>
      </div>
    </div>
  </div>

  {/* Writing by Genre Section */}
  <div className="mt-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700/30 rounded-lg p-4 shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out">
    <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Writing by Genre</div>
    <div className="space-y-3">
      {/* Fiction */}
      <div className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 p-3 rounded-lg transition-all duration-300 ease-in-out">
        <div className="text-sm text-gray-600 dark:text-gray-300">Fiction</div>
        <div className="text-xl font-bold text-sky-700 dark:text-sky-300">{formatNumber(12500)} words</div>
      </div>

      {/* Non-fiction */}
      <div className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 p-3 rounded-lg transition-all duration-300 ease-in-out">
        <div className="text-sm text-gray-600 dark:text-gray-300">Non-fiction</div>
        <div className="text-xl font-bold text-blue-700 dark:text-blue-300">{formatNumber(8200)} words</div>
      </div>

      {/* Poetry */}
      <div className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 p-3 rounded-lg transition-all duration-300 ease-in-out">
        <div className="text-sm text-gray-600 dark:text-gray-300">Poetry</div>
        <div className="text-xl font-bold text-teal-700 dark:text-teal-300">{formatNumber(4730)} words</div>
      </div>
    </div>
  </div>

  {/* Achievement Progress Section */}
  <div className="mt-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700/30 rounded-lg p-4 shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out">
    <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Achievement Progress</div>
    <div className="space-y-3">
      {/* Completed */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600 dark:text-gray-300">Completed</div>
        <div className="text-xl font-semibold text-green-700 dark:text-green-300">4</div>
      </div>

      {/* In Progress */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600 dark:text-gray-300">In Progress</div>
        <div className="text-xl font-semibold text-orange-700 dark:text-orange-300">5</div>
      </div>

      {/* Completion Rate */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600 dark:text-gray-300">Completion Rate</div>
        <div className="text-xl font-semibold text-blue-700 dark:text-blue-300">44%</div>
      </div>
    </div>
  </div>
</TabsContent>


        </Tabs>
      </CardContent>
    </Card>
  );
}
