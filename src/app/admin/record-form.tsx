import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../writingspace/writingresults/ui/card"
import { Input } from "../writingspace/writingresults/ui/input"
import { Label } from "../writingspace/writingresults/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../writingspace/writingresults/ui/select"
import ActionButtons from "@/app/admin/action-buttons"

import supabase from "../../../config/supabaseClient"

interface RecordFormProps {
  columns: string[]
  formValues: Record<string, string>
  selectedColumn: string
  onInputChange: (column: string, value: string) => void
  onSelectColumn: (column: string) => void
  onAdd: () => void
  onUpdate: () => void
  onDelete: () => void
  onGFonts: () => void
}

export default function RecordForm({
  columns,
  formValues,
  selectedColumn,
  onInputChange,
  onSelectColumn,
  onAdd,
  onUpdate,
  onDelete,
  onGFonts,
}: RecordFormProps) {





  return (
    <Card className="bg-white rounded-xl shadow-md border border-gray-200 p-6 transition-all duration-300">
      <CardHeader className="border-b border-gray-100 pb-4 mb-6">
        <CardTitle className="text-2xl font-semibold text-gray-600 tracking-tight">
          Edit Record
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div
              key={column}
              className="flex flex-col space-y-1.5 bg-gray-50 p-4 rounded-md border border-gray-100 shadow-sm"
            >
              <Label
                htmlFor={column}
                className="text-xs font-bold text-gray-700 uppercase tracking-wide"
              >
                {column}
              </Label>

              <div className="relative">
                <Input
                  id={column}
                  value={formValues[column] || ""}
                  onChange={(e) => onInputChange(column, e.target.value)}
                  disabled={column === "id"}
                  className="w-full pr-10 px-3 py-2 text-sm rounded-md border border-gray-300 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                {column !== "id" && formValues[column]?.trim() && (
                  <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-green-500 text-sm">
                    ✓
                  </span>
                )}
              </div>

              {column === "id" && (
                <p className="text-[11px] text-gray-400 italic pt-1">
                  ID cannot be modified
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 space-y-5">
          <div className="flex flex-col space-y-2 max-w-xs">
            <Label
              htmlFor="column-select"
              className="text-xs font-semibold text-gray-600 uppercase tracking-wide"
            >
              Column to Edit
            </Label>
            <Select value={selectedColumn} onValueChange={onSelectColumn}>
              <SelectTrigger
                id="column-select"
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 bg-white shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
              >
                <SelectValue placeholder="Choose a column" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-md shadow-lg max-h-60 overflow-y-auto border border-gray-200 mt-2 z-10">
                {columns
                  .filter((col) => col !== "id")
                  .map((column) => (
                    <SelectItem
                      key={column}
                      value={column}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-100 focus:text-blue-700 transition-all rounded-md"
                    >
                      {column}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <ActionButtons onAdd={onAdd} onUpdate={onUpdate} onDelete={onDelete} onGFonts={onGFonts} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
