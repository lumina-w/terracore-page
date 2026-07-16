export interface Plan {
  name: string;
  target: string;
  features: string[];
  highlight: boolean;
  ctaText: string;
  ctaEvent: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export const PLANS: Plan[] = [
  {
    name: 'Semilla',
    target: 'Para fincas que quieren dejar de operar a ciegas.',
    features: [
      '1 sede · 5 usuarios',
      'Gestión de Animales (CRUD + estado de salud)',
      'Salud Animal (vacunas + alertas próximas 30 días)',
      'Producción (lotes + eventos)',
      'Inventario (insumos + alertas de stock)',
      'Dashboard (4 KPI principales)',
    ],
    highlight: false,
    ctaText: 'Comenzar trial gratis',
    ctaEvent: 'click_cta_plans_semilla',
  },
  {
    name: 'Profesional',
    target: 'Para operaciones que necesitan saber qué genera y qué cuesta cada área.',
    features: [
      'Todo lo de Semilla',
      '3 sedes · 15 usuarios',
      'Gestión de Herramientas (mantenimiento)',
      'Costos automáticos por lote (rentabilidad)',
      'Proveedores y Compras',
      'Dashboard avanzado (comparativos, tendencias)',
      'Importación CSV en bulk',
      'Soporte WhatsApp + videollamada ≤4 h',
    ],
    highlight: true,
    ctaText: 'Quiero saber más',
    ctaEvent: 'click_cta_plans_pro',
  },
  {
    name: 'Enterprise',
    target: 'Para grupos empresariales y cooperativas.',
    features: [
      'Todo lo de Profesional',
      'Sedes y usuarios ilimitados',
      'Vista consolidada multifinca',
      'Trazabilidad GlobalG.A.P.',
      'Logística y despachos',
      'API para integraciones',
      'Reportes gerenciales',
      'Soporte prioritario 24h · Implementación dedicada · Revisiones trimestrales',
    ],
    highlight: false,
    ctaText: 'Quiero saber más',
    ctaEvent: 'click_cta_plans_enterprise',
  },
];

export interface Problem {
  icon: string;
  title: string;
  desc: string;
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
];

export interface Feature {
  icon: string;
  title: string;
  description: string;
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
];

export const FAQ: FaqItem[] = [
  {
    q: '¿Funciona si en mi finca no hay buena señal?',
    a: 'Sí. Sabemos que en zonas como Urabá la conectividad falla. TerraCore funciona sin internet: registras en el corral y se sincroniza automáticamente cuando vuelve la señal.',
  },
  {
    q: '¿Es complicado de implementar?',
    a: 'No. La mayoría de empresas están operando en menos de 30 minutos. Te acompañamos en cada paso.',
  },
  {
    q: '¿Cuánto cuesta?',
    a: 'Desde $2.5M COP/mes dependiendo del tamaño de tu operación. Agenda una llamada y armamos un presupuesto exacto.',
  },
  {
    q: '¿Cómo adoptan TerraCore los operarios de campo?',
    a: 'La app está pensada para usarse con guantes y en condiciones de campo: botones grandes, flujo rápido, sin jerga técnica. Los operarios aprenden a registrar en minutos. Si tienes equipo con poca experiencia tecnológica, te acompañamos en el proceso de adopción.',
  },
  {
    q: '¿TerraCore usa mis datos para entrenar modelos de IA?',
    a: 'No. Tu información no se usa para publicidad, no se comparte con terceros y no entrena ningún modelo de inteligencia artificial. Trabajamos bajo la Ley 1581 de 2012. Tus datos son tuyos, y punto.',
  },
  {
    q: '¿Funciona para fincas mixtas (ganadería + cultivos)?',
    a: 'Sí. Puedes tener animales, lotes de cultivo, insumos compartidos y herramientas en la misma cuenta. TerraCore registra todo en un solo lugar, independiente del tipo de producción.',
  },
  {
    q: '¿El soporte es en español?',
    a: 'Sí. Nuestro equipo está en Colombia y entiende el contexto agroindustrial local.',
  },
  {
    q: '¿Qué pasa si quiero cancelar?',
    a: 'Sin penalidades ni letras pequeñas. Solo avísanos con 30 días de anticipación.',
  },
];
