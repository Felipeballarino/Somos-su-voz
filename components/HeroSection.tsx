'use client'

import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 px-4 dot-grid">
      {/* Blobs animados */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 opacity-20 animate-blob"
        style={{ background: 'radial-gradient(circle, #7C3AED, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 opacity-20 animate-blob"
        style={{ background: 'radial-gradient(circle, #EC4899, transparent 70%)', animationDelay: '4s' }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-10 animate-blob"
        style={{ background: 'radial-gradient(circle, #F97316, transparent 70%)', animationDelay: '2s' }}
      />

      {/* Partículas de patitas */}
      {['🐾', '🐾', '🐾', '🐾', '🐾'].map((paw, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl opacity-20 select-none pointer-events-none"
          style={{
            top: `${15 + i * 18}%`,
            left: `${8 + i * 20}%`,
          }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.6 }}
        >
          {paw}
        </motion.span>
      ))}

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="badge bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-6">
            🐾 Adopción responsable
          </span>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Encontrá tu{' '}
          <span className="gradient-text-brand">compañero</span>
          {' '}de vida
        </motion.h1>

        <motion.p
          className="text-lg text-white/60 max-w-xl mx-auto mb-10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Perros y gatos rescatados esperando un hogar. Conectate directo con el rescatista por WhatsApp.
        </motion.p>

        <motion.div
          className="flex gap-4 justify-center flex-wrap"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a href="#animales" className="btn-primary">
            Ver animales 🐶
          </a>
          <a href="/admin" className="btn-secondary">
            Soy rescatista
          </a>
        </motion.div>
      </div>
    </section>
  )
}
