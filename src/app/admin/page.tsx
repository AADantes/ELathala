"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminHeader from "@/app/admin/header"
import TableSelector from "@/app/admin/table-selector"
import DataTable from "@/app/admin/data-table"
import RecordForm from "@/app/admin/record-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/admincard"
import supabase from "../../../config/supabaseClient"

export default function AdminPage() {
  const router = useRouter()
  const [tables, setTables] = useState<string[]>([])
  const [selectedTable, setSelectedTable] = useState<string>("")
  const [tableData, setTableData] = useState<any[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [selectedRow, setSelectedRow] = useState<any>(null)
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [selectedColumn, setSelectedColumn] = useState<string>("")

  // Fetch table list from Supabase
  useEffect(() => {
    const fetchTables = async () => {
      const { data, error } = await supabase.rpc("get_tables")

      if (error) {
        console.error("Error fetching tables:", error)
      } else {
        console.log("Tables fetched successfully:", data) // Debugging
        setTables(data.map((table: { name: string }) => table.name)) // Extract names
      }
    }
    fetchTables()
  }, [])

  // Fetch table data and columns
  useEffect(() => {
    if (selectedTable) {
      const fetchData = async () => {
        const { data, error } = await supabase.from(selectedTable).select("*")
        if (error) console.error(`Error fetching data from ${selectedTable}:`, error)
        else {
          setTableData(data)
          const cols = data.length > 0 ? Object.keys(data[0]) : []
          setColumns(cols)
          setSelectedColumn(cols[0])
          const initialValues = cols.reduce((acc, col) => ({ ...acc, [col]: "" }), {})
          setFormValues(initialValues)
        }
      }
      fetchData()
    }
  }, [selectedTable])

  const handleRowClick = (row: any) => {
    setSelectedRow(row)
    const values = columns.reduce((acc, col) => ({ ...acc, [col]: row[col]?.toString() || "" }), {})
    setFormValues(values)
  }

  const handleInputChange = (column: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [column]: value }))
  }

  const handleAdd = async () => {
    const { error } = await supabase.from(selectedTable).insert([formValues])
    if (error) console.error("Error adding record:", error)
    else alert("Record added successfully!")
  }

  const handleUpdate = async () => {
    if (!selectedRow) return alert("Please select a row to update")
    const { error } = await supabase.from(selectedTable).update(formValues).match({ id: selectedRow.id })
    if (error) console.error("Error updating record:", error)
    else alert("Record updated successfully!")
  }

  const handleDelete = async () => {
    if (!selectedRow) return alert("Please select a row to delete")
    const { error } = await supabase.from(selectedTable).delete().match({ id: selectedRow.id })
    if (error) console.error("Error deleting record:", error)
    else alert("Record deleted successfully!")
  }

  const handleLogout = () => {
    alert("Logging out...")
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader onLogout={handleLogout} />
      <main className="container py-6">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Database Management</CardTitle>
            </CardHeader>
            <CardContent>
              <TableSelector tables={tables} selectedTable={selectedTable} onSelectTable={setSelectedTable} />
              <div className="mt-6">
                <DataTable columns={columns} data={tableData} selectedRow={selectedRow} onRowClick={handleRowClick} />
              </div>
            </CardContent>
          </Card>

          <RecordForm
            columns={columns}
            formValues={formValues}
            selectedColumn={selectedColumn}
            onInputChange={handleInputChange}
            onSelectColumn={setSelectedColumn}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </div>
      </main>
    </div>
  )
}
