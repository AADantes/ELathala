import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface StatCardProps {
  title: string
  description: string
  value: string | number
  subValue?: string
  icon: LucideIcon
  iconColor?: string
  iconBgColor?: string
}

export function StatCard({
  title,
  description,
  value,
  subValue,
  icon: Icon,
  iconColor = "text-blue-500",
  iconBgColor = "bg-blue-100 dark:bg-blue-900/30",
}: StatCardProps) {
  return (
    <Card className="stat-card overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-12 h-12 rounded-full ${iconBgColor} mr-3`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div>
            <div className="text-2xl font-bold">{value}</div>
            {subValue && <div className="text-sm text-muted-foreground">{subValue}</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

