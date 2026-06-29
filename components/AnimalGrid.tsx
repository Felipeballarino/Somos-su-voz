'use client'

import { AnimatePresence, motion } from 'framer-motion'
import AnimalCard from './AnimalCard'
import { Animal } from '@/lib/types'

interface AnimalGridProps {
  animals: Animal[]
}

export default function AnimalGrid({ animals }: AnimalGridProps) {
  if (animals.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-24"
      >
        <div className="text-6xl mb-4">🐾</div>
        <h3 className="text-xl font-semibold text-white/60 mb-2">No hay animales disponibles</h3>
        <p className="text-white/30 text-sm">Volvé pronto, siempre hay nuevos rescates</p>
      </motion.div>
    )
  }

  return (
    <AnimatePresence mode="popLayout">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {animals.map((animal, i) => (
          <AnimalCard key={animal.id} animal={animal} index={i} />
        ))}
      </div>
    </AnimatePresence>
  )
}
