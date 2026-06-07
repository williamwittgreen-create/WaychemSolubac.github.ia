'use client'
import { useEffect } from 'react'
import { useReportStore } from '@/stores/reportStore'
import { Button } from '@/components/ui/button'
import { ParameterRow } from '@/components/shared/ParameterRow'
import { evaluateParameter, RANGES } from '@/lib/diagnosticEngine'
import { SystemType, WaterType } from '@/types'
import { Loader2 } from 'lucide-react'

export function Step4_Verify() {
  const {
    report, capturedImage, parameters, setParameters, updateParameter,
    isProcessingOCR, setProcessingOCR, nextStep, prevStep,
  } = useReportStore()

  const system = report.system?.type as SystemType
  const waterType = report.water_type as WaterType

  useEffect(() => {
    if (capturedImage && parameters.length === 0) {
      runOCR()
    } else if (parameters.length === 0) {
      initEmpty()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function runOCR() {
    setProcessingOCR(true)
    try {
      const res = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: capturedImage, system, waterType }),
      })
      const data = await res.json()
      if (data.data) {
        const paramKeys = Object.keys(RANGES[system]?.[waterType] || {})
        const params = paramKeys.map((key) => {
          const ocr = data.data[key]
          const val = ocr?.value ?? null
          const conf = ocr?.confidence ?? 0
          const result = evaluateParameter(key, val, system, waterType)
          return { ...result, raw_ocr_value: val, confidence: conf }
        })
        setParameters(params)
      } else {
        initEmpty()
      }
    } catch {
      initEmpty()
    } finally {
      setProcessingOCR(false)
    }
  }

  function initEmpty() {
    const paramKeys = Object.keys(RANGES[system]?.[waterType] || {})
    const params = paramKeys.map((key) => ({
      parameter_key: key,
      verified_value: null,
      unit: RANGES[system]?.[waterType]?.[key]?.unit || '',
      status: 'sin_dato' as const,
    }))
    setParameters(params)
  }

  function handleValueChange(key: string, value: number | null) {
    const result = evaluateParameter(key, value, system, waterType)
    const idx = parameters.findIndex((p) => p.parameter_key === key)
    if (idx !== -1) {
      const updated = [...parameters]
      updated[idx] = { ...updated[idx], ...result, verified_value: value, manually_corrected: true }
      setParameters(updated)
    } else {
      updateParameter(key, value)
    }
  }

  if (isProcessingOCR) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <Loader2 className="h-10 w-10 text-way-petroleo animate-spin" />
        <p className="text-gray-600">Procesando imagen con OCR...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Revisa y corrige los valores antes de generar el diagnóstico. Los campos en amarillo tuvieron baja confianza en el OCR.
      </p>

      {capturedImage && (
        <img src={capturedImage} alt="Formulario capturado" className="w-full rounded-lg object-contain max-h-48 border border-way-gris" />
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-way-gris">
              <th className="text-left py-2 px-3 text-gray-500 font-medium">Parámetro</th>
              <th className="text-left py-2 px-3 text-gray-500 font-medium">Valor</th>
              <th className="text-left py-2 px-3 text-gray-500 font-medium">Unidad</th>
              <th className="text-left py-2 px-3 text-gray-500 font-medium">Rango</th>
              <th className="text-left py-2 px-3 text-gray-500 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {parameters.map((p) => (
              <ParameterRow
                key={p.parameter_key}
                param={p}
                system={system}
                waterType={waterType}
                onValueChange={handleValueChange}
                editable
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={prevStep} className="flex-1">← Atrás</Button>
        <Button onClick={nextStep} className="flex-1">Generar diagnóstico →</Button>
      </div>
    </div>
  )
}
