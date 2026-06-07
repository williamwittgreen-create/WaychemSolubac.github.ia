export type UserRole = 'admin' | 'tecnico' | 'supervisor' | 'cliente'
export type SystemType = 'caldera' | 'torre' | 'chiller'
export type WaterType = 'agua_caldera' | 'agua_alimentacion' | 'agua_equipo' | 'pretratada' | 'retorno'
export type ParameterStatus = 'normal' | 'bajo' | 'alto' | 'critico_bajo' | 'critico_alto' | 'sin_dato'
export type ReportStatus = 'draft' | 'validated' | 'sent'
export type RiskLevel = 'bajo' | 'medio' | 'alto' | 'critico'

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  avatar_url?: string
  active: boolean
  created_at: string
}

export interface Client {
  id: string
  name: string
  company: string
  contact_name: string
  email: string
  phone: string
  address: string
  ruc?: string
  internal_notes?: string
  frequency_days?: number
  created_by: string
  created_at: string
}

export interface System {
  id: string
  client_id: string
  type: SystemType
  name: string
  location: string
  capacity?: string
  install_date?: string
  notes?: string
  active: boolean
}

export interface ParameterResult {
  id?: string
  sample_id?: string
  parameter_key: string
  raw_ocr_value?: number | null
  verified_value?: number | null
  unit: string
  status: ParameterStatus
  manually_corrected?: boolean
  confidence?: number
}

export interface Report {
  id?: string
  client_id: string
  system_id: string
  equipment_id?: string
  water_type: WaterType
  technician_id: string
  date: string
  time: string
  status: ReportStatus
  sent_at?: string
  created_at?: string
  client?: Client
  system?: System
}

export interface Diagnosis {
  id?: string
  report_id?: string
  summary?: string
  resultado_text: string
  consecuencia_text: string
  recomendacion_text: string
  risk_level: RiskLevel
  generated_by_ai: boolean
  edited_by?: string
  created_at?: string
}

export interface ParameterRange {
  min?: number
  max?: number
  critical_low?: number
  critical_high?: number
  unit: string
  label_es: string
}

export interface WaterAnalysis {
  pH?: { value: number | null; confidence: number }
  conductividad?: { value: number | null; confidence: number }
  alcalinidadP?: { value: number | null; confidence: number }
  alcalinidadM?: { value: number | null; confidence: number }
  alcalinidadOH?: { value: number | null; confidence: number }
  durezaTotal?: { value: number | null; confidence: number }
  cloruros?: { value: number | null; confidence: number }
  ciclos?: { value: number | null; confidence: number }
  fosfatos?: { value: number | null; confidence: number }
  sulfito?: { value: number | null; confidence: number }
  hierro?: { value: number | null; confidence: number }
  silice?: { value: number | null; confidence: number }
  TDS?: { value: number | null; confidence: number }
  nitritos?: { value: number | null; confidence: number }
  [key: string]: { value: number | null; confidence: number } | undefined
}
