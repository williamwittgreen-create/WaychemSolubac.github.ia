import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY! })

interface OutOfRangeParam {
  label: string
  valor: number | null
  unit: string
  min?: number
  max?: number
  estado: string
}

export async function POST(req: NextRequest) {
  try {
    const { system, waterType, clientName, outOfRange, normalCount, totalCount } = await req.json()

    const outOfRangeText = (outOfRange as OutOfRangeParam[])
      .map((r) => `- ${r.label}: ${r.valor} ${r.unit} (rango: ${r.min ?? '—'}–${r.max ?? '—'}) → ${r.estado}`)
      .join('\n')

    const prompt = `Eres un ingeniero químico senior especialista en tratamiento de agua industrial con 20 años de experiencia.
Empresa: Waychem – Soluciones Químicas y Biotecnológicas. País: Panamá.

Sistema evaluado: ${system}
Tipo de agua: ${waterType}
Cliente: ${clientName}

PARÁMETROS FUERA DE RANGO:
${outOfRangeText || 'Ninguno'}

PARÁMETROS NORMALES: ${normalCount} de ${totalCount} parámetros dentro de rango.

Genera un diagnóstico técnico profesional. Tono: técnicamente preciso, claro para clientes no especialistas, no alarmista.
Estructura: explicar condición, consecuencia y acción. Máximo 4 oraciones por sección.
Responde SOLO con JSON sin markdown:
{"resultado":"...","consecuencia":"...","recomendacion":"...","riesgo_general":"bajo|medio|alto|critico"}`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : '{}'
    const diagnosis = JSON.parse(text)
    return NextResponse.json(diagnosis)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
