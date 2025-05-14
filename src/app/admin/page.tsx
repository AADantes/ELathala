"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminHeader from "@/app/admin/header"
import DataTable from "@/app/admin/data-table"
import RecordForm from "@/app/admin/record-form"
import { Card, CardContent, CardHeader, CardTitle } from "../homepage/ui/card"
import supabase from "../../../config/supabaseClient"

export default function AdminPage() {
  const router = useRouter()
  const [tables, setTables] = useState<string[]>([])
  const [tablesData, setTablesData] = useState<{ tableName: string, columns: string[], data: any[], primaryKey: string }[]>([])
  const [selectedRow, setSelectedRow] = useState<any>(null)
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [selectedColumn, setSelectedColumn] = useState<string>("")

  const fetchPrimaryKey = async (tableName: string) => {
    const { data, error } = await supabase
      .from("information_schema.columns")
      .select("column_name")
      .eq("table_name", tableName)
      .eq("is_identity", true)

    if (error || !data.length) return "id"
    return data[0].column_name
  }

  useEffect(() => {
    const fetchTables = async () => {
      const { data, error } = await supabase.rpc("get_tables")

      if (error) {
        console.error("Error fetching tables:", error)
        return
      }
      setTables(data.map((table: { name: string }) => table.name))
    }
    fetchTables()
  }, [])

  useEffect(() => {
    const fetchTablesData = async () => {
      const tablesData = []

      for (const table of tables) {
        const { data, error } = await supabase.from(table).select("*")

        if (error) {
          console.error(`Error fetching data from ${table}:"`, error)
          continue
        }

        const columns = data.length > 0 ? Object.keys(data[0]) : []
        const primaryKey = await fetchPrimaryKey(table)
        tablesData.push({ tableName: table, columns, data, primaryKey })
      }
      setTablesData(tablesData)
    }
    if (tables.length) fetchTablesData()
  }, [tables])

  const handleRowClick = (row: any) => {
    setSelectedRow(row)
    const values = Object.keys(row).reduce((acc, col) => ({ ...acc, [col]: row[col]?.toString() || "" }), {})
    setFormValues(values)
  }

  const handleInputChange = (column: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [column]: value }))
  }

  const handleAdd = async (tableName: string) => {
    const { error } = await supabase.from(tableName).insert([formValues])
    if (error) console.error("Error adding record:", error)
    else alert("Record added successfully!")
  }

  const handleUpdate = async (tableName: string) => {
    if (!selectedRow) return alert("Please select a row to update")
    const tableData = tablesData.find((table) => table.tableName === tableName)
    const primaryKey = tableData?.primaryKey || "id"
    const { [primaryKey]: _, ...updateValues } = formValues
    const { error } = await supabase.from(tableName).update(updateValues).match({ [primaryKey]: selectedRow[primaryKey] })
    if (error) console.error("Error updating record:", error)
    else alert("Record updated successfully!")
  }

  const handleDelete = async (tableName: string) => {
    if (!selectedRow) return alert("Please select a row to delete")
    const tableData = tablesData.find((table) => table.tableName === tableName)
    const primaryKey = tableData?.primaryKey || "id"
    const { error } = await supabase.from(tableName).delete().match({ [primaryKey]: selectedRow[primaryKey] })
    if (error) console.error("Error deleting record:", error)
    else alert("Record deleted successfully!")
  }

  const handleLogout = () => {
    alert("Logging out...")
    router.push("/landingpage")
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <AdminHeader onLogout={handleLogout} />
      <main className="pt-6 pb-6 px-2 sm:px-4 md:px-6">
        <div className="grid gap-6">
          {tablesData.map(({ tableName, columns, data, primaryKey }) => (
            <Card key={tableName} className="bg-white w-full mb-4">
              <CardHeader>
                <CardTitle>{tableName} Management</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={columns}
                  data={data}
                  selectedRow={selectedRow}
                  onRowClick={handleRowClick}
                />
                <RecordForm
                  columns={columns}
                  formValues={formValues}
                  selectedColumn={selectedColumn}
                  onInputChange={handleInputChange}
                  onSelectColumn={setSelectedColumn}
                  onAdd={() => handleAdd(tableName)}
                  onUpdate={() => handleUpdate(tableName)}
                  onDelete={() => handleDelete(tableName)}
                  onGFonts={() => {}}
                  disabledColumns={[primaryKey]}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

