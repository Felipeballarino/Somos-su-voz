'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Animal, getAgeText, getPrimaryPhoto, getSpeciesText } from '@/lib/types'
import AdminEditAnimal from './AdminEditAnimal'

export default function AdminAnimalList() {
  const [animals, setAnimals] = useState<Animal[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Animal | null>(null)
  const [query, setQuery] = useState('')

  const loadAnimals = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('animals')
      .select('*, media:animal_media(*)')
      .order('created_at', { ascending: false })
    setAnimals((data ?? []) as Animal[])
    setLoading(false)
  }

  useEffect(() => {
    loadAnimals()
  }, [])

  if (editing) {
    return (
      <AdminEditAnimal
        animal={editing}
        onBack={() => setEditing(null)}
        onSaved={() => {
          setEditing(null)
          loadAnimals()
        }}
      />
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (animals.length === 0) {
    return <p className="text-center text-brand-dark/50 py-12">Todavía no cargaste ningún animal.</p>
  }

  const filtered = animals.filter((a) =>
    a.name.toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <input
        type="text"
        className="input-field"
        placeholder="Buscar por nombre..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {filtered.length === 0 ? (
        <p className="text-center text-brand-dark/50 py-8">No encontramos animales con ese nombre.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((animal) => {
            const photo = getPrimaryPhoto(animal)
            return (
              <button
                key={animal.id}
                onClick={() => setEditing(animal)}
                className="w-full card p-4 flex items-center gap-4 text-left hover:border-orange/40 transition-colors"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-cream flex-shrink-0 flex items-center justify-center text-2xl">
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photo} alt={animal.name} className="w-full h-full object-cover" />
                  ) : (
                    animal.species === 'dog' ? '🐶' : '🐱'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-brand-dark truncate">{animal.name}</p>
                  <p className="text-sm text-brand-dark/50">
                    {getSpeciesText(animal.species)} · {getAgeText(animal.age_years, animal.age_months)}
                  </p>
                </div>
                <span
                  className={`badge text-xs flex-shrink-0 ${
                    animal.is_available ? 'bg-green-500/10 text-green-600' : 'bg-cream-darker text-brand-dark/50'
                  }`}
                >
                  {animal.is_available ? 'Disponible' : 'No disponible'}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
