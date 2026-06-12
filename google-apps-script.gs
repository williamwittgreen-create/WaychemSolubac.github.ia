/**
 * WAYCHEM — Formulario de Capacitación en Sanitización para Restaurantes
 * Google Apps Script — Receptor de Leads hacia Google Sheets
 *
 * ── INSTRUCCIONES DE INSTALACIÓN ──────────────────────────────────────────
 *
 *  1. Abra Google Sheets: https://sheets.google.com
 *     Cree una hoja nueva y nómbrela "Leads Capacitación"
 *
 *  2. En el menú: Extensiones → Apps Script
 *
 *  3. Borre el código de ejemplo que aparece y pegue TODO este archivo.
 *
 *  4. Guarde (Ctrl+S) y haga clic en "Desplegar" → "Nueva implementación"
 *       • Tipo:              Aplicación web
 *       • Ejecutar como:     Yo (su cuenta de Google)
 *       • Quién tiene acceso: Cualquier usuario
 *
 *  5. Haga clic en "Implementar" → Autorice los permisos solicitados.
 *
 *  6. Copie la URL del Web App que aparece (formato:
 *     https://script.google.com/macros/s/XXXXXXX/exec)
 *
 *  7. En el archivo capacitacion-restaurantes.html, busque la línea:
 *       const SCRIPT_URL = 'PEGAR_URL_DEL_WEB_APP_AQUI';
 *     y reemplace el texto por la URL copiada.
 *
 *  8. Confirme los cambios y republicar el sitio en GitHub Pages.
 *
 * ── FUNCIONAMIENTO ────────────────────────────────────────────────────────
 *  Cada vez que alguien envía el formulario, este script:
 *    • Recibe los datos en formato JSON
 *    • Añade una fila nueva en la hoja "Leads Capacitación"
 *    • Envía un correo de notificación al email configurado abajo
 *    • Retorna OK (el formulario muestra la pantalla de éxito)
 * ─────────────────────────────────────────────────────────────────────────
 */

// ── CONFIGURACIÓN ─────────────────────────────────────────────────────────
const SHEET_NAME   = 'Leads Capacitación';
const NOTIFY_EMAIL = 'servicioswaychem@gmail.com'; // correo donde llegan alertas
// ─────────────────────────────────────────────────────────────────────────

/**
 * Columnas de la hoja de cálculo (en orden).
 * Si agrega campos al formulario, añádalos también aquí.
 */
const COLUMNS = [
  'Timestamp',
  'Restaurante',
  'Encargado',
  'Cargo',
  'Teléfono',
  'WhatsApp',
  'Correo',
  'Dirección',
  'Tipo de Establecimiento',
  'Nº Empleados',
  'Personas a Capacitar',
  'Tiene Protocolos',
  'Temas Solicitados',
  'Desafío Sanitario',
  'Capacitación Previa',
  'Qué Espera Mejorar',
  'Modalidad',
  'Horario',
  'Fecha Capacitación',
  'Necesita Certificados',
  'Desea Cotización',
  'Desea Promociones',
  'Comentarios',
];

/** Mapa: nombre del campo en el formulario → columna de la hoja */
const FIELD_MAP = {
  timestamp:            'Timestamp',
  nombre_restaurante:   'Restaurante',
  nombre_encargado:     'Encargado',
  cargo:                'Cargo',
  telefono:             'Teléfono',
  whatsapp:             'WhatsApp',
  correo:               'Correo',
  direccion:            'Dirección',
  tipo_establecimiento: 'Tipo de Establecimiento',
  num_empleados:        'Nº Empleados',
  personas_capacitar:   'Personas a Capacitar',
  tiene_protocolos:     'Tiene Protocolos',
  'temas[]':            'Temas Solicitados',
  desafio_sanitario:    'Desafío Sanitario',
  capacitacion_previa:  'Capacitación Previa',
  que_mejorar:          'Qué Espera Mejorar',
  modalidad:            'Modalidad',
  'horario[]':          'Horario',
  fecha_capacitacion:   'Fecha Capacitación',
  necesita_certificados:'Necesita Certificados',
  desea_cotizacion:     'Desea Cotización',
  desea_promo:          'Desea Promociones',
  comentarios:          'Comentarios',
};

// ━━━ RECEPTOR POST ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function doPost(e) {
  try {
    const raw  = e.postData ? e.postData.contents : '{}';
    const data = JSON.parse(raw);
    appendRow(data);
    sendNotification(data);
  } catch (err) {
    Logger.log('Error doPost: ' + err.message);
  }

  // Respuesta con CORS abierto (el fetch usa no-cors, pero por si acaso)
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Soporte GET (permite verificar que el script está activo)
function doGet() {
  return ContentService
    .createTextOutput('Waychem · Script activo ✓')
    .setMimeType(ContentService.MimeType.TEXT);
}

// ━━━ ESCRIBIR FILA EN SHEETS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function appendRow(data) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let sheet   = ss.getSheetByName(SHEET_NAME);

  // Crear hoja si no existe y agregar encabezados
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS]);
    sheet.getRange(1, 1, 1, COLUMNS.length)
      .setBackground('#15803d')
      .setFontColor('#ffffff')
      .setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  // Construir fila en el orden de COLUMNS
  const colIndex = {};
  COLUMNS.forEach((c, i) => colIndex[c] = i);

  const row = new Array(COLUMNS.length).fill('');
  Object.entries(FIELD_MAP).forEach(([field, col]) => {
    const val = data[field];
    if (val !== undefined && val !== null && colIndex[col] !== undefined) {
      row[colIndex[col]] = String(val);
    }
  });

  sheet.appendRow(row);

  // Auto-ajustar columnas en las primeras 50 filas
  if (sheet.getLastRow() < 50) {
    sheet.autoResizeColumns(1, COLUMNS.length);
  }
}

// ━━━ CORREO DE NOTIFICACIÓN ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function sendNotification(data) {
  const restaurante = data.nombre_restaurante || '(sin nombre)';
  const encargado   = data.nombre_encargado   || '(sin nombre)';
  const correo      = data.correo             || '';
  const telefono    = data.telefono           || '';
  const modalidad   = data.modalidad          || '';
  const cotizacion  = data.desea_cotizacion   || '';

  const subject = `🍽️ Nueva solicitud de capacitación — ${restaurante}`;

  const body = `
Hola, William 👋

Llegó una nueva solicitud de capacitación en sanitización.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATOS DEL CLIENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Restaurante : ${restaurante}
Encargado   : ${encargado}
Cargo       : ${data.cargo || '—'}
Teléfono    : ${telefono}
WhatsApp    : ${data.whatsapp || telefono}
Correo      : ${correo}
Dirección   : ${data.direccion || '—'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DETALLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Establecimiento : ${data.tipo_establecimiento || '—'}
Empleados       : ${data.num_empleados || '—'}
A capacitar     : ${data.personas_capacitar || '—'} personas
Modalidad       : ${modalidad}
Fecha deseada   : ${data.fecha_capacitacion || 'Por coordinar'}
Certificados    : ${data.necesita_certificados || '—'}
Desea cotización: ${cotizacion}

Temas solicitados:
${data['temas[]'] || '—'}

Desafío actual:
${data.desafio_sanitario || '—'}

Qué espera mejorar:
${data.que_mejorar || '—'}

Comentarios:
${data.comentarios || '—'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Revisa la hoja de cálculo para ver todos los registros:
https://docs.google.com/spreadsheets/d/${SpreadsheetApp.getActiveSpreadsheet().getId()}

—
Waychem · Sistema de Leads Automático
`;

  GmailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}
