'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Animal, Species, getPrimaryPhoto, getAgeText, getSizeText } from '@/lib/types'

type Tab = Species

export default function AdopcionPage() {
  const [animals, setAnimals] = useState<Animal[]>([])
  const [tab, setTab] = useState<Tab>('dog')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('animals')
        .select('*, media:animal_media(*)')
        .eq('is_available', true)
        .order('created_at', { ascending: false })
      setAnimals((data as Animal[]) ?? [])
      setLoading(false)
    }
    fetch()
  }, [])

  const filtered = animals.filter((a) => a.species === tab)
  const dogs = animals.filter((a) => a.species === 'dog')
  const cats = animals.filter((a) => a.species === 'cat')

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-orange font-semibold text-sm uppercase tracking-widest mb-3">
          Adopción responsable
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">
          Encontrá tu compañero
        </h1>
        <p className="text-brand-dark/60 text-lg max-w-xl mx-auto">
          Todos fueron rescatados. Todos esperan una familia. ¿Podría ser la tuya?
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex p-1.5 rounded-2xl gap-2" style={{ background: 'var(--cream-dark)' }}>
          <button
            onClick={() => setTab('dog')}
            className={tab === 'dog' ? 'tab-active' : 'tab-inactive'}
          >
            🐶 Perros
            {!loading && (
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${tab === 'dog' ? 'bg-white/20' : 'bg-cream-darker text-brand-dark/50'}`}>
                {dogs.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('cat')}
            className={tab === 'cat' ? 'tab-active' : 'tab-inactive'}
          >
            🐱 Gatos
            {!loading && (
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${tab === 'cat' ? 'bg-white/20' : 'bg-cream-darker text-brand-dark/50'}`}>
                {cats.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-[4/3] bg-cream-dark rounded-t-2xl" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-cream-dark rounded w-2/3" />
                <div className="h-3 bg-cream-dark rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">{tab === 'dog' ? '🐶' : '🐱'}</div>
          <h3 className="text-xl font-semibold text-brand-dark/60 mb-2">
            No hay {tab === 'dog' ? 'perros' : 'gatos'} disponibles ahora
          </h3>
          <p className="text-brand-dark/40 text-sm mb-6">
            Seguinos en Instagram para enterarte de los nuevos rescates
          </p>
          <a
            href="https://www.instagram.com/somos.su.voz.vmvn/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Ver Instagram
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((animal) => {
            const photo = getPrimaryPhoto(animal)
            return (
              <Link
                key={animal.id}
                href={`/adopcion/${animal.id}`}
                className="card-hover block group overflow-hidden"
              >
                {/* Foto */}
                <div className="aspect-[4/3] bg-cream-dark overflow-hidden rounded-t-2xl">
                  {photo ? (
                    <img
                      src={photo}
                      alt={animal.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl opacity-20">
                      {animal.species === 'dog' ? '🐶' : '🐱'}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-brand-dark mb-1">{animal.name}</h3>
                  <p className="text-sm text-brand-dark/50 mb-3">
                    {animal.breed ?? 'Raza mixta'} · {getAgeText(animal.age_years, animal.age_months)} · {getSizeText(animal.size)}
                  </p>

                  {/* Badges salud */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {animal.is_vaccinated && (
                      <span className="badge bg-green/10 text-green text-xs">💉 Vacunado</span>
                    )}
                    {animal.is_sterilized && (
                      <span className="badge bg-orange/10 text-orange-dark text-xs">✂️ Castrado</span>
                    )}
                    {animal.is_dewormed && (
                      <span className="badge bg-cream-darker text-brand-dark/60 text-xs">🛡️ Desparasitado</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-brand-dark/40">Por {animal.rescuer_name}</span>
                    <span className="text-xs font-semibold" style={{ color: 'var(--orange)' }}>
                      Ver más →
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
