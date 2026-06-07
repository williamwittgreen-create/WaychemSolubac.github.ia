import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, system, waterType } = await req.json()

    // Primary: Google Vision API
    if (process.env.GOOGLE_VISION_API_KEY) {
      const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '')
      const visionRes = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requests: [{
              image: { content: base64Data },
              features: [{ type: 'TEXT_DETECTION' }],
            }],
          }),
        }
      )
      const visionData = await visionRes.json()
      const text = visionData.responses?.[0]?.fullTextAnnotation?.text || ''
      if (text) {
        return NextResponse.json({ text, source: 'google_vision' })
      }
    }

    // Fallback: Claude Vision API
    if (process.env.CLAUDE_API_KEY) {
      const Anthropic = (await import('@anthropic-ai/sdk')).default
      const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY })
      const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '')
      const mediaType = imageBase64.startsWith('data:image/png') ? 'image/png' : 'image/jpeg'

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64Data } },
            {
              type: 'text',
              text: `Eres un asistente especializado en lectura de formularios de análisis de agua industrial.
Sistema: ${system} | Tipo de agua: ${waterType}
Extrae TODOS los valores numéricos del formulario en la imagen.
Responde ÚNICAMENTE con JSON válido, sin texto adicional ni backticks.
Si un valor es ilegible usa null. Incluye un campo "confidence" (0-1) por valor.
{"pH":{"value":null,"confidence":0},"conductividad":{"value":null,"confidence":0},"alcalinidadP":{"value":null,"confidence":0},"alcalinidadM":{"value":null,"confidence":0},"alcalinidadOH":{"value":null,"confidence":0},"durezaTotal":{"value":null,"confidence":0},"cloruros":{"value":null,"confidence":0},"ciclos":{"value":null,"confidence":0},"fosfatos":{"value":null,"confidence":0},"sulfito":{"value":null,"confidence":0},"hierro":{"value":null,"confidence":0},"silice":{"value":null,"confidence":0},"TDS":{"value":null,"confidence":0},"nitritos":{"value":null,"confidence":0}}`
            }
          ],
        }],
      })

      const responseText = message.content[0].type === 'text' ? message.content[0].text : '{}'
      const parsed = JSON.parse(responseText)
      return NextResponse.json({ data: parsed, source: 'claude_vision' })
    }

    return NextResponse.json({ error: 'No OCR service configured' }, { status: 503 })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
