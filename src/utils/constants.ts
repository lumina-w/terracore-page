// Single source of truth for the landing's section data.
// Each array below is consumed by exactly one section component:
//   PLANS       -> Pricing.astro       (pricing cards)
//   IMPACT_ROWS -> Impacto.astro       (before / after table)
//   BENEFITS    -> Benefits.astro      (why-TerraCore grid)
//   FAQ         -> FAQSection.astro (copy) + index.astro (FAQPage JSON-LD)

export interface Plan {
  /** Plan name shown as the card eyebrow (e.g. "Semilla"). */
  name: string;
  /** One-line positioning sentence under the name. */
  desc: string;
  /** Price headline (e.g. "COP $2.500.000" or a label like "A consultar"). */
  priceMain: string;
  /** Price suffix rendered next to the headline (e.g. "/mes"). */
  priceSub: string;
  /** When true, priceMain renders as a plain label instead of an amount. */
  priceIsLabel: boolean;
  /** Small print under the price, or null when there is none. */
  priceNote: string | null;
  /** Optional value-framing line (only used by the entry plan today). */
  valueNote?: string;
  /** Bullet list of what the plan includes. */
  features: string[];
  /** CTA button label. */
  cta: string;
  /** CTA destination (external link). */
  ctaHref: string;
  /** Highlights the card as "Recomendado". Exactly one plan should set this. */
  featured: boolean;
}

export const PLANS: Plan[] = [
  {
    name: 'Semilla',
    desc: 'Para validar TerraCore en tu finca y dejar de operar a ciegas.',
    priceMain: 'COP $2.500.000',
    priceSub: '/mes',
    priceIsLabel: false,
    priceNote: 'Acceso completo por 14 días',
    valueNote: 'Menos de lo que cuesta una compra de urgencia evitable al mes.',
    features: [
      'Deja de operar de memoria y con cuadernos',
      'Alertas antes de perder un animal o un insumo',
      '1 sede · 5 usuarios máximo',
      'Roles Admin y Operario únicamente',
      'Animales (CRUD completo + estado de salud)',
      'Salud Animal (vacunas + alertas próximas 30 días)',
      'Producción (lotes + eventos)',
      'Insumos (inventario + alertas de stock)',
      'Dashboard (4 KPI principales)',
      'Implementación en 24 horas',
    ],
    cta: 'Comenzar trial gratis',
    ctaHref: 'https://app.terracoreapp.co/login',
    featured: false,
  },
  {
    name: 'Profesional',
    desc: 'Para operaciones mixtas complejas que necesitan saber qué genera y qué cuesta cada área.',
    priceMain: 'COP $5.000.000',
    priceSub: '/mes',
    priceIsLabel: false,
    priceNote: null,
    features: [
      'Sabe exactamente qué área de tu finca es rentable',
      'Todo lo de Semilla +',
      'Múltiples sedes con permisos por sede',
      'Múltiples usuarios con roles configurables',
      'Herramientas (mantenimiento)',
      'Finanzas básica: costo y margen por lote',
      'Ranking de rentabilidad por lote',
      'Proveedores y compras',
      'Alertas cuando el costo supera el ingreso',
      'Módulos de Usuarios y Suscripción',
      'Dashboard avanzado (comparativos, tendencias)',
      'Implementación en 3 a 5 días',
    ],
    cta: 'Quiero saber más',
    ctaHref:
      'https://wa.me/573108283088?text=Hola%2C%20quiero%20saber%20m%C3%A1s%20sobre%20el%20plan%20Profesional%20de%20TerraCore',
    featured: true,
  },
  {
    name: 'Enterprise',
    desc: 'Para empresas con múltiples sedes, grupos empresariales y cooperativas.',
    priceMain: 'COP $10.000.000',
    priceSub: '/mes',
    priceIsLabel: false,
    priceNote: '* Precio base · plan personalizado según tu operación',
    features: [
      'Visibilidad consolidada de toda tu operación multifinca',
      'Todo lo de Profesional +',
      'Todos los módulos (incluida Finanzas avanzada)',
      'Finanzas Enterprise: P&L avanzado y registro de pérdidas',
      'Reportes a medida y API',
      'Base para integración DIAN/NIIF',
      'Usuarios y sedes ilimitados',
      'Soporte prioritario: respuesta en máximo 24 h',
      'Implementación dedicada: onboarding con el equipo',
      'Revisiones trimestrales de optimización y roadmap',
      'Plazo de implementación personalizado',
    ],
    cta: 'Contáctanos',
    ctaHref:
      'https://wa.me/573108283088?text=Hola%2C%20quiero%20conocer%20el%20plan%20Enterprise%20de%20TerraCore%20para%20mi%20operaci%C3%B3n',
    featured: false,
  },
];

export interface ImpactRow {
  /** How it works today (the "before" column). */
  before: string;
  /** How it works with TerraCore (the "after" column). */
  after: string;
}

export const IMPACT_ROWS: ImpactRow[] = [
  { before: 'Excel, cuadernos y WhatsApp', after: 'Todo en un solo lugar' },
  {
    before: 'Información en la cabeza de una persona',
    after: 'Datos accesibles por todo el equipo',
  },
  { before: 'Compras de urgencia', after: 'Alertas antes de que se acabe el stock' },
  { before: 'Vacunas vencidas', after: 'Recordatorios automáticos' },
  { before: '"Creo que…" para decidir', after: 'Números reales para decidir' },
  { before: 'Pérdidas sin saber por qué', after: 'Trazabilidad completa por lote y animal' },
];

export interface Benefit {
  /** Iconify icon name (e.g. "lucide:wifi"). */
  icon: string;
  /** Benefit heading. */
  title: string;
  /** Supporting sentence. */
  desc: string;
}

export const BENEFITS: Benefit[] = [
  {
    icon: 'lucide:wifi',
    title: 'Funciona offline en la finca',
    desc: 'Registra en el corral aunque no haya señal. Se sincroniza solo cuando vuelve la red.',
  },
  {
    icon: 'lucide:clock',
    title: 'En marcha en tu primera semana',
    desc: 'Sin consultores, sin meses de implementación. En tu primera semana ya tienes datos reales.',
  },
  {
    icon: 'lucide:users',
    title: 'Pensado para varios roles',
    desc: 'El dueño ve la rentabilidad. El administrador gestiona. El operario registra. Todos sobre la misma información.',
  },
  {
    icon: 'lucide:bar-chart-2',
    title: 'Decisiones con datos reales',
    desc: 'Producción por mes, costo por lote, consumo de concentrado por animal. Lo que antes era suposición, ahora es un número.',
  },
  {
    icon: 'lucide:alert-circle',
    title: 'Nada se te pasa',
    desc: 'Vacunas que vencen, stock bajo, animales en tratamiento. La alerta llega antes de que sea un problema.',
  },
  {
    icon: 'lucide:leaf',
    title: 'En español, para el campo',
    desc: 'Sin jerga técnica. Sin términos en inglés. Hablamos de lotes, dosis, kilos y unidades, como en tu finca.',
  },
  {
    icon: 'lucide:handshake',
    title: 'Construido con productores colombianos',
    desc: 'TerraCore nació de entrevistas y trabajo directo con productores de Urabá, nuestro foco actual. Desde ahí crecemos hacia Antioquia (café y ganado) y Cundinamarca (papa y hortalizas): una herramienta diseñada desde las necesidades reales de la finca.',
  },
];

export interface FaqItem {
  q: string;
  a: string;
}

// Single source of truth for the FAQ: rendered by FAQSection.astro (visible
// accordion) and by index.astro (FAQPage JSON-LD schema). Keep visible copy and
// schema in sync by editing here only.
export const FAQ: FaqItem[] = [
  {
    q: '¿Cuánto tiempo toma implementar TerraCore?',
    a: 'Depende del plan. En Semilla arrancas en 24 horas: importas tu inventario desde Excel, defines usuarios y empiezas a registrar. En Profesional toma de 3 a 5 días, con sesiones de onboarding y migración de tus historiales. En Enterprise el despliegue es personalizado según el número de sedes e integraciones que necesites.',
  },
  {
    q: '¿Cuánto cuesta?',
    a: 'Desde $2.5M COP/mes según el tamaño de tu operación. El precio definitivo se confirma en una llamada, cuando conocemos tu número de sedes, usuarios y módulos. Pago mensual, sin permanencia forzada.',
  },
  {
    q: '¿Qué diferencia hay entre los planes?',
    a: 'Semilla (1 sede, 5 usuarios) cubre animales, salud, producción, inventario y dashboard básico. Profesional (3 sedes, 15 usuarios) suma herramientas, costos y rentabilidad por lote, proveedores, dashboard avanzado, importación CSV y soporte prioritario. Enterprise añade sedes y usuarios ilimitados, vista consolidada multifinca, trazabilidad GlobalG.A.P., API y SLA prioritario. El detalle completo está en la sección de Planes.',
  },
  {
    q: '¿Puedo cancelar en cualquier momento?',
    a: 'Sí. Sin penalidades ni letras pequeñas: solo avísanos con 30 días de anticipación y te entregamos toda tu información antes de cerrar la cuenta.',
  },
  {
    q: '¿Funciona si en mi finca no hay buena señal?',
    a: 'Sí. La app web guarda todo lo que registres sin internet y sincroniza cuando vuelva la señal. El dashboard web requiere conexión, pero los registros del campo nunca se pierden.',
  },
  {
    q: '¿Puedo migrar desde Excel?',
    a: 'Sí. Tenemos plantillas de importación para animales, insumos, herramientas e historiales sanitarios. La migración está incluida en planes Profesional y Enterprise. En Semilla te damos las plantillas y lo haces tú mismo.',
  },
  {
    q: '¿Qué tipos de finca soporta?',
    a: 'Si produces en ella, TerraCore lo registra. Bovino (carne y leche), porcino, equino, ovino, caprino, avícola y cultivos asociados como plátano, cacao y maíz. Si tu operación combina ganadería y cultivos, mejor: animales, lotes, insumos compartidos y herramientas quedan en la misma cuenta.',
  },
  {
    q: '¿Tiene aplicación móvil?',
    a: 'TerraCore es una PWA (Progressive Web App) optimizada para mobile. La instalas desde el navegador en Android o iOS, sin pasar por el App Store. Funciona offline, con botones grandes y captura rápida pensada para usarla en el campo.',
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
    q: '¿Qué pasa con mis datos si dejo de usar TerraCore?',
    a: 'Te entregamos un export completo en CSV en máximo 48 horas y borramos tu información de nuestros servidores. Sin trampas, sin "datos rehén".',
  },
  {
    q: '¿El soporte es en español?',
    a: 'Sí. Nuestro equipo está en Colombia y entiende el contexto agroindustrial local.',
  },
  {
    q: '¿De dónde viene la cifra del 42%?',
    a: 'El 42% proviene de datos iniciales de operaciones piloto en la región de Urabá durante 2026. Este impacto varía según tamaño de la operación, complejidad de la cadena de suministro y nivel de adopción del equipo. Compartimos estos números de forma transparente para dar contexto real del producto.',
  },
];
