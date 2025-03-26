"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card"
import { Input } from "@/app/components/ui/admininput"
import { Label } from "@/app/components/ui/adminlabel"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/adminselect"
import ActionButtons from "@/app/admin/action-buttons"

interface RecordFormProps {
  columns: string[]
  formValues: Record<string, string>
  selectedColumn: string
  onInputChange: (column: string, value: string) => void
  onSelectColumn: (column: string) => void
  onAdd: () => void
  onUpdate: () => void
  onDelete: () => void
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
}: RecordFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Record</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {columns.map((column) => (
            <div key={column} className="space-y-2">
              <Label htmlFor={column}>{column}</Label>
              <Input
                id={column}
                value={formValues[column] || ""}
                onChange={(e) => onInputChange(column, e.target.value)}
                disabled={column === "id"} // Disable editing of ID field
              />
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="column-select">Select Column for Operation</Label>
            <Select value={selectedColumn} onValueChange={onSelectColumn}>
              <SelectTrigger id="column-select" className="w-full sm:w-[300px]">
                <SelectValue placeholder="Select a column" />
              </SelectTrigger>
              <SelectContent>
                {columns
                  .filter((col) => col !== "id")
                  .map((column) => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <ActionButtons onAdd={onAdd} onUpdate={onUpdate} onDelete={onDelete} />
        </div>
      </CardContent>
    </Card>
  )
}

