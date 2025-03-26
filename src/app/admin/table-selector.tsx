"use client"

import { Label } from "@/app/components/ui/adminlabel"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/adminselect"

interface TableSelectorProps {
  tables: string[]
  selectedTable: string
  onSelectTable: (table: string) => void
}

export default function TableSelector({ tables, selectedTable, onSelectTable }: TableSelectorProps) {
  return (
    <div className="mb-6">
      <Label htmlFor="table-select">Select Table</Label>
      <Select value={selectedTable} onValueChange={onSelectTable}>
        <SelectTrigger id="table-select" className="w-full sm:w-[300px]">
          <SelectValue placeholder="Select a table" />
        </SelectTrigger>
        <SelectContent>
          {tables.map((table) => (
            <SelectItem key={table} value={table}>
              {table}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

