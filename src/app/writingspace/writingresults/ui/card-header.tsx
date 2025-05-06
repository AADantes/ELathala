import { cn } from "@/app/lib/utils"
import type { ReactNode } from "react"

interface CardHeaderProps {
  className?: string
  children: ReactNode
}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
      {children}
    </div>
  )
}
