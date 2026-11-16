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
      subtitle: 'Tránsito libre y continuo por pórtico Free Flow',
      description:
        'El vehículo transita por el carril exclusivo de telepeaje a velocidad regulada de autopista, sin detenerse ante barreras ni cabinas físicas.',
      tagLabel: 'PASO 1 · FREE FLOW',
      imageAlt: 'Vehículo circulando continuamente a velocidad regulada por el carril de telepeaje Free Flow',
      bulletPoints: [
        'Circulación continua a velocidad regulada de autopista.',
        'Pórtico inteligente sin barreras físicas ni detención.',
        'Tránsito 100% fluido sin colas frente al peaje.',
      ],
      technicalData: [
        { label: 'Velocidad', value: 'Hasta 80 km/h' },
        { label: 'Detección', value: '< 35 ms' },
      ],
    },
    {
      id: 'identifica',
      stepNumber: '02',
      title: 'Se identifica la placa',
      subtitle: 'Reconocimiento óptico ALPR instantáneo',
      description:
        'Cámaras de alta velocidad capturan la matrícula frontal y trasera, contrastándola en milisegundos con el registro oficial nacional.',
      tagLabel: 'PASO 2 · LECTURA ALPR',
      imageAlt: 'Cámaras ALPR capturando y reconociendo ópticamente la placa del vehículo en tiempo real',
      bulletPoints: [
        'Cámaras ALPR con iluminación infrarroja estroboscópica.',
        'Validación de la matrícula oficial de 7 caracteres.',
        'Registro fotográfico de evidencia con marca de tiempo.',
      ],
      technicalData: [
        { label: 'Precisión ALPR', value: '99.85%' },
        { label: 'Formato auditado', value: '7 Caracteres Oficiales' },
      ],
    },
    {
      id: 'cancela',
      stepNumber: '03',
      title: 'Conciliación y pago',
      subtitle: 'Débito automático o registro de saldo deudor',
      description:
        'El peaje se debita automáticamente del saldo de la placa. Si no cuenta con fondos suficientes, se asienta como saldo deudor para cancelación web.',
      tagLabel: 'PASO 3 · LIQUIDACIÓN',
      imageAlt: 'Liquidación automática de tarifa con comprobante fiscal o asignación a saldo deudor',
      bulletPoints: [
        'Débito inmediato con emisión de recibo fiscal digital.',
        'Si no hay saldo suficiente, se registra deuda sin recargos.',
        'Consulta y pago en línea o en estaciones de peaje.',
      ],
      technicalData: [
        { label: 'Liquidación', value: 'En tiempo real' },
        { label: 'Alternativa', value: 'Pago de deuda web' },
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
