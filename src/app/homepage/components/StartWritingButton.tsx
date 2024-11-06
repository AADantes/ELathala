import Link from 'next/link'
import { Button } from "@/app/homepage/ui/button"
import { ChevronRight } from 'lucide-react'

export function StartWritingButton() {
  return (
    <div className="mt-8 text-center">
      <Button size="lg" asChild>
        <Link href="/writingpage">
          Start Writing <ChevronRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}