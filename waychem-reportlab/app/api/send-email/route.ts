import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { to, clientName, contactName, date, system, location, riskLevel, technicianName } = await req.json()

    const riskColors: Record<string, string> = {
      bajo: '#1FAE4B',
      medio: '#F59E0B',
      alto: '#F97316',
      critico: '#EF4444',
    }

    const color = riskColors[riskLevel] || '#0F5C7A'

    const { data, error } = await resend.emails.send({
      from: 'Waychem ReportLab <reportlab@waychem.com>',
      to: [to],
      subject: `Reporte técnico de tratamiento de agua — ${clientName} — ${date}`,
      html: `
        <div style="font-family: 'Open Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9;">
          <div style="background: #0F5C7A; padding: 28px 32px; text-align: left;">
            <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 700;">Waychem ReportLab</h1>
            <p style="color: rgba(255,255,255,0.7); margin: 4px 0 0; font-size: 13px;">Soluciones Químicas y Biotecnológicas</p>
          </div>
          <div style="padding: 32px; background: #ffffff;">
            <p style="color: #374151;">Estimado/a <strong>${contactName}</strong>,</p>
            <p style="color: #374151; line-height: 1.6;">
              Adjunto encontrará el reporte técnico correspondiente a la visita realizada el <strong>${date}</strong> 
              al sistema <strong>${system}</strong> ubicado en <strong>${location}</strong>.
            </p>
            <p style="color: #374151; line-height: 1.6;">
              El documento incluye resultados de análisis, interpretación técnica, observaciones y recomendaciones para seguimiento.
            </p>
            <div style="background: #f9f9f9; border-left: 4px solid ${color}; padding: 16px 20px; margin: 24px 0; border-radius: 0 8px 8px 0;">
              <p style="margin: 0; font-size: 14px; color: #374151;">
                <strong>Nivel de riesgo general identificado:</strong>
                <span style="color: ${color}; font-weight: 700; text-transform: uppercase; margin-left: 8px;">${riskLevel}</span>
              </p>
            </div>
            <p style="color: #374151;">Quedamos atentos ante cualquier consulta.</p>
            <p style="color: #374151;">
              <strong>${technicianName}</strong><br/>
              Waychem – Soluciones Químicas y Biotecnológicas<br/>
              📧 servicioswaychem@gmail.com | 📞 6953-8288
            </p>
          </div>
          <div style="background: #f3f4f6; padding: 16px 32px; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              Waychem ReportLab · Panamá · Este es un correo automático generado por el sistema.
            </p>
          </div>
        </div>
      `,
    })

    if (error) return NextResponse.json({ error }, { status: 400 })
    return NextResponse.json({ success: true, id: data?.id })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
