export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Animal, getAgeText, getGenderText, getSizeText, getSpeciesText } from '@/lib/types'
import WhatsAppButton from '@/components/WhatsAppButton'

interface PageProps {
  params: { id: string }
}

export default async function AnimalPage({ params }: PageProps) {
  const { data } = await supabase
    .from('animals')
    .select('*, media:animal_media(*)')
    .eq('id', params.id)
    .eq('is_available', true)
    .single()

  if (!data) notFound()

  const animal = data as Animal
  const photos = animal.media?.filter((m) => m.type === 'photo').sort((a, b) => a.order_index - b.order_index) ?? []
  const primaryPhoto = photos.find((m) => m.is_primary) ?? photos[0]

  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Link href="/" className="text-white/40 hover:text-white/70 text-sm transition-colors mb-6 inline-block">
          ← Volver a todos los animales
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Galería */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/5">
              {primaryPhoto ? (
                <Image
                  src={primaryPhoto.url}
                  alt={animal.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
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
                  <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden bg-white/5">
                    <Image
                      src={photo.url}
                      alt={animal.name}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="badge bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {getSpeciesText(animal.species)}
                </span>
              </div>
              <h1 className="text-4xl font-bold gradient-text mb-1">{animal.name}</h1>
              <p className="text-white/50">
                {animal.breed ?? 'Raza mixta'} · {getAgeText(animal.age_years, animal.age_months)}
              </p>
            </div>

            {/* Atributos */}
            <div className="glass p-4 grid grid-cols-2 gap-3">
              {[
                ['Sexo', getGenderText(animal.gender)],
                ['Tamaño', getSizeText(animal.size)],
                ['Edad', getAgeText(animal.age_years, animal.age_months)],
                ['Especie', getSpeciesText(animal.species)],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-white/40 mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-white">{value}</p>
                </div>
              ))}
            </div>

            {/* Salud */}
            <div>
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Estado de salud</h3>
              <div className="flex flex-wrap gap-2">
                {animal.is_vaccinated && (
                  <span className="badge bg-green-500/15 text-green-400 border border-green-500/20 py-1.5">
                    💉 Vacunado
                  </span>
                )}
                {animal.is_sterilized && (
                  <span className="badge bg-blue-500/15 text-blue-400 border border-blue-500/20 py-1.5">
                    ✂️ Castrado
                  </span>
                )}
                {animal.is_dewormed && (
                  <span className="badge bg-yellow-500/15 text-yellow-400 border border-yellow-500/20 py-1.5">
                    🛡️ Desparasitado
                  </span>
                )}
              </div>

              {animal.vaccines?.length > 0 && (
                <div className="mt-4 glass p-4">
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Vacunas aplicadas</p>
                  <ul className="space-y-1">
                    {animal.vaccines.map((v, i) => (
                      <li key={i} className="text-sm text-white/70 flex justify-between">
                        <span>{v.name}</span>
                        {v.date && <span className="text-white/30">{v.date}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {animal.diseases?.length > 0 && (
                <div className="mt-3 glass p-4">
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Enfermedades / condiciones</p>
                  <ul className="space-y-1">
                    {animal.diseases.map((d, i) => (
                      <li key={i} className="text-sm text-white/70 flex justify-between">
                        <span>{d.name}</span>
                        <span className="text-orange-400/70">{d.status}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Rescatista */}
            <div className="glass p-4">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Rescatado por</p>
              <p className="text-white font-medium">{animal.rescuer_name}</p>
            </div>

            <WhatsAppButton animal={animal} className="w-full justify-center" />
          </div>
        </div>
      </div>
    </main>
  )
}
