'use client'

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/app/homepage/ui/card';
import { Bebas_Neue } from 'next/font/google';

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
});

interface WrittenWork {
  workID: number;
  workTitle: string;
  numberofWords: number;
  noOfWordsSet: number;
  timelimitSet: number;
  timeRendered: number;
}

interface WritingHistoryProps {
  works: WrittenWork[];
}

export function WritingHistoryPanel({ works }: WritingHistoryProps) {
  return (
    <Card className="bg-white text-gray-900 shadow duration-300 min-h-[400px] max-h-[600px]">
      <CardHeader className="bg-[#f9fafb] px-6 py-4">
        <CardTitle
          className={`text-cyan-400 text-3xl font-extrabold tracking-wider leading-none text-center ${bebasNeue.className}`}
          style={{ letterSpacing: '2px' }}
        >
          WRITING HISTORY
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <p className="mb-4 text-yellow-500 text-lg">
          Total Works: {works.length}
        </p>
        <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2">
          <ul>
            {works.map((work) => (
              <li
                key={work.workID}
                className="flex justify-between items-center bg-white hover:bg-gray-100 transition-colors duration-300 px-4 py-3 shadow"
              >
                <div className="text-gray-700 font-semibold">
                  <p>Work Title: {work.workTitle}</p>
                  <p>Words Written: {work.numberofWords}</p>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Target Words: {work.noOfWordsSet}</p>
                  <p>Time Limit: {work.timelimitSet} mins</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
