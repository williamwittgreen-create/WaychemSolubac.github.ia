'use client'
import { useRef } from 'react'
import { useReportStore } from '@/stores/reportStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Camera, Image, Keyboard } from 'lucide-react'
import { RANGES } from '@/lib/diagnosticEngine'
import { SystemType, WaterType } from '@/types'

export function Step3_Capture() {
  const { report, setCapturedImage, setParameters, nextStep, prevStep } = useReportStore()
  const fileRef = useRef<HTMLInputElement>(null)

  const system = report.system?.type as SystemType
  const waterType = report.water_type as WaterType
  const paramKeys = Object.keys(RANGES[system]?.[waterType] || {})

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setCapturedImage(ev.target?.result as string)
      nextStep()
    }
    reader.readAsDataURL(file)
  }

  function handleManual() {
    const blankParams = paramKeys.map((key) => ({
      parameter_key: key,
      verified_value: null,
      unit: RANGES[system]?.[waterType]?.[key]?.unit || '',
      status: 'sin_dato' as const,
    }))
    setParameters(blankParams)
    nextStep()
  }

  const captureFromCamera = () => {
    if (fileRef.current) {
      fileRef.current.accept = 'image/*'
      fileRef.current.setAttribute('capture', 'environment')
      fileRef.current.click()
    }
  }

  const captureFromGallery = () => {
    if (fileRef.current) {
      fileRef.current.removeAttribute('capture')
      fileRef.current.click()
    }
  }

  return (
    <div className="space-y-4">
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      <div className="grid gap-3">
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={captureFromCamera}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <Camera className="h-6 w-6 text-way-azulAgua" />
            </div>
            <div>
              <p className="font-medium">Tomar foto</p>
              <p className="text-sm text-gray-500">Usa la cámara trasera del dispositivo</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={captureFromGallery}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center">
              <Image className="h-6 w-6 text-way-turquesa" />
            </div>
            <div>
              <p className="font-medium">Subir desde galería</p>
              <p className="text-sm text-gray-500">Selecciona una foto existente</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={handleManual}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <Keyboard className="h-6 w-6 text-way-verde" />
            </div>
            <div>
              <p className="font-medium">Ingresar manualmente</p>
              <p className="text-sm text-gray-500">Escribe los valores directamente</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button variant="outline" onClick={prevStep} className="w-full">← Atrás</Button>
    </div>
  )
}
