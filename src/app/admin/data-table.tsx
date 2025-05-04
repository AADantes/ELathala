"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../writing-results/ui/table"

interface DataTableProps {
  columns: string[]
  data: any[]
  selectedRow: any
  onRowClick: (row: any) => void
}

export default function DataTable({
  columns,
  data,
  selectedRow,
  onRowClick,
}: DataTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border border-gray-200 shadow-sm bg-white">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow className="bg-gray-100 border-b border-gray-200">
            {columns.map((column) => (
              <TableHead
                key={column}
                className="text-left p-2 font-semibold text-gray-700 tracking-wide"
              >
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={index}
              onClick={() => onRowClick(row)}
              className={`cursor-pointer transition-colors duration-200 ${
                selectedRow?.id === row.id
                  ? "bg-blue-50 border-l-4 border-blue-500"
                  : index % 2 === 0
                  ? "bg-white"
                  : "bg-gray-50"
              } hover:bg-blue-100`}
            >
              {columns.map((column) => (
                <TableCell key={column} className="p-2 text-sm text-gray-800">
                  {row[column]?.toString()}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
