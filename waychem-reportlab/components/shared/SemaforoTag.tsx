import { ParameterStatus } from '@/types'
import { cn } from '@/lib/utils'

const CONFIG: Record<ParameterStatus, { label: string; className: string }> = {
  normal: { label: 'Normal', className: 'bg-way-verde text-white' },
  bajo: { label: 'Bajo', className: 'bg-yellow-400 text-gray-900' },
  alto: { label: 'Alto', className: 'bg-yellow-400 text-gray-900' },
  critico_bajo: { label: 'Crítico ↓', className: 'bg-red-500 text-white' },
  critico_alto: { label: 'Crítico ↑', className: 'bg-red-500 text-white' },
  sin_dato: { label: 'Sin dato', className: 'bg-gray-300 text-gray-700' },
}

export function SemaforoTag({ status }: { status: ParameterStatus }) {
  const { label, className } = CONFIG[status]
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', className)}>
      {label}
    </span>
  )
}
