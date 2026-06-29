'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Animal, getAgeText, getGenderText, getSizeText, getPrimaryPhoto } from '@/lib/types'

interface AnimalCardProps {
  animal: Animal
  index?: number
}

export default function AnimalCard({ animal, index = 0 }: AnimalCardProps) {
  const photo = getPrimaryPhoto(animal)
  const age = getAgeText(animal.age_years, animal.age_months)

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Link href={`/animals/${animal.id}`} className="block group">
        <div className="glass glow-card overflow-hidden">
          {/* Foto */}
          <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
            {photo ? (
              <Image
                src={photo}
                alt={animal.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl opacity-20">
                {animal.species === 'dog' ? '🐶' : '🐱'}
              </div>
            )}

            {/* Badge especie */}
            <div className="absolute top-3 left-3">
              <span className="badge bg-black/50 backdrop-blur-sm text-white border border-white/10">
                {animal.species === 'dog' ? '🐶 Perro' : '🐱 Gato'}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <h3 className="text-lg font-bold text-white mb-1 group-hover:gradient-text transition-all">
              {animal.name}
            </h3>

            <p className="text-sm text-white/50 mb-3">
              {animal.breed ?? 'Raza mixta'} · {age} · {getGenderText(animal.gender)} · {getSizeText(animal.size)}
            </p>

            {/* Badges de salud */}
            <div className="flex flex-wrap gap-1.5">
              {animal.is_vaccinated && (
                <span className="badge bg-green-500/15 text-green-400 border border-green-500/20">
                  💉 Vacunado
                </span>
              )}
              {animal.is_sterilized && (
                <span className="badge bg-blue-500/15 text-blue-400 border border-blue-500/20">
                  ✂️ Castrado
                </span>
              )}
              {animal.is_dewormed && (
                <span className="badge bg-yellow-500/15 text-yellow-400 border border-yellow-500/20">
                  🛡️ Desparasitado
                </span>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-white/40">Por {animal.rescuer_name}</span>
              <span className="text-xs text-purple-400 font-medium group-hover:text-pink-400 transition-colors">
                Ver más →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
