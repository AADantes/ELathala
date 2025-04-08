"use client";

import { Button } from "@/app/components/ui/adminbutton";

interface ActionButtonsProps {
  onAdd: () => void;
  onUpdate: () => void;
  onDelete: () => void;
}

export default function ActionButtons({ onAdd, onUpdate, onDelete }: ActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-start">
      {/* Add Record Button */}
      <Button
        onClick={onAdd}
        className="px-4 py-2 text-sm font-bold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 focus:ring-2 focus:ring-sky-500 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 text-white shadow-sm hover:shadow-md active:shadow-none ease-in-out"
      >
        Add Record
      </Button>
      
      {/* Update Record Button */}
      <Button
        onClick={onUpdate}
        variant="outline"
        className="px-4 py-2 text-sm font-bold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 focus:ring-2 focus:ring-sky-500 border-2 border-sky-600 hover:bg-sky-50 hover:border-sky-500 active:bg-sky-100 text-sky-600 hover:text-sky-700 shadow-sm hover:shadow-md active:shadow-none ease-in-out"
      >
        Update Record
      </Button>
      
      {/* Delete Record Button */}
      <Button
        onClick={onDelete}
        variant="destructive"
        className="px-4 py-2 text-sm font-bold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 focus:ring-2 focus:ring-red-500 border-2 border-red-600 hover:bg-red-50 hover:border-red-500 active:bg-red-100 text-red-600 hover:text-red-700 shadow-sm hover:shadow-md active:shadow-none ease-in-out"
      >
        Delete Record
      </Button>
    </div>
  );
}
