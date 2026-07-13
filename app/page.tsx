import Image from 'next/image'
import Link from 'next/link'
import { supabase, getBankAccounts, getSettings } from '@/lib/supabase'
import { Animal, getPrimaryPhoto } from '@/lib/types'
// import TeamSection from '@/components/TeamSection'

export const dynamic = 'force-dynamic'

async function getRecentAnimals(): Promise<Animal[]> {
  const { data } = await supabase
    .from('animals')
    .select('*, media:animal_media(*)')
    .eq('is_available', true)
    .order('created_at', { ascending: false })
    .limit(3)
  return (data as Animal[]) ?? []
}

export default async function HomePage() {
  const [recentAnimals, bankAccounts, settings] = await Promise.all([
    getRecentAnimals(),
    getBankAccounts(),
    getSettings(),
  ])

  return (
    <main>
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #5C6B2E 0%, #3E4A1E 100%)' }}>
        <div className="absolute inset-0 opacity-10 paw-pattern-light" />

        {/* Patitas flotando */}
        <span className="hidden md:block absolute top-16 left-[15%] text-4xl opacity-30 animate-float-paw select-none">🐾</span>
        <span className="hidden md:block absolute bottom-24 right-[12%] text-3xl opacity-25 animate-float-paw select-none" style={{ animationDelay: '1.5s' }}>🐾</span>
        <span className="hidden md:block absolute top-1/2 right-[28%] text-2xl opacity-20 animate-float-paw select-none" style={{ animationDelay: '3s' }}>🐾</span>

        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-white text-center md:text-left">
            <p className="text-orange text-sm font-semibold uppercase tracking-widest mb-4">
              🐾 Grupo de Proteccionistas — Villa María, Cba
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Somos su voz.<br />
              <span style={{ color: '#F5A94A' }}>¿Serás su hogar?</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-lg mb-10">
              Rescatamos, cuidamos y buscamos familia para perros y gatos que lo perdieron todo.
              Cada adopción transforma dos vidas: la de ellos y la tuya.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link href="/adopcion" className="btn-primary text-base px-8 py-4">
                Ver animales en adopción
              </Link>
              <a href="#donar" className="btn-outline text-base px-8 py-4">
                Quiero donar
              </a>
            </div>
          </div>
          <div
            className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden  shadow-xl"
          // style={{ borderColor: 'var(--orange)' }}
          >
            <Image
              src="/assets/loggo.jpg"
              alt="Adoptá un animal rescatado"
              fill
              className="object-cover"
              sizes="360px"
            />
          </div>

        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#FAF6EE" />
          </svg>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 -mt-2 py-12">
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[
            { num: '🐶', label: 'Perros rescatados' },
            { num: '🐱', label: 'Gatos rescatados' },
            { num: '❤️', label: 'Familias felices' },
          ].map((s) => (
            <div key={s.label} className="card-tilt text-center py-6 px-3 cursor-default">
              <p className="text-3xl mb-2">{s.num}</p>
              <p className="text-xs text-brand-dark/50 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ADOPTAR ───────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          {/* Imagen circular */}
          <div className="flex flex-col items-center gap-5">
            <div
              className="relative w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden border-8 shadow-xl"
              style={{ borderColor: 'var(--orange)' }}
            >
              <Image
                src="/assets/perrito1.jpg"
                alt="Adoptá un animal rescatado"
                fill
                className="object-cover"
                sizes="320px"
              />
            </div>
            {/* <Link href="/adopcion" className="btn-primary px-8">
              Postulate aquí
            </Link> */}
          </div>

          {/* Texto */}
          <div>
            <p className="text-orange font-semibold text-sm uppercase tracking-widest mb-3">Adopción responsable</p>
            <h2 className="section-title mb-6">Adoptá</h2>
            <p className="text-brand-dark/70 leading-relaxed mb-8">
              Al pensar en adoptar, es crucial tener en cuenta diversos factores para garantizar
              una convivencia armoniosa. Evaluá el espacio disponible en tu hogar, el tiempo que
              podés dedicar al juego y paseo, así como los costos de alimentación y atención veterinaria.
              Asegurate de que tu elección se ajuste a tu estilo de vida.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/adopcion/requisitos" className="btn-primary">
                Antes de adoptar
              </Link>
              <Link href="/adopcion/requisitos#requisitos" className="btn-secondary">
                Requisitos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── ANIMALES RECIENTES ────────────────────────────────── */}
      {recentAnimals.length > 0 && (
        <section className="py-16" style={{ background: 'var(--cream-dark)' }}>
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-orange font-semibold text-sm uppercase tracking-widest mb-3">Recién llegados</p>
              <h2 className="section-title">Están esperando un hogar</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              {recentAnimals.map((animal) => {
                const photo = getPrimaryPhoto(animal)
                return (
                  <Link key={animal.id} href={`/adopcion/${animal.id}`} className="card-hover block overflow-hidden group">
                    <div className="aspect-[4/3] bg-cream-dark overflow-hidden">
                      {photo ? (
                        <img
                          src={photo}
                          alt={animal.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">
                          {animal.species === 'dog' ? '🐶' : '🐱'}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-brand-dark text-lg">{animal.name}</h3>
                      <p className="text-sm text-brand-dark/50">{animal.breed ?? 'Raza mixta'} · {animal.species === 'dog' ? 'Perro' : 'Gato'}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
            <div className="text-center">
              <Link href="/adopcion" className="btn-primary">
                Ver todos los animales
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── DONÁ ──────────────────────────────────────────────── */}
      <section id="donar" className="py-16" style={{ background: 'var(--cream-dark)' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-orange font-semibold text-sm uppercase tracking-widest mb-3">Colaborá con nosotros</p>
            <h2 className="section-title">Doná</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Doná alimentos */}
            <div className="card p-6 md:p-8 h-full flex flex-col">
              <h3 className="text-xl font-bold text-brand-dark mb-4">Doná alimentos</h3>
              <p className="text-brand-dark/70 leading-relaxed mb-6">
                Los animales que rescatamos necesitan alimento todos los días mientras esperan su familia adoptiva.
                Podés acercarnos alimento balanceado para perros y gatos — adultos o cachorros. Cualquier aporte hace la diferencia.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-cream-darker">
                  <span className="text-xl">🐶</span>
                  <div>
                    <p className="font-semibold text-sm text-brand-dark">Perros</p>
                    <p className="text-xs text-brand-dark/50">Balanceado adulto y cachorro</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-cream-darker">
                  <span className="text-xl">🐱</span>
                  <div>
                    <p className="font-semibold text-sm text-brand-dark">Gatos</p>
                    <p className="text-xs text-brand-dark/50">Balanceado adulto y gatito</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mt-auto">
                <a
                  href="https://www.instagram.com/somos.su.voz.vmvn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary self-start"
                >
                  Escribinos por Instagram
                </a>
              </div>
            </div>

            {/* Doná dinero */}
            <div className="card p-6 md:p-8 h-full flex flex-col">
              <h3 className="text-xl font-bold text-brand-dark mb-4">Doná dinero</h3>
              <p className="text-brand-dark/70 leading-relaxed mb-6">
                Tu aporte económico nos ayuda a pagar vacunas, castración, antiparasitarios y emergencias
                veterinarias de los animales que rescatamos. Cada peso cuenta y se destina al cuidado de quienes más lo necesitan.
              </p>

              <div className="space-y-3 mb-6">
                {bankAccounts.length > 0 ? (
                  bankAccounts.map((account) => (
                    <div key={account.id} className="p-4 bg-cream rounded-2xl border border-cream-darker">
                      <p className="text-xs font-semibold text-brand-dark/50 uppercase tracking-wider mb-3">
                        {account.owner_name}
                      </p>
                      <div className="space-y-2 text-sm">
                        {account.cbu && (
                          <div className="flex justify-between items-center gap-3">
                            <span className="text-brand-dark/50">CBU</span>
                            <span className="font-mono font-medium text-brand-dark text-right break-all">{account.cbu}</span>
                          </div>
                        )}
                        {account.alias && (
                          <div className="flex justify-between items-center gap-3">
                            <span className="text-brand-dark/50">Alias</span>
                            <span className="font-mono font-medium text-brand-dark text-right break-all">{account.alias}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-cream rounded-2xl border border-cream-darker text-sm text-brand-dark/50">
                    — próximamente —
                    </div>
                )}

                {settings.whatsapp_number && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-cream-darker">
                    <span className="text-xl">💵</span>
                    <div>
                      <p className="font-semibold text-sm text-brand-dark">Efectivo</p>
                      <p className="text-xs text-brand-dark/50">Coordiná la entrega por WhatsApp</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3 mt-auto">
                {settings.whatsapp_number && (
                  <a
                    href={`https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent('Hola! Quiero hacer una donación en efectivo, ¿cómo coordinamos?')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary self-start"
                  >
                    Coordinar por WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUIÉNES SOMOS ─────────────────────────────────────── */}
      {/* <TeamSection /> */}

      {/* ── CTA FINAL ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20" style={{ background: 'linear-gradient(135deg, #E8891A 0%, #C4720F 100%)' }}>
        <div className="absolute inset-0 paw-pattern-light opacity-40" />
        <span className="hidden md:block absolute top-10 right-[10%] text-4xl opacity-25 animate-float-paw select-none">🐾</span>
        <div className="relative max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex justify-center">
              <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-8 border-white/30 shadow-2xl flex-shrink-0">
                <Image
                  src="/assets/perrito3.jpg"
                  alt="Adoptá"
                  fill
                  className="object-cover"
                  sizes="256px"
                />
              </div>
            </div>
            <div className="text-white text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Un animal te está esperando
              </h2>
              <p className="text-white/80 text-lg mb-8">
                Decile que sí. Transformá su vida — y la tuya.
              </p>
              <Link href="/adopcion" className="btn-outline text-base px-10 py-4">
                Ver animales en adopción
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
