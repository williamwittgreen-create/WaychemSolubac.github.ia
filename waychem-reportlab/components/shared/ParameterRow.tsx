'use client'
import { ParameterResult, SystemType, WaterType } from '@/types'
import { SemaforoTag } from './SemaforoTag'
import { getParameterLabel, getParameterRange } from '@/lib/diagnosticEngine'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Props {
  param: ParameterResult
  system: SystemType
  waterType: WaterType
  onValueChange?: (key: string, value: number | null) => void
  editable?: boolean
}

export function ParameterRow({ param, system, waterType, onValueChange, editable = false }: Props) {
  const range = getParameterRange(param.parameter_key, system, waterType)
  const label = getParameterLabel(param.parameter_key, system, waterType)
  const lowConfidence = (param.confidence ?? 1) < 0.7

  return (
    <tr className={cn('border-b border-way-gris', lowConfidence && 'bg-yellow-50')}>
      <td className="py-2 px-3 text-sm font-medium text-gray-800">{label}</td>
      <td className="py-2 px-3 text-sm">
        {editable ? (
          <Input
            type="number"
            className="h-7 w-28 text-sm"
            defaultValue={param.verified_value ?? ''}
            onChange={(e) => onValueChange?.(param.parameter_key, e.target.value ? parseFloat(e.target.value) : null)}
          />
        ) : (
          <span>{param.verified_value ?? '—'}</span>
        )}
      </td>
      <td className="py-2 px-3 text-sm text-gray-500">{param.unit || '—'}</td>
      <td className="py-2 px-3 text-sm text-gray-500">
        {range ? `${range.min ?? '—'} – ${range.max ?? '—'}` : '—'}
      </td>
      <td className="py-2 px-3">
        <SemaforoTag status={param.status} />
      </td>
    </tr>
  )
}
