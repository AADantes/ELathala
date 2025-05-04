import React from 'react'
import { Tooltip } from '../writing-results/ui/tooltip'
import { Button } from '../writing-results/ui/button'
import { AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../writing-results/ui/select'

export default function TextEditorDashboard() {
  return (
    <div className="mb-4 p-2 border border-gray-300 rounded flex items-center space-x-2">
      <Tooltip key="align-left">
        You need to be level 2 to access these!
        <Button variant="ghost" size="icon" className="text-gray-400 cursor-not-allowed" disabled>
          <AlignLeft className="h-4 w-4" />
        </Button>
      </Tooltip>
      <Tooltip key="align-center">
        You need to be level 2 to access these!
        <Button variant="ghost" size="icon" className="text-gray-400 cursor-not-allowed" disabled>
          <AlignCenter className="h-4 w-4" />
        </Button>
      </Tooltip>
      <Tooltip key="align-right">
        You need to be level 2 to access these!
        <Button variant="ghost" size="icon" className="text-gray-400 cursor-not-allowed" disabled>
          <AlignRight className="h-4 w-4" />
        </Button>
      </Tooltip>
      <Tooltip key="bold">
        You need to be level 2 to access these!
        <Button variant="ghost" size="icon" className="text-gray-400 cursor-not-allowed" disabled>
          <Bold className="h-4 w-4" />
        </Button>
      </Tooltip>
      <Tooltip key="italic">
        You need to be level 2 to access these!
        <Button variant="ghost" size="icon" className="text-gray-400 cursor-not-allowed" disabled>
          <Italic className="h-4 w-4" />
        </Button>
      </Tooltip>
      <Tooltip key="underline">
        You need to be level 2 to access these!
        <Button variant="ghost" size="icon" className="text-gray-400 cursor-not-allowed" disabled>
          <Underline className="h-4 w-4" />
        </Button>
      </Tooltip>
      <Tooltip key="font-select">
        You need to be level 2 to access these!
        <Select disabled>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Font" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="arial">Arial</SelectItem>
            <SelectItem value="times">Times New Roman</SelectItem>
            <SelectItem value="courier">Courier New</SelectItem>
          </SelectContent>
        </Select>
      </Tooltip>
      <Tooltip key="size-select">
        You need to be level 2 to access these!
        <Select disabled>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12">12</SelectItem>
            <SelectItem value="14">14</SelectItem>
            <SelectItem value="16">16</SelectItem>
            <SelectItem value="18">18</SelectItem>
          </SelectContent>
        </Select>
      </Tooltip>
      <Tooltip key="color-select">
        You need to be level 2 to access these!
        <Select disabled>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Color" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="black">Black</SelectItem>
            <SelectItem value="red">Red</SelectItem>
            <SelectItem value="blue">Blue</SelectItem>
            <SelectItem value="green">Green</SelectItem>
          </SelectContent>
        </Select>
      </Tooltip>
    </div>
  )
}