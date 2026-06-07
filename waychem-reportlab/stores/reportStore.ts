import { create } from 'zustand'
import { Report, Diagnosis, ParameterResult, SystemType, WaterType } from '@/types'

interface ReportState {
  currentStep: number
  report: Partial<Report>
  parameters: ParameterResult[]
  diagnosis: Partial<Diagnosis> | null
  capturedImage: string | null
  isProcessingOCR: boolean
  isGeneratingDiagnosis: boolean

  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  updateReport: (data: Partial<Report>) => void
  setParameters: (params: ParameterResult[]) => void
  updateParameter: (key: string, value: number | null) => void
  setDiagnosis: (d: Partial<Diagnosis>) => void
  setCapturedImage: (img: string | null) => void
  setProcessingOCR: (v: boolean) => void
  setGeneratingDiagnosis: (v: boolean) => void
  resetReport: () => void
}

const initialReport: Partial<Report> = {
  status: 'draft',
  date: new Date().toISOString().split('T')[0],
  time: new Date().toTimeString().slice(0, 5),
}

export const useReportStore = create<ReportState>((set) => ({
  currentStep: 1,
  report: initialReport,
  parameters: [],
  diagnosis: null,
  capturedImage: null,
  isProcessingOCR: false,
  isGeneratingDiagnosis: false,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 6) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),
  updateReport: (data) => set((s) => ({ report: { ...s.report, ...data } })),
  setParameters: (parameters) => set({ parameters }),
  updateParameter: (key, value) =>
    set((s) => ({
      parameters: s.parameters.map((p) =>
        p.parameter_key === key ? { ...p, verified_value: value, manually_corrected: true } : p
      ),
    })),
  setDiagnosis: (d) => set((s) => ({ diagnosis: { ...s.diagnosis, ...d } })),
  setCapturedImage: (img) => set({ capturedImage: img }),
  setProcessingOCR: (v) => set({ isProcessingOCR: v }),
  setGeneratingDiagnosis: (v) => set({ isGeneratingDiagnosis: v }),
  resetReport: () =>
    set({
      currentStep: 1,
      report: initialReport,
      parameters: [],
      diagnosis: null,
      capturedImage: null,
      isProcessingOCR: false,
      isGeneratingDiagnosis: false,
    }),
}))
