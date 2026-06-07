import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  label: string
  value: number | string
  icon: LucideIcon
  color?: string
}

export function DashboardMetric({ label, value, icon: Icon, color = 'text-way-petroleo' }: Props) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-4">
        <div className={cn('p-3 rounded-full bg-way-gris', color)}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-2xl font-bold font-display text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}
