import { Card, CardContent, CardHeader, CardTitle } from '@/app/homepage/ui/card';
import { Bebas_Neue } from '@next/font/google';

// Load Bebas Neue for a bold, modern look
const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
});

interface Work {
  id: number;
  title: string;
  wordCount: number;
  timeSpent: number;
}

interface WritingHistoryProps {
  works: Work[];
}

export function WritingHistoryPanel({ works }: WritingHistoryProps) {
  return (
    <Card 
      className="bg-gradient-to-br from-[#e5e7eb] to-[#f3f4f6] text-gray-900 rounded-2xl 
        shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.15)] 
        transition-transform transform hover:scale-105 duration-300"
    >
      <CardHeader className="bg-[#f3f4f6] rounded-t-2xl px-6 py-4">
        <CardTitle 
          className={`text-cyan-500 text-3xl font-extrabold tracking-wider leading-none text-center ${bebasNeue.className}`}
          style={{ letterSpacing: '2px' }}
        >
          Writing History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <p className="mb-4 text-yellow-500 text-lg">Total Works: {works.length}</p>
        <ul className="space-y-3">
          {works.map((work) => (
            <li 
              key={work.id} 
              className="flex justify-between items-center bg-[#f9fafb] hover:bg-[#f3f4f6] 
                transition-colors duration-300 rounded-lg px-4 py-3 
                shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_6px_rgba(0,0,0,0.15)]"
            >
              <span className="text-gray-800 font-semibold">{work.title}</span>
              <span className="text-sm text-gray-500">
                {work.wordCount} words | {work.timeSpent} mins
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
