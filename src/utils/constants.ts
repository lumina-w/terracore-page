export interface Plan {
  name: string
  target: string
  features: string[]
  highlight: boolean
  ctaText: string
  ctaEvent: string
}

export interface FaqItem {
  q: string
  a: string
}

export const PLANS: Plan[] = [
  {
    name: 'Semilla',
    target: 'Fincas pequeñas que inician su digitalización',
    features: [
      'Dashboard básico de operaciones',
      'Hasta 3 usuarios',
      'Módulo de inventario',
      'Reportes mensuales en PDF',
      'Soporte por email (48 h)',
    ],
    highlight: false,
    ctaText: 'Contáctanos',
    ctaEvent: 'click_cta_plans_semilla',
  },
  {
    name: 'Profesional',
    target: 'Operaciones medianas que necesitan visibilidad total',
    features: [
      'Todo lo de Semilla',
      'Hasta 15 usuarios',
      'Alertas en tiempo real',
      'Módulo pecuario completo',
      'Reportes ilimitados + BI',
      'Soporte prioritario (4 h)',
      'API para integraciones',
    ],
    highlight: true,
    ctaText: 'Agendar demo',
    ctaEvent: 'click_cta_plans_pro',
  },
  {
    name: 'Enterprise',
    target: 'Grupos empresariales y cooperativas',
    features: [
      'Todo lo de Profesional',
      'Usuarios ilimitados',
      'Multi-sede y multi-empresa',
      'SLA 99.9 % garantizado',
      'Implementación asistida',
      'Capacitación on-site',
    ],
    highlight: false,
    ctaText: 'Contactar ventas',
    ctaEvent: 'click_cta_plans_enterprise',
  },
]

export interface Problem {
  icon: string
  title: string
  desc: string
}

export const PROBLEMS: Problem[] = [
  {
    icon: 'file-spreadsheet',
    title: 'Datos dispersos',
    desc: 'Información en Excel, WhatsApp y cuadernos. Sin una sola fuente de verdad.',
  },
  {
    icon: 'eye-off',
    title: 'Sin visibilidad en tiempo real',
    desc: 'No sabes el estado de salud animal ni de inventario hasta que ya es tarde.',
  },
  {
    icon: 'trending-down',
    title: 'Decisiones a ciegas',
    desc: 'Sin datos de rentabilidad por lote, cultivo o mes, no puedes optimizar.',
  },
  {
    icon: 'alert-triangle',
    title: 'Personal apagando incendios',
    desc: 'Tu equipo gestiona crisis en lugar de enfocarse en producir y crecer.',
  },
]

export interface Feature {
  icon: string
  title: string
  description: string
}

export const FEATURES: Feature[] = [
  {
    icon: 'layout-dashboard',
    title: 'Dashboard centralizado',
    description:
      'Toda tu operación en una pantalla: inventario, personal, lotes y finanzas. Sin abrir diez hojas de cálculo.',
  },
  {
    icon: 'bell-ring',
    title: 'Alertas en tiempo real',
    description:
      'Recibe notificaciones antes de que los problemas escalen. Actúa sobre datos, no sobre rumores.',
  },
  {
    icon: 'shield-check',
    title: 'Control total de operación',
    description:
      'Toma decisiones basadas en rentabilidad real. Por lote, por mes, por cultivo. Sin adivinar.',
  },
]

export const FAQ: FaqItem[] = [
  {
    q: '¿Es complicado de implementar?',
    a: 'No. La mayoría de empresas están operando en menos de 30 minutos. Te acompañamos en cada paso.',
  },
  {
    q: '¿Funciona sin conexión a internet?',
    a: 'Sí. Sabemos que en zonas como Urabá la conectividad falla. TerraCore sincroniza automáticamente cuando vuelve la señal.',
  },
  {
    q: '¿Cuánto cuesta?',
    a: 'Desde $10M COP/mes dependiendo del tamaño de tu operación. Agenda una llamada y armamos un presupuesto exacto.',
  },
  {
    q: '¿El soporte es en español?',
    a: 'Sí. Nuestro equipo está en Colombia y entiende el contexto agroindustrial local.',
  },
  {
    q: '¿Qué pasa si quiero cancelar?',
    a: 'Sin penalidades ni letras pequeñas. Solo avísanos con 30 días de anticipación.',
  },
]
