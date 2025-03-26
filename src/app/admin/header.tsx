"use client"

import { Button } from "@/app/components/ui/adminbutton"
import { LogoutIcon } from "@/app/components/ui/adminicons"

interface AdminHeaderProps {
  onLogout: () => void
}

export default function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button variant="ghost" onClick={onLogout}>
          <LogoutIcon className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </header>
  )
}

