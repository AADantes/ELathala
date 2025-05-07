'use client';

import { Button } from "../ui/button";
import Link from "next/link";


export default function ResultsActions() {

  return (
    <div className="mt-8 flex justify-center gap-4">
      <Button asChild>
        <Link href="/homepage">Back to Main Menu</Link>
      </Button>
      <Button variant="outline" asChild>
        <Link href="/writingspace/writingpage">Start New Project</Link>
      </Button>
    </div>
  );
}
