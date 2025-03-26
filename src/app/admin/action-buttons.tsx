"use client"

import { Button } from "@/app/components/ui/adminbutton"

interface ActionButtonsProps {
  onAdd: () => void
  onUpdate: () => void
  onDelete: () => void
}

export default function ActionButtons({ onAdd, onUpdate, onDelete }: ActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={onAdd}>Add Record</Button>
      <Button onClick={onUpdate} variant="outline">
        Update Record
      </Button>
      <Button onClick={onDelete} variant="destructive">
        Delete Record
      </Button>
    </div>
  )
}

