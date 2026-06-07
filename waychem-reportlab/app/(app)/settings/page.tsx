import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display text-way-petroleo">Configuración</h1>
      <Card>
        <CardHeader><CardTitle>Datos de empresa</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <p><strong>Empresa:</strong> Waychem – Soluciones Químicas y Biotecnológicas</p>
          <p><strong>Correo:</strong> servicioswaychem@gmail.com</p>
          <p><strong>Teléfono:</strong> 6953-8288</p>
          <p><strong>País:</strong> Panamá</p>
          <p><strong>Región:</strong> Chiriquí</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Rangos recomendados</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">La edición de rangos está disponible para administradores y supervisores. Los rangos se cargan automáticamente desde Supabase al iniciar la sesión.</p>
          <div className="text-xs text-gray-400 space-y-1">
            <p>Caldera / Agua caldera: pH 10.5–11.5, Conductividad 0–3500 µS/cm</p>
            <p>Torre / Agua equipo: pH 7.0–8.5, Conductividad 500–3000 µS/cm</p>
            <p>Chiller / Agua equipo: pH 7.5–9.0, Conductividad 0–500 µS/cm</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Integraciones</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <p>🤖 <strong>Claude API</strong> — Diagnóstico inteligente</p>
          <p>👁️ <strong>Google Vision API</strong> — OCR primario</p>
          <p>📧 <strong>Resend</strong> — Envío de reportes por email</p>
          <p>🗄️ <strong>Supabase</strong> — Base de datos y autenticación</p>
        </CardContent>
      </Card>
    </div>
  )
}
