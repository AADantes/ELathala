import { FaTrophy } from 'react-icons/fa'; // Importing a trophy icon

export default function ResultsHeader() {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl flex items-center justify-center gap-2">
        <FaTrophy className="text-yellow-500" /> {/* Trophy Icon */}
        Writing Challenge Results
      </h1>
      <p className="mt-2 text-muted-foreground">Great job completing your writing challenge!</p>
    </div>
  );
}