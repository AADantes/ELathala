'use client';

import { Button } from "../ui/button";
import Link from "next/link";


export default function ResultsActions() {

  return (
    <div className="mt-8 flex justify-center gap-4">
      <Button
        asChild
        className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-6 py-2 rounded-lg shadow transition-all duration-200 flex items-center gap-2"
      >
        <Link href="/homepage">
          <svg className="h-5 w-5 mr-1 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m-4 0h4" />
          </svg>
          Back to Main Menu
        </Link>
      </Button>
      <Button
        variant="outline"
        asChild
        className="border border-sky-400 text-sky-600 font-bold px-6 py-2 rounded-lg shadow hover:bg-sky-50 hover:text-sky-700 transition-all duration-200 flex items-center gap-2"
      >
        <Link href="/writingspace/writingpage">
          <svg className="h-5 w-5 mr-1 text-sky-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Start New Project
        </Link>
      </Button>
    </div>
  );
}
