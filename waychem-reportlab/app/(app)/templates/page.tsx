import { Card, CardContent } from '@/components/ui/card'
import { FileText, Download } from 'lucide-react'

const templates = [
  { name: 'Plantilla Caldera', file: 'plantilla-caldera.xlsx', desc: 'Formulario de análisis para calderas industriales' },
  { name: 'Plantilla Torre de Enfriamiento', file: 'plantilla-torre.xlsx', desc: 'Formulario de análisis para torres de enfriamiento' },
  { name: 'Plantilla Chiller', file: 'plantilla-chiller.xlsx', desc: 'Formulario de análisis para sistemas chiller' },
]

export default function TemplatesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold font-display text-way-petroleo">Plantillas Excel</h1>
      <p className="text-sm text-gray-500">Descarga los formularios oficiales de Waychem para el análisis de agua.</p>
      <div className="space-y-3">
        {templates.map((t) => (
          <Card key={t.file} className="hover:shadow-md transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-way-verde" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.desc}</p>
                </div>
              </div>
              <button className="flex items-center gap-2 text-way-petroleo text-sm hover:underline">
                <Download className="h-4 w-4" /> Descargar
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
