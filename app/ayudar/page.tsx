import Link from 'next/link'

const WA_GROUPS = {
  volunteers: 'https://chat.whatsapp.com/F1eAuXQzBgX9UQqkwDstbA',
  transport:  'https://chat.whatsapp.com/EvyCwxakPZT2qvStjsvZpm',
  photos:     'https://chat.whatsapp.com/GjKxOSVU2S0H87ogYCLxrc',
}

const GROUPS = [
  {
    emoji: '❤️',
    title: 'Equipo de voluntarios',
    desc: 'Ayudá en eventos, actividades de difusión y tareas de la organización.',
    href: WA_GROUPS.volunteers,
  },
  {
    emoji: '🚗',
    title: 'Equipo de traslados',
    desc: 'Llevá animales al veterinario, a hogares de tránsito o a sus nuevas familias.',
    href: WA_GROUPS.transport,
  },
  {
    emoji: '📸',
    title: 'Fotos y edición',
    desc: 'Sacá fotos profesionales a los rescatados para que lleguen a más personas.',
    href: WA_GROUPS.photos,
  },
]

function WaIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.553 4.107 1.516 5.835L0 24l6.335-1.494A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.896 0-3.673-.524-5.192-1.432L3 21.5l.96-3.676A9.963 9.963 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  )
}

export default function AyudarPage() {
  return (
    <main>
      {/* Hero */}
      <section
        className="py-20 px-4"
        style={{ background: 'linear-gradient(135deg, var(--green) 0%, #3d4a1e 100%)' }}
      >
        <div className="max-w-3xl mx-auto text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3 text-white/70">
            Voluntariado
          </p>
          <h1 className="text-4xl md:text-5xl font-black mb-4">¿Querés ayudar?</h1>
          <p className="text-lg text-white/80 max-w-xl mx-auto">
            No hace falta adoptar para hacer la diferencia. Hay muchas formas de sumar desde donde estés.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">

        {/* Tránsito — card destacada */}
        <div className="card p-8 border-2 border-orange/20 hover:border-orange/40 transition-colors duration-200">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="text-5xl flex-shrink-0">🏠</div>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-orange mb-1">
                La ayuda más grande
              </p>
              <h2 className="text-2xl font-bold text-brand-dark mb-2">Ser hogar de tránsito</h2>
              <p className="text-brand-dark/60 mb-5">
                Ofrecé tu hogar temporalmente a un animal rescatado mientras encuentra su familia
                definitiva. La organización cubre los gastos básicos — alimento y veterinaria esencial.
              </p>
              <Link href="/ayudar/transito" className="btn-primary inline-block">
                Quiero ser provisorio →
              </Link>
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-cream-darker" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-cream px-4 text-sm text-brand-dark/40">Otras formas de ayudar</span>
          </div>
        </div>

        {/* Grupos de WhatsApp */}
        <div className="grid md:grid-cols-3 gap-4">
          {GROUPS.map((g) => (
            <a
              key={g.title}
              href={g.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card p-6 hover:-translate-y-1 transition-transform duration-200 text-center flex flex-col items-center"
            >
              <div className="text-4xl mb-3">{g.emoji}</div>
              <h3 className="font-bold text-brand-dark mb-2">{g.title}</h3>
              <p className="text-sm text-brand-dark/60 mb-5 flex-1">{g.desc}</p>
              <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                <WaIcon />
                Unirme al grupo
              </span>
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}
