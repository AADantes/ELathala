"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/admintable"

interface DataTableProps {
  columns: string[]
  data: any[]
  selectedRow: any
  onRowClick: (row: any) => void
}

export default function DataTable({ columns, data, selectedRow, onRowClick }: DataTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column}>{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={index}
              onClick={() => onRowClick(row)}
              className={selectedRow?.id === row.id ? "bg-muted" : "cursor-pointer hover:bg-muted/50"}
            >
              {columns.map((column) => (
                <TableCell key={column}>{row[column]?.toString()}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

