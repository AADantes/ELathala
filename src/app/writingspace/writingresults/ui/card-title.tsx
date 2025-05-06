import { cn } from "@/app/lib/utils"
import type { ReactNode } from "react"

interface CardTitleProps {
  className?: string
  children: ReactNode
}

export function CardTitle({ className, children, ...props }: CardTitleProps) {
  return (
    <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props}>
      {children}
    </h3>
  )
}
