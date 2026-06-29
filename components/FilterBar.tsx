'use client'

import { motion } from 'framer-motion'
import { Species } from '@/lib/types'

type Filter = 'all' | Species

interface FilterBarProps {
  current: Filter
  onChange: (f: Filter) => void
  counts: { all: number; dog: number; cat: number }
}

const tabs: { id: Filter; label: string; emoji: string }[] = [
  { id: 'all', label: 'Todos', emoji: '🐾' },
  { id: 'dog', label: 'Perros', emoji: '🐶' },
  { id: 'cat', label: 'Gatos', emoji: '🐱' },
]

export default function FilterBar({ current, onChange, counts }: FilterBarProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="glass p-1.5 flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="relative px-5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 z-10"
            style={{ color: current === tab.id ? '#fff' : 'rgba(255,255,255,0.5)' }}
          >
            {current === tab.id && (
              <motion.div
                layoutId="filter-pill"
                className="absolute inset-0 rounded-xl"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}
                transition={{ type: 'spring', bounce: 0.25, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">
              {tab.emoji} {tab.label}{' '}
              <span className="opacity-60 text-xs">
                ({counts[tab.id]})
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
