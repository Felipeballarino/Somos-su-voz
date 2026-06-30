'use client'

import { useState } from 'react'
import { AnimalMedia, Species } from '@/lib/types'

interface AnimalGalleryProps {
  media: AnimalMedia[]
  animalName: string
  species: Species
}

export default function AnimalGallery({ media, animalName, species }: AnimalGalleryProps) {
  const [selected, setSelected] = useState(0)
  const current = media[selected]

  if (media.length === 0) {
    return (
      <div className="aspect-square rounded-2xl overflow-hidden bg-cream-dark flex items-center justify-center text-8xl opacity-20">
        {species === 'dog' ? '🐶' : '🐱'}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="aspect-square rounded-2xl overflow-hidden bg-cream-dark">
        {current.type === 'photo' ? (
          <img src={current.url} alt={animalName} className="w-full h-full object-cover" />
        ) : (
          <video src={current.url} controls className="w-full h-full object-contain" />
        )}
      </div>

      {media.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {media.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(i)}
              className={`relative aspect-square rounded-xl overflow-hidden bg-cream-dark transition-all ${
                i === selected ? 'ring-2 ring-orange' : 'opacity-80 hover:opacity-100'
              }`}
            >
              {item.type === 'photo' ? (
                <img src={item.url} alt={animalName} className="w-full h-full object-cover" />
              ) : (
                <>
                  <video src={item.url} className="w-full h-full object-cover" />
                  <span className="absolute inset-0 flex items-center justify-center text-2xl bg-black/20">▶️</span>
                </>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
