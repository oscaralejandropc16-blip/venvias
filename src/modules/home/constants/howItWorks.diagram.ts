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
}

export const HOW_IT_WORKS_DIAGRAM = {
  title: 'Ficha Técnica: Sistema de Cobro por Placa',
  intro:
    'Arquitectura del flujo operativo continuo: desde la detección dinámica en calzada abierta hasta la conciliación bancaria y liquidación de tránsitos.',
  printHeader: {
    institution: 'VENVÍAS · SISTEMA AUTOMATIZADO DE RECAUDACIÓN VIAL',
    documentType: 'ESPECIFICACIÓN TÉCNICA DE OPERACIONES Y FREE FLOW',
    version: 'Versión 2.4 — Aprobación Oficial',
  },
  printActions: {
    printButton: 'Imprimir ficha técnica / Guardar en PDF',
    printNote: 'Formato optimizado para archivo y distribución institucional en hoja estándar A4 / Carta.',
  },
  steps: [
    {
      id: 'gantry',
      stepNumber: '01',
      title: 'Paso por Pórtico Free Flow',
      subtitle: 'Detección volumétrica y tránsito ininterrumpido sin barreras.',
      description:
        'El vehículo atraviesa la zona de control a velocidad regulada de autopista. Sensores láser volumétricos (LiDAR) y antenas de telepeaje montadas en el pórtico superior identifican la aproximación del móvil en tiempo real sin requerir detención ni cabinas físicas.',
      bulletPoints: [
        'Tránsito continuo a velocidad autorizada (hasta 80 km/h).',
        'Eliminación total de filas, cuellos de botella y demoras en peaje.',
        'Antenas omnidireccionales de alta frecuencia con verificación de TAG activo.',
      ],
      technicalData: [
        { label: 'Tiempo de detección', value: '< 35 ms' },
        { label: 'Cobertura de carril', value: '100% de la calzada' },
        { label: 'Protocolo de paso', value: 'ISO/IEC 18000-6C' },
      ],
    },
    {
      id: 'alpr',
      stepNumber: '02',
      title: 'Lectura Óptica ALPR de Alta Velocidad',
      subtitle: 'Reconocimiento algorítmico de matrícula frontal y trasera.',
      description:
        'Cámaras de alta resolución con iluminación infrarroja estroboscópica capturan la matrícula del vehículo. El motor OCR procesa y valida los 7 caracteres del formato venezolano (A B 1 2 3 C D), contrastando la imagen contra la base de datos nacional en milisegundos.',
      bulletPoints: [
        'Cámaras de doble lente para captura diurna y visión nocturna infrarroja.',
        'Algoritmo de segmentación de placa ajustado a la matrícula venezolana.',
        'Registro fotográfico de evidencia con marca de tiempo inalterable.',
      ],
      technicalData: [
        { label: 'Precisión de lectura', value: '99.85%' },
        { label: 'Formato auditado', value: 'AB123CD (7 caracteres)' },
        { label: 'Iluminación', value: 'Infrarrojo 850 nm' },
      ],
    },
    {
      id: 'wim',
      stepNumber: '03',
      title: 'Clasificación y Pesaje Dinámico WIM',
      subtitle: 'Medición de carga por eje en movimiento y asignación de categoría.',
      description:
        'Sensores piezoeléctricos y placas sensoras embutidas en la carpeta asfáltica determinan el peso bruto vehicular y la distribución de carga por eje. El sistema clasifica automáticamente el vehículo (liviano, transporte público o carga pesada) para computar la tarifa oficial exacta.',
      bulletPoints: [
        'Pesaje en movimiento (Weigh-in-Motion) sin detener la marcha.',
        'Clasificación automática por número de ejes, rodaje y peso volumétrico.',
        'Detección y alerta inmediata de sobrepeso para resguardo de la infraestructura vial.',
      ],
      technicalData: [
        { label: 'Precisión de pesaje', value: 'Norma OIML R134 Clase I' },
        { label: 'Categorización', value: 'Automática por ejes y silueta' },
        { label: 'Rango de pesaje', value: '0 a 60 toneladas' },
      ],
    },
    {
      id: 'clearing',
      stepNumber: '04',
      title: 'Liquidación y Conciliación Inmediata',
      subtitle: 'Débito automático al saldo disponible o registro de saldo deudor.',
      description:
        'El sistema central de cobro concilia la matrícula identificada con la billetera virtual de VenVías. Si cuenta con saldo prepagado o tarjeta vinculada, la tarifa se debita instantáneamente emitiendo comprobante fiscal digital. De lo contrario, el tránsito se asienta como saldo deudor legalmente exigible sin recargos sorpresa.',
      bulletPoints: [
        'Débito automático en tiempo real con confirmación inmediata.',
        'Si no hay saldo suficiente, el tránsito pasa a Saldo Deudor para cancelación web.',
        'Generación de comprobante fiscal digital descargable con código QR de verificación.',
      ],
      technicalData: [
        { label: 'Dispersión bancaria', value: 'Inmediata (Botón de Pago IPG)' },
        { label: 'Comprobante', value: 'Emisión digital fiscal' },
        { label: 'Lapso de pago deudor', value: 'Plazo legal reglamentario' },
      ],
    },
  ],
  legalSummary:
    'La obligación de pago del peaje se perfecciona con el uso efectivo de la infraestructura vial en conformidad con la normativa del Ministerio del Poder Popular para el Transporte Terrestre. Los registros de lectura ALPR y pesaje dinámico WIM constituyen evidencia fehaciente del tránsito vehicular.',
}
