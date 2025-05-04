import React from 'react'
import { Menu } from 'lucide-react'
import { Button } from '../writing-results/ui/button'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-orange-500 text-white p-4 flex items-center">
      <Button variant="ghost" size="icon" onClick={onMenuClick} className="mr-4">
        <Menu className="h-6 w-6" />
      </Button>
      <h1 className="text-2xl font-bold">E-Lathala</h1>
    </header>
  )
}