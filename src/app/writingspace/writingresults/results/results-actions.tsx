import { Button } from "../ui/button"
import Link from "next/link"
import { FaArrowLeft, FaPlusCircle } from "react-icons/fa" // Icons for better UI

export default function ResultsActions() {
  return (
    <div className="mt-8 flex justify-center gap-8">
      {/* Back to Main Menu Button */}
      <Button asChild className="transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-900 hover:text-white rounded-lg py-2 px-6 flex items-center space-x-3">
        <Link href="/homepage" className="flex items-center space-x-2">
          <FaArrowLeft size={20} />
          <span className="font-semibold text-lg">Back to Main Menu</span>
        </Link>
      </Button>

      {/* Start New Project Button */}
      <Button variant="outline" asChild className="transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:border-gray-700 hover:text-gray-800 rounded-lg py-2 px-6 flex items-center space-x-3 border-2 border-gray-300">
        <Link href="/writingspace/writingpage" className="flex items-center space-x-2">
          <FaPlusCircle size={20} />
          <span className="font-semibold text-lg">Start New Project</span>
        </Link>
      </Button>
    </div>
  )
}
