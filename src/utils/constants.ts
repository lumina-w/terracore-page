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
