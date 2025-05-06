"use client"

import { Label } from "../writingspace/writingresults/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../writingspace/writingresults/ui/select"

interface TableSelectorProps {
  tables: string[]
  selectedTable: string
  onSelectTable: (table: string) => void
}

export default function TableSelector({
  tables,
  selectedTable,
  onSelectTable,
}: TableSelectorProps) {
  return (
    <div className="mb-10">
      <Label
        htmlFor="table-select"
        className="mb-3 block text-sm font-medium text-gray-800 tracking-wide"
      >
        Select Table
      </Label>

      <Select value={selectedTable} onValueChange={onSelectTable}>
        <SelectTrigger
          id="table-select"
          className="w-full sm:w-[320px] px-5 py-3 bg-gradient-to-r from-white via-gray-50 to-white border border-gray-300 rounded-2xl shadow-md text-gray-800 hover:border-blue-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out text-sm font-medium"
        >
          <SelectValue
            placeholder="Choose a table..."
            className="text-center w-full text-gray-700"
          />
        </SelectTrigger>

        <SelectContent className="w-full sm:w-[320px] mt-2 bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl animate-fade-in p-2">
          {tables.map((table) => (
            <SelectItem
              key={table}
              value={table}
              className="group relative px-4 py-2 text-sm text-gray-800 rounded-xl cursor-pointer transition-all duration-150 hover:bg-blue-100 focus:bg-blue-200 focus:outline-none flex justify-center items-center text-center [&_[data-select-item-indicator]]:hidden"
            >
              <span className="truncate">{table}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
