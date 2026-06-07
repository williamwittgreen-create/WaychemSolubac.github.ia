'use client'
import { useReportStore } from '@/stores/reportStore'
import { Step1_Client } from '@/components/report/Step1_Client'
import { Step2_System } from '@/components/report/Step2_System'
import { Step3_Capture } from '@/components/report/Step3_Capture'
import { Step4_Verify } from '@/components/report/Step4_Verify'
import { Step5_Diagnostic } from '@/components/report/Step5_Diagnostic'
import { Step6_Preview } from '@/components/report/Step6_Preview'
import { StepHeader } from '@/components/report/StepHeader'

const STEPS = [
  { title: 'Cliente', description: 'Selecciona el cliente' },
  { title: 'Sistema', description: 'Define el equipo y muestra' },
  { title: 'Captura', description: 'Sube foto o ingresa datos' },
  { title: 'Verificar', description: 'Confirma los valores OCR' },
  { title: 'Diagnóstico', description: 'Revisa el análisis IA' },
  { title: 'Vista previa', description: 'Exporta y envía el reporte' },
]

const StepComponents = [Step1_Client, Step2_System, Step3_Capture, Step4_Verify, Step5_Diagnostic, Step6_Preview]

export default function NewReportPage() {
  const { currentStep } = useReportStore()
  const StepComponent = StepComponents[currentStep - 1]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <StepHeader steps={STEPS} currentStep={currentStep} />
      <StepComponent />
    </div>
  )
}
