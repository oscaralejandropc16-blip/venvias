export interface DiagramStepTechnical {
  label: string
  value: string
}

export interface DiagramStep {
  id: string
  stepNumber: string
  title: string
  subtitle: string
  description: string
  bulletPoints: string[]
  technicalData: DiagramStepTechnical[]
  tagLabel?: string
  routeType?: 'standard' | 'success' | 'debt'
}

export interface FooterInfoCard {
  id: string
  icon: string
  title: string
  highlight?: string
  paragraphs: string[]
}

export interface HowItWorksDiagramConfig {
  title: string
  subtitle: string
  intro: string
  printHeader: {
    institution: string
    documentType: string
    version: string
  }
  printActions: {
    downloadButton: string
    downloadUrl: string
    downloadFilename: string
    printButton: string
    printNote: string
  }
  steps: DiagramStep[]
  footerCards: FooterInfoCard[]
}

export const HOW_IT_WORKS_DIAGRAM: HowItWorksDiagramConfig = {
  title: 'Cobro por Placa',
  subtitle: 'Cobro por Placa · Cómo funciona',
  intro:
    'Conoce el flujo operativo del sistema Free Flow de VenVías: desde la circulación continua y lectura de la placa hasta la confirmación del pago o la gestión transparente de la deuda pendiente.',
  printHeader: {
    institution: 'VENVÍAS · SISTEMA AUTOMATIZADO DE RECAUDACIÓN VIAL',
    documentType: 'FLUJO OPERATIVO OFICIAL: COBRO POR PLACA',
    version: 'Versión Oficial 2026 — República Bolivariana de Venezuela',
  },
  printActions: {
    downloadButton: 'Descargar infografía original',
    downloadUrl: '/cobro-por-placa.png',
    downloadFilename: 'infografia-oficial-cobro-por-placa.png',
    printButton: 'Imprimir ficha técnica / PDF',
    printNote: 'Descarga la infografía oficial en alta resolución o imprime la ficha técnica en formato estándar.',
  },
  steps: [
    {
      id: 'circula',
      stepNumber: '1',
      title: 'Circula por el peaje',
      subtitle: 'Tránsito libre y continuo por pórtico Free Flow',
      description: 'El vehículo atraviesa un peaje Free Flow.',
      tagLabel: 'ETAPA 1 · PASO LIBRE',
      bulletPoints: [
        'Circulación continua a velocidad regulada sin detener la marcha.',
        'Pórtico de telepeaje sin barreras físicas ni casetas de detención.',
        'Eliminación de colas, retenciones y congestión en autopistas.',
      ],
      technicalData: [
        { label: 'Modalidad', value: 'Free Flow (Paso libre continuo)' },
        { label: 'Velocidad', value: 'Velocidad autorizada de autopista' },
        { label: 'Control', value: 'Pórtico automatizado' },
      ],
    },
    {
      id: 'identifica',
      stepNumber: '2',
      title: 'Se identifica la placa',
      subtitle: 'Captura y reconocimiento automático de la matrícula oficial',
      description: 'El sistema ALPR reconoce automáticamente la placa.',
      tagLabel: 'ETAPA 2 · LECTURA ALPR',
      bulletPoints: [
        'Cámaras ALPR de alta resolución con iluminadores infrarrojos estroboscópicos.',
        'Validación óptica del formato oficial venezolano de 7 caracteres (AB123CD).',
        'Registro fotográfico de evidencia inalterable con marca de tiempo.',
      ],
      technicalData: [
        { label: 'Tecnología', value: 'Cámaras ALPR infrarrojas 850 nm' },
        { label: 'Formato auditado', value: 'AB123CD (Placa venezolana)' },
        { label: 'Verificación', value: 'Reconocimiento OCR en tiempo real' },
      ],
    },
    {
      id: 'calcula',
      stepNumber: '3',
      title: 'Se calcula la tarifa',
      subtitle: 'Determinación automática de la tasa de peaje correspondiente',
      description: 'Se registra el tránsito y se determina la tasa de peaje.',
      tagLabel: 'ETAPA 3 · TASA DE PEAJE',
      bulletPoints: [
        'Registro instantáneo del punto de control y sentido de circulación.',
        'Determinación de la tarifa oficial correspondiente a la categoría del vehículo.',
        'Asiento contable del hecho generador en la plataforma central de VenVías.',
      ],
      technicalData: [
        { label: 'Asiento', value: 'Tránsito registrado en sistema central' },
        { label: 'Tarifa', value: 'Tasa oficial aprobada por categoría' },
        { label: 'Procesamiento', value: 'Cálculo algorítmico automatizado' },
      ],
    },
    {
      id: 'verifica',
      stepNumber: '4',
      title: 'Se verifica el pago',
      subtitle: 'Comprobación de método de pago: TAG o saldo en placa',
      description:
        'Se comprueba si existe un método de pago válido: TAG o placa con saldo suficiente.',
      tagLabel: 'ETAPA 4 · VERIFICACIÓN',
      bulletPoints: [
        'Consulta en tiempo real de la cuenta asociada a la matrícula identificada.',
        'Verificación de dispositivo TAG activo o billetera prepagada con saldo suficiente.',
        'Con pago válido → Cobro realizado automáticamente al instante con recibo digital.',
      ],
      technicalData: [
        { label: 'Medios válidos', value: 'TAG VenVías / Billetera con saldo' },
        { label: 'Consulta', value: 'En línea en base de datos nacional' },
        { label: 'Con pago válido', value: 'Cobro realizado con comprobante' },
      ],
    },
    {
      id: 'deuda',
      stepNumber: '5',
      title: 'Sin pago válido · Se genera una deuda',
      subtitle: 'Asiento de obligación pendiente por saldo insuficiente o sin TAG',
      description:
        'Si no hay un método de pago válido o el saldo es insuficiente, se genera una obligación pendiente.',
      tagLabel: 'ETAPA 5 · OBLIGACIÓN PENDIENTE',
      routeType: 'debt',
      bulletPoints: [
        'El vehículo continúa su marcha sin interrupción ni bloqueo físico.',
        'Se genera una obligación pendiente vinculada formalmente a la placa.',
        'El usuario puede consultar y regularizar el saldo sin sanciones dentro del lapso legal.',
      ],
      technicalData: [
        { label: 'Estado', value: 'Obligación pendiente asentada' },
        { label: 'Identificador', value: 'Placa vehicular nacional' },
        { label: 'Composición', value: 'Tasa de peaje + cargos administrativos' },
      ],
    },
    {
      id: 'cancela',
      stepNumber: '6',
      title: 'Se cancela el pendiente',
      subtitle: 'Regularización digital en portal web o en estaciones de peaje',
      description: 'La deuda permanece asociada a la placa hasta su cancelación.',
      tagLabel: 'ETAPA 6 · REGULARIZACIÓN',
      routeType: 'standard',
      bulletPoints: [
        'Cancelación ágil a través del portal oficial web de VenVías (botón de pago).',
        'Pago presencial disponible en cualquiera de las estaciones de peaje a nivel nacional.',
        'Emisión de comprobante fiscal digital y actualización inmediata del estado de la placa.',
      ],
      technicalData: [
        { label: 'Canales de pago', value: 'Portal web en línea y Estaciones de peaje' },
        { label: 'Comprobante', value: 'Recibo fiscal digital descargable' },
        { label: 'Actualización', value: 'Liberación inmediata del saldo deudor' },
      ],
    },
  ],
  footerCards: [
    {
      id: 'include-and-pay',
      icon: 'billetera',
      title: '¿QUÉ INCLUYE Y DÓNDE SE PAGA?',
      highlight: 'Deuda = tasa de peaje + cargos administrativos',
      paragraphs: [
        'La deuda puede cobrarse en cualquiera de las estaciones de peaje a nivel nacional o pagarse de forma segura en línea a través de este portal web de VenVías.',
      ],
    },
    {
      id: 'legal-obligation',
      icon: 'documento',
      title: 'SOBRE LA OBLIGACIÓN DE PAGO',
      paragraphs: [
        'La obligación de pago del peaje nace con la utilización efectiva de la infraestructura vial, mientras que la placa constituye el identificador del vehículo asociado al hecho generador.',
        'El propietario registrado sería el sujeto al que se atribuye inicialmente la obligación pendiente, sujeto a las reglas y excepciones establecidas por la autoridad competente.',
      ],
    },
  ],
}
