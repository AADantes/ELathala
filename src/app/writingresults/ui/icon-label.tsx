import type { ReactNode } from "react"

interface IconLabelProps {
  icon: ReactNode
  label: string
  value: ReactNode | string
}

export default function IconLabel({ icon, label, value }: IconLabelProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div>
        <p className="font-medium">{label}</p>
        <div className="text-muted-foreground">{value}</div>
      </div>
    </div>
  )
}
