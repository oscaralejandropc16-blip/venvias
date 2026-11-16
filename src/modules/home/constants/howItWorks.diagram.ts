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
  imageAlt?: string
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
      stepNumber: '01',
      title: 'Circula por el peaje',
      subtitle: 'Tránsito libre y continuo por pórtico Free Flow sin detener la marcha.',
      description:
        'El vehículo transita por el carril exclusivo de telepeaje a velocidad regulada de autopista, sin detenerse ante barreras ni cabinas físicas.',
      tagLabel: 'PASO 1 · FREE FLOW',
      imageAlt: 'Circula por el peaje',
      bulletPoints: [
        'Circulación continua a velocidad regulada de autopista.',
        'Pórtico inteligente sin barreras físicas ni detención.',
        'Tránsito 100% fluido sin colas frente al peaje.',
      ],
      technicalData: [
        { label: 'Modalidad', value: 'Free Flow' },
        { label: 'Velocidad', value: 'Hasta 80 km/h' },
      ],
    },
    {
      id: 'identifica',
      stepNumber: '02',
      title: 'Se identifica la placa',
      subtitle: 'Reconocimiento óptico instantáneo mediante cámaras de alta velocidad.',
      description:
        'Cámaras de alta velocidad capturan la matrícula frontal y trasera, contrastándola en milisegundos con el registro oficial nacional.',
      tagLabel: 'PASO 2 · LECTURA ALPR',
      imageAlt: 'Se identifica la placa',
      bulletPoints: [
        'Cámaras ALPR con iluminación infrarroja estroboscópica.',
        'Validación de la matrícula oficial de 7 caracteres.',
        'Registro fotográfico de evidencia con marca de tiempo.',
      ],
      technicalData: [
        { label: 'Precisión ALPR', value: '99.85%' },
        { label: 'Formato auditado', value: '7 Caracteres' },
      ],
    },
    {
      id: 'calcula',
      stepNumber: '03',
      title: 'Se calcula la tarifa',
      subtitle: 'Determinación automática de la tasa de peaje oficial por categoría.',
      description:
        'Se registra el punto de control, sentido de circulación y tarifa oficial aplicable según la categoría del vehículo.',
      tagLabel: 'PASO 3 · TASA DE PEAJE',
      imageAlt: 'Se calcula la tarifa',
      bulletPoints: [
        'Registro automático del punto de control y sentido.',
        'Tarifa oficial según la categoría del vehículo.',
        'Asiento contable en el sistema central de VenVías.',
      ],
      technicalData: [
        { label: 'Asiento', value: 'Sistema central' },
        { label: 'Tarifa', value: 'Tasa oficial aprobada' },
      ],
    },
    {
      id: 'verifica',
      stepNumber: '04',
      title: 'Se verifica el pago',
      subtitle: 'Comprobación de método de pago: TAG activo o saldo en la placa.',
      description:
        'Se comprueba en línea si la placa cuenta con fondos prepagados o TAG activo para el cobro automático.',
      tagLabel: 'PASO 4 · VERIFICACIÓN',
      imageAlt: 'Se verifica el pago',
      bulletPoints: [
        'Consulta en tiempo real del saldo disponible en la placa.',
        'Con pago válido: cobro realizado automáticamente.',
        'Emisión inmediata de recibo fiscal digital descargable.',
      ],
      technicalData: [
        { label: 'Medio', value: 'TAG o Placa con saldo' },
        { label: 'Respuesta', value: 'Cobro automático' },
      ],
    },
    {
      id: 'deuda',
      stepNumber: '05',
      title: 'Sin pago válido · Se genera deuda',
      subtitle: 'Asiento de obligación pendiente por falta de saldo o sin TAG.',
      description:
        'Si no hay saldo suficiente, se registra una obligación pendiente vinculada a la placa para su posterior cancelación.',
      tagLabel: 'PASO 5 · SALDO DEUDOR',
      imageAlt: 'Sin pago válido · Se genera una deuda',
      routeType: 'debt',
      bulletPoints: [
        'El vehículo continúa su marcha sin bloqueos físicos.',
        'Se genera una obligación pendiente asociada a la placa.',
        'Sin recargos adicionales al cancelar dentro del lapso reglamentario.',
      ],
      technicalData: [
        { label: 'Estado', value: 'Saldo deudor registrado' },
        { label: 'Identificador', value: 'Placa vehicular' },
      ],
    },
    {
      id: 'cancela',
      stepNumber: '06',
      title: 'Se cancela el pendiente',
      subtitle: 'Regularización digital en portal web o en estaciones de peaje.',
      description:
        'La deuda permanece asociada a la placa hasta su cancelación oportuna en línea o en taquillas de peaje.',
      tagLabel: 'PASO 6 · REGULARIZACIÓN',
      imageAlt: 'Se cancela el pendiente',
      bulletPoints: [
        'Pago seguro en línea en este portal web de VenVías.',
        'Opción de cancelación presencial en estaciones de peaje.',
        'Liberación inmediata del saldo deudor y comprobante digital.',
      ],
      technicalData: [
        { label: 'Canales', value: 'Portal web y Peajes' },
        { label: 'Actualización', value: 'Inmediata' },
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
