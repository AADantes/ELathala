import { cn } from "@/app/lib/utils"
import type { ReactNode } from "react"

interface CardContentProps {
  className?: string
  children: ReactNode
}

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </div>
  )
}
