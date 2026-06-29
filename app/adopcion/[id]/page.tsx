export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import {
  Animal,
  getAgeText,
  getGenderText,
  getSizeText,
  getSpeciesText,
} from '@/lib/types'
import WhatsAppButton from '@/components/WhatsAppButton'

interface PageProps {
  params: { id: string }
}

export default async function AnimalDetailPage({ params }: PageProps) {
  const { data } = await supabase
    .from('animals')
    .select('*, media:animal_media(*)')
    .eq('id', params.id)
    .eq('is_available', true)
    .single()

  if (!data) notFound()

  const animal = data as Animal
  const photos = animal.media
    ?.filter((m) => m.type === 'photo')
    .sort((a, b) => a.order_index - b.order_index) ?? []
  const primaryPhoto = photos.find((m) => m.is_primary) ?? photos[0]

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <Link
        href="/adopcion"
        className="inline-flex items-center gap-2 text-sm text-brand-dark/50 hover:text-orange transition-colors mb-8"
      >
        ← Volver a adopción
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        {/* ── Galería ── */}
        <div className="space-y-3">
          <div className="aspect-square rounded-2xl overflow-hidden bg-cream-dark">
            {primaryPhoto ? (
              <img
                src={primaryPhoto.url}
                alt={animal.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl opacity-20">
                {animal.species === 'dog' ? '🐶' : '🐱'}
              </div>
            )}
          </div>

          {photos.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {photos.slice(1, 5).map((photo) => (
                <div key={photo.id} className="aspect-square rounded-xl overflow-hidden bg-cream-dark">
                  <img
                    src={photo.url}
                    alt={animal.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div className="space-y-6">
          {/* Nombre y especie */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-orange">
                {getSpeciesText(animal.species)}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-brand-dark mb-1">{animal.name}</h1>
            <p className="text-brand-dark/50">
              {animal.breed ?? 'Raza mixta'} · {getAgeText(animal.age_years, animal.age_months)}
            </p>
          </div>

          {/* Atributos */}
          <div className="card p-5 grid grid-cols-2 gap-4">
            {[
              ['Sexo', getGenderText(animal.gender)],
              ['Tamaño', getSizeText(animal.size)],
              ['Edad', getAgeText(animal.age_years, animal.age_months)],
              ['Especie', getSpeciesText(animal.species)],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-brand-dark/40 uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-brand-dark">{value}</p>
              </div>
            ))}
          </div>

          {/* Salud */}
          <div>
            <p className="text-xs text-brand-dark/40 uppercase tracking-wider mb-3">Estado de salud</p>
            <div className="flex flex-wrap gap-2">
              {animal.is_vaccinated && (
                <span className="badge bg-green/10 text-green py-1.5 text-sm">💉 Vacunado</span>
              )}
              {animal.is_sterilized && (
                <span className="badge bg-orange/10 text-orange-dark py-1.5 text-sm">✂️ Castrado</span>
              )}
              {animal.is_dewormed && (
                <span className="badge bg-cream-darker text-brand-dark/60 py-1.5 text-sm">🛡️ Desparasitado</span>
              )}
              {!animal.is_vaccinated && !animal.is_sterilized && !animal.is_dewormed && (
                <p className="text-sm text-brand-dark/40">Sin datos de salud registrados</p>
              )}
            </div>

            {animal.vaccines?.length > 0 && (
              <div className="card p-4 mt-4">
                <p className="text-xs text-brand-dark/40 uppercase tracking-wider mb-3">Vacunas aplicadas</p>
                <ul className="space-y-1.5">
                  {animal.vaccines.map((v, i) => (
                    <li key={i} className="flex justify-between text-sm">
                      <span className="text-brand-dark/80">{v.name}</span>
                      {v.date && <span className="text-brand-dark/40">{v.date}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {animal.diseases?.length > 0 && (
              <div className="card p-4 mt-3">
                <p className="text-xs text-brand-dark/40 uppercase tracking-wider mb-3">Condiciones / tratamientos</p>
                <ul className="space-y-1.5">
                  {animal.diseases.map((d, i) => (
                    <li key={i} className="flex justify-between text-sm">
                      <span className="text-brand-dark/80">{d.name}</span>
                      <span className="text-orange-dark">{d.status}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Rescatista */}
          <div className="card p-4">
            <p className="text-xs text-brand-dark/40 uppercase tracking-wider mb-1">Rescatado por</p>
            <p className="font-semibold text-brand-dark">{animal.rescuer_name}</p>
          </div>

          {/* WhatsApp */}
          <WhatsAppButton animal={animal} className="w-full justify-center text-base py-4" />

          <p className="text-xs text-center text-brand-dark/40">
            Al hacer clic vas a contactar directamente al rescatista por WhatsApp
          </p>
        </div>
      </div>
    </main>
  )
}
