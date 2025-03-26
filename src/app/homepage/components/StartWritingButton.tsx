import Link from 'next/link'
import { Button } from "@/app/homepage/ui/button"
import { Feather } from 'lucide-react'

export function StartWritingButton() {
  return (
    <div className="mt-8 text-center">
      <Link href="/writingpage">
        <Button 
          size="lg" 
          className="bg-sky-800 hover:bg-sky-900 text-white font-bold shadow-lg hover:shadow-3xl transition-all transform hover:scale-110 duration-300 ease-in-out"
        >
          Start Writing 
          <Feather className="ml-2 h-5 w-5 transition-transform duration-300 ease-in-out group-hover:translate-x-2" /> {/* Feather Icon with hover animation */}
        </Button>
      </Link>
    </div>
  )
}
