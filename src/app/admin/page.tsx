"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminHeader from "@/app/admin/header"
import TableSelector from "@/app/admin/table-selector"
import DataTable from "@/app/admin/data-table"
import RecordForm from "@/app/admin/record-form"
import { Card, CardContent, CardHeader, CardTitle } from "../homepage/ui/card"
import supabase from "../../../config/supabaseClient"

export default function AdminPage() {
  const router = useRouter()
  const [tables, setTables] = useState<string[]>([])
  const [selectedTable, setSelectedTable] = useState<string>("")
  const [tableData, setTableData] = useState<any[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [selectedRow, setSelectedRow] = useState<any>(null)
  const [columnValue, setColumnValue] = useState<any>(null)
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [selectedColumn, setSelectedColumn] = useState<string>("")

  // Fetch table list from Supabase
  useEffect(() => {
    const fetchTables = async () => {
      const { data, error } = await supabase.rpc("get_tables")

      if (error) {
        console.error("Error fetching tables:", error)
      } else {
        console.log("Tables fetched successfully:", data)
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
    if (!selectedRow) return alert("Please select a row to update");
    if (!selectedColumn || columnValue === undefined) return alert("Please specify the column and value to match");
  
    const matchConditions = {
      id: selectedRow.id,
      [selectedColumn]: columnValue
    };
  
    const { error } = await supabase
      .from(selectedTable)
      .update(formValues)
      .match(matchConditions);
  
    if (error) {
      console.error("Error updating record:", error);
    } else {
      alert("Record updated successfully!");
    }
  };

  const handleDelete = async () => {
    if (!selectedRow) return alert("Please select a row to delete")
    const { error } = await supabase.from(selectedTable).delete().match({ id: selectedRow.id })
    if (error) console.error("Error deleting record:", error)
    else alert("Record deleted successfully!")
  }

  const handleLogout = () => {
    alert("Logging out...")
    router.push("/homepage")
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <AdminHeader onLogout={handleLogout} />
  
      <main className="pt-6 pb-6 px-2 sm:px-4 md:px-6">
        <div className="grid gap-6">
          <div>
            <Card className="bg-white w-full">
              <CardHeader>
                <CardTitle>Database Management</CardTitle>
              </CardHeader>
              <CardContent>
                <TableSelector
                  tables={tables}
                  selectedTable={selectedTable}
                  onSelectTable={setSelectedTable}
                />
                <div className="mt-6 overflow-auto">
                  <DataTable
                    columns={columns}
                    data={tableData}
                    selectedRow={selectedRow}
                    onRowClick={handleRowClick}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
  
          <div>
            <Card className="bg-white w-full">
              <CardHeader>
                <CardTitle>Edit Record</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
