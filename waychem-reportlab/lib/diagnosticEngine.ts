import { ParameterStatus, SystemType, WaterType, ParameterRange, ParameterResult } from '@/types'

export const RANGES: Record<string, Record<string, Record<string, ParameterRange>>> = {
  caldera: {
    agua_caldera: {
      pH: { min: 10.5, max: 11.5, critical_high: 12.5, unit: '', label_es: 'pH' },
      conductividad: { min: 0, max: 3500, critical_high: 5000, unit: 'µS/cm', label_es: 'Conductividad' },
      alcalinidadM: { min: 200, max: 800, critical_high: 1200, unit: 'mg/L', label_es: 'Alcalinidad M' },
      fosfatos: { min: 20, max: 60, unit: 'mg/L', label_es: 'Fosfatos' },
      sulfito: { min: 20, max: 60, critical_low: 0, unit: 'mg/L', label_es: 'Sulfito' },
      cloruros: { min: 0, max: 150, critical_high: 300, unit: 'mg/L', label_es: 'Cloruros' },
      silice: { min: 0, max: 150, unit: 'mg/L', label_es: 'Sílice' },
    },
    agua_alimentacion: {
      durezaTotal: { min: 0, max: 0, unit: 'mg/L', label_es: 'Dureza Total' },
    },
  },
  torre: {
    agua_equipo: {
      pH: { min: 7.0, max: 8.5, critical_high: 9.0, unit: '', label_es: 'pH' },
      conductividad: { min: 500, max: 3000, critical_high: 5000, unit: 'µS/cm', label_es: 'Conductividad' },
      ciclos: { min: 3, max: 6, critical_high: 8, unit: '', label_es: 'Ciclos' },
      cloruros: { min: 0, max: 300, critical_high: 500, unit: 'mg/L', label_es: 'Cloruros' },
      hierro: { min: 0, max: 1.0, critical_high: 3.0, unit: 'mg/L', label_es: 'Hierro' },
    },
  },
  chiller: {
    agua_equipo: {
      pH: { min: 7.5, max: 9.0, unit: '', label_es: 'pH' },
      conductividad: { min: 0, max: 500, unit: 'µS/cm', label_es: 'Conductividad' },
      durezaTotal: { min: 0, max: 150, unit: 'mg/L', label_es: 'Dureza Total' },
      hierro: { min: 0, max: 0.3, unit: 'mg/L', label_es: 'Hierro' },
    },
  },
}

export function evaluateParameter(
  key: string,
  value: number | null | undefined,
  system: SystemType,
  waterType: WaterType
): ParameterResult {
  const range = RANGES[system]?.[waterType]?.[key]

  if (value === null || value === undefined) {
    return {
      parameter_key: key,
      verified_value: null,
      unit: range?.unit || '',
      status: 'sin_dato',
    }
  }

  if (!range) {
    return {
      parameter_key: key,
      verified_value: value,
      unit: '',
      status: 'normal',
    }
  }

  const { min, max, critical_low, critical_high } = range

  if (critical_low !== undefined && value < critical_low) return { parameter_key: key, verified_value: value, unit: range.unit, status: 'critico_bajo' }
  if (critical_high !== undefined && value > critical_high) return { parameter_key: key, verified_value: value, unit: range.unit, status: 'critico_alto' }
  if (min !== undefined && value < min) return { parameter_key: key, verified_value: value, unit: range.unit, status: 'bajo' }
  if (max !== undefined && value > max) return { parameter_key: key, verified_value: value, unit: range.unit, status: 'alto' }

  return { parameter_key: key, verified_value: value, unit: range.unit, status: 'normal' }
}

export function getParameterLabel(key: string, system: SystemType, waterType: WaterType): string {
  return RANGES[system]?.[waterType]?.[key]?.label_es || key
}

export function getParameterRange(key: string, system: SystemType, waterType: WaterType): ParameterRange | undefined {
  return RANGES[system]?.[waterType]?.[key]
}
