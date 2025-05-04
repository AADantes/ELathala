import { cn } from "@/app/lib/utils"
import type { ReactNode } from "react"

interface CardDescriptionProps {
  className?: string
  children: ReactNode
}

export function CardDescription({ className, children, ...props }: CardDescriptionProps) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </p>
  )
}
