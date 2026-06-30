import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Requisitos de adopción — Somos Su Voz',
  description: 'Conocé los requisitos y condiciones para adoptar un animal rescatado a través de Somos Su Voz.',
}

const ageCategories = [
  {
    emoji: '🍼',
    label: 'Cachorro',
    age: 'Menos de 1 año',
    color: '#E8891A',
    bg: '#FFF3E0',
    pros: ['Podés criarlo desde pequeño', 'Se adapta fácilmente a la familia'],
    cons: [
      'Requiere atención constante',
      'Come con mayor frecuencia',
      'Puede hacer destrozos',
      'Llora de noche si está solo',
      'Todavía no sabe hacer sus necesidades afuera',
      'Necesita castración obligatoria entre los 6 y 12 meses',
    ],
  },
  {
    emoji: '⚡',
    label: 'Joven',
    age: '1 a 5 años',
    color: '#5C6B2E',
    bg: '#F1F4E8',
    pros: [
      'Juguetón pero maduro',
      'Aprende rápido',
      'Come 2 veces por día',
      'Tamaño y personalidad ya definidos',
      'Entregado castrado/esterilizado',
    ],
    cons: [],
  },
  {
    emoji: '🌟',
    label: 'Adulto',
    age: '5 a 9 años',
    color: '#C4720F',
    bg: '#FFF8EE',
    pros: [
      'Tolera bien los momentos a solas',
      'Se adapta fácilmente al nuevo hogar',
      'Carácter formado y predecible',
      'Menos demandante de atención constante',
    ],
    cons: [],
  },
  {
    emoji: '🤍',
    label: 'Senior',
    age: '10 años o más',
    color: '#7A8A3A',
    bg: '#F1F4E8',
    pros: [
      'Tranquilo y sedentario',
      'Gratitud inconmensurable',
      'Compañía cálida y sin sorpresas',
      'Ideal para hogares tranquilos',
    ],
    cons: ['Mayor cuidado veterinario', 'Tiempo juntos más acotado'],
  },
]

const requirements = [
  {
    n: 1,
    title: 'Entrevista previa',
    text: 'Antes de la entrega realizamos una entrevista telefónica o por WhatsApp para conocerte y asegurarnos de que el animal elegido sea compatible con tu hogar y estilo de vida.',
  },
  {
    n: 2,
    title: 'Contrato de adopción',
    text: 'Firmás un contrato que establece el compromiso de brindarle al animal cuidado responsable de por vida: alimentación, atención veterinaria, amor y un hogar seguro.',
  },
  {
    n: 3,
    title: 'Castración obligatoria',
    text: 'Los animales mayores de 6 meses son entregados ya castrados o esterilizados. Los cachorros más pequeños deben ser castrados entre los 6 y los 12 meses — es un requisito indispensable.',
  },
  {
    n: 4,
    title: 'Seguimiento post adopción',
    text: 'Después de la adopción hacemos un seguimiento para asegurarnos de que el animal se adaptó bien. Estamos disponibles para acompañarte en el proceso.',
  },
  {
    n: 5,
    title: 'Aprobación de la organización',
    text: 'Nos reservamos el derecho de aprobar o rechazar solicitudes basándonos en el bienestar del animal y los valores de la organización. No todas las postulaciones resultan en adopción.',
  },
  {
    n: 6,
    title: 'Confidencialidad',
    text: 'Los datos personales que nos compartís se utilizan únicamente para el proceso de adopción y nunca son compartidos con terceros.',
  },
]

export default function RequisitosPage() {
  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-20" style={{ background: 'linear-gradient(135deg, #5C6B2E 0%, #3E4A1E 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <Link
            href="/adopcion"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors mb-8"
          >
            ← Volver a adopción
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Antes de adoptar,<br />
            <span style={{ color: '#F5A94A' }}>leé esto</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Un animal de compañía puede vivir entre 14 y 18 años. Adoptar es una decisión
            para toda la vida — la de ellos y, en parte, la tuya.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L1440 50L1440 15C1200 50 960 0 720 15C480 30 240 0 0 15L0 50Z" fill="#FAF6EE"/>
          </svg>
        </div>
      </section>

      {/* ── Antes de adoptar ── */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-orange font-semibold text-sm uppercase tracking-widest mb-3">Reflexionalo bien</p>
            <h2 className="section-title mb-6">¿Estás listo/a para adoptar?</h2>
            <div className="space-y-4 text-brand-dark/70 leading-relaxed">
              <p>
                Antes de tomar la decisión, evaluá honestamente tu situación. Un animal necesita
                espacio, tiempo, dinero y, sobre todo, amor constante.
              </p>
              <p>
                Tené en cuenta el espacio disponible en tu hogar, el tiempo que podés dedicarle
                al juego y al paseo, y los costos de alimentación y atención veterinaria.
              </p>
              <p>
                Asegurate de que todos en tu hogar estén de acuerdo y de que el animal elegido
                se ajuste a tu estilo de vida.
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <div
              className="relative w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden border-8 shadow-xl"
              style={{ borderColor: 'var(--orange)' }}
            >
              <Image
                src="/assets/perrito1.jpg"
                alt="Antes de adoptar"
                fill
                className="object-cover"
                sizes="288px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Categorías de edad ── */}
      <section className="py-16" style={{ background: 'var(--cream-dark)' }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-orange font-semibold text-sm uppercase tracking-widest mb-3">¿A quién adoptar?</p>
            <h2 className="section-title">Cada etapa tiene su magia</h2>
            <p className="section-subtitle max-w-xl mx-auto">
              No hay una edad mejor que otra — cada animal tiene algo único para darte.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ageCategories.map((cat) => (
              <div key={cat.label} className="card p-5 flex flex-col">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4"
                  style={{ background: cat.bg }}
                >
                  {cat.emoji}
                </div>
                <p className="font-bold text-brand-dark text-lg">{cat.label}</p>
                <p className="text-xs font-medium mb-4" style={{ color: cat.color }}>{cat.age}</p>

                {cat.pros.length > 0 && (
                  <ul className="space-y-1.5 mb-3">
                    {cat.pros.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-xs text-brand-dark/70">
                        <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px]" style={{ background: cat.color }}>✓</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                )}

                {cat.cons.length > 0 && (
                  <div className="mt-auto pt-3 border-t border-cream-dark">
                    <p className="text-[10px] font-semibold text-brand-dark/40 uppercase tracking-wider mb-2">A tener en cuenta</p>
                    <ul className="space-y-1">
                      {cat.cons.map((c) => (
                        <li key={c} className="flex items-start gap-2 text-xs text-brand-dark/50">
                          <span className="mt-0.5 flex-shrink-0">·</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Requisitos ── */}
      <section id="requisitos" className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <p className="text-orange font-semibold text-sm uppercase tracking-widest mb-3">Proceso de adopción</p>
          <h2 className="section-title">Requisitos</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Para garantizar el bienestar de cada animal, seguimos un proceso simple pero necesario.
          </p>
        </div>

        <div className="space-y-4">
          {requirements.map((req) => (
            <div key={req.n} className="card p-6 flex gap-5 items-start">
              <div
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ background: 'var(--orange)' }}
              >
                {req.n}
              </div>
              <div>
                <h3 className="font-bold text-brand-dark mb-1">{req.title}</h3>
                <p className="text-sm text-brand-dark/65 leading-relaxed">{req.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #E8891A 0%, #C4720F 100%)' }}>
        <div className="max-w-2xl mx-auto px-4 text-center text-white">
          <div className="text-5xl mb-6">🐾</div>
          <h2 className="text-3xl font-bold mb-4">¿Querés adoptar?</h2>
          <p className="text-white/80 text-lg mb-8">
            Escribinos y empezamos el proceso juntos. Estamos acá para acompañarte.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://www.instagram.com/somos.su.voz.vmvn/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline px-8 py-4"
            >
              Contactanos por Instagram
            </a>
            <Link href="/adopcion" className="btn-outline px-8 py-4">
              Ver animales disponibles
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
