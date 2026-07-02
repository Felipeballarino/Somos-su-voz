'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type YesNo = 'si' | 'no' | ''

interface FormData {
  species: 'dog' | 'cat' | ''
  contact_name: string
  contact_phone: string
  age: string
  social_media: string
  address: string
  locality: string
  location_type: 'casa' | 'depto' | ''
  depto_allows_pets: YesNo
  outdoor_spaces: string[]
  has_balcony_protection: YesNo
  has_other_pets: YesNo
  has_vif_animal: YesNo
  has_fostered_before: YesNo
  can_foster_sick: YesNo
  animal_preferences: string
  specific_animal: string
  hours_alone_per_day: string
  max_transit_time: string
  available_from: string
  household_agreement: YesNo
  has_mobility: YesNo
  accepts_whatsapp_group: YesNo
  notes: string
}

const defaultForm: FormData = {
  species: '',
  contact_name: '',
  contact_phone: '',
  age: '',
  social_media: '',
  address: '',
  locality: '',
  location_type: '',
  depto_allows_pets: '',
  outdoor_spaces: [],
  has_balcony_protection: '',
  has_other_pets: '',
  has_vif_animal: '',
  has_fostered_before: '',
  can_foster_sick: '',
  animal_preferences: '',
  specific_animal: '',
  hours_alone_per_day: '',
  max_transit_time: '',
  available_from: '',
  household_agreement: '',
  has_mobility: '',
  accepts_whatsapp_group: '',
  notes: '',
}

const yesNo = (val: YesNo): boolean | null => val === '' ? null : val === 'si'

const STEPS = [
  { n: 1, label: 'Tus datos' },
  { n: 2, label: 'Tu hogar' },
  { n: 3, label: 'El tránsito' },
]

const OUTDOOR_OPTIONS = ['Patio', 'Balcón', 'Terraza']

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-brand-dark mb-1.5">
      {children}
      {required && <span className="text-orange ml-0.5">*</span>}
    </label>
  )
}

function RadioGroup({
  label, name, value, onChange, required,
}: {
  label: string
  name: string
  value: YesNo
  onChange: (v: YesNo) => void
  required?: boolean
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <div className="flex gap-6 mt-1">
        {(['si', 'no'] as YesNo[]).map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
              className="accent-orange w-4 h-4"
            />
            <span className="text-sm text-brand-dark">{opt === 'si' ? 'Sí' : 'No'}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

function Success() {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-6">🐾</div>
      <h2 className="text-3xl font-bold text-brand-dark mb-4">¡Gracias por tu generosidad!</h2>
      <p className="text-brand-dark/60 max-w-md mx-auto mb-8">
        Recibimos tu solicitud para ser hogar de tránsito. Vamos a revisar los datos
        y nos ponemos en contacto a la brevedad.
      </p>
      <Link href="/" className="btn-secondary">
        Volver al inicio
      </Link>
    </div>
  )
}

export default function TransitoPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(defaultForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const set = (field: keyof FormData, value: unknown) =>
    setForm((f) => ({ ...f, [field]: value }))

  const toggleOutdoor = (val: string) => {
    setForm((f) => ({
      ...f,
      outdoor_spaces: f.outdoor_spaces.includes(val)
        ? f.outdoor_spaces.filter((v) => v !== val)
        : [...f.outdoor_spaces, val],
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    const { error: err } = await supabase.from('foster_requests').insert([{
      species:               form.species || null,
      contact_name:          form.contact_name,
      contact_phone:         form.contact_phone,
      age:                   form.age || null,
      social_media:          form.social_media || null,
      address:               form.address,
      locality:              form.locality || null,
      location_type:         form.location_type || null,
      depto_allows_pets:     yesNo(form.depto_allows_pets),
      outdoor_spaces:        form.outdoor_spaces.length > 0 ? form.outdoor_spaces : null,
      has_balcony_protection: yesNo(form.has_balcony_protection),
      has_other_pets:        yesNo(form.has_other_pets) ?? false,
      has_vif_animal:        yesNo(form.has_vif_animal),
      has_fostered_before:   yesNo(form.has_fostered_before),
      can_foster_sick:       yesNo(form.can_foster_sick),
      animal_preferences:    form.animal_preferences || null,
      specific_animal:       form.specific_animal || null,
      hours_alone_per_day:   form.hours_alone_per_day || null,
      max_transit_time:      form.max_transit_time || null,
      available_from:        form.available_from || null,
      household_agreement:   yesNo(form.household_agreement),
      has_mobility:          yesNo(form.has_mobility),
      accepts_whatsapp_group: yesNo(form.accepts_whatsapp_group),
      notes:                 form.notes || null,
      // Columnas legacy con NOT NULL default en DB
      has_outdoor_space:     form.outdoor_spaces.length > 0,
      availability:          form.available_from || 'Sin especificar',
      status:                'pending',
    }])

    if (err) {
      setError('Hubo un error al enviar. Intentá de nuevo.')
      setLoading(false)
      return
    }
    setDone(true)
    setLoading(false)
  }

  if (done) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16">
        <Success />
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <Link href="/ayudar" className="text-sm text-brand-dark/40 hover:text-brand-dark mb-4 inline-block">
          ← Volver
        </Link>
        <h1 className="text-3xl font-bold text-brand-dark mb-2">Ser hogar de tránsito</h1>
        <p className="text-brand-dark/60">
          Completá el formulario y nos ponemos en contacto a la brevedad.
        </p>
      </div>

      {/* Info importante */}
      <div className="bg-orange/5 border border-orange/20 rounded-2xl p-5 mb-10 text-sm text-brand-dark/70 space-y-2">
        <p className="font-semibold text-brand-dark">📋 Antes de empezar</p>
        <p>• Ser hogar de tránsito <strong>no implica</strong> quedarse con el animal. Las adopciones las coordina Somos Su Voz.</p>
        <p>• La organización cubre los <strong>gastos básicos</strong> del animal (alimento y veterinaria esencial).</p>
        <p>• El animal <strong>no puede ser entregado a nadie</strong> sin autorización de la organización.</p>
        <p>• Si surgiera algún problema o cambio, avisanos con al menos <strong>48 hs de anticipación</strong>.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center mb-10">
        {STEPS.map((s, i) => (
          <div key={s.n} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step > s.n
                    ? 'text-white'
                    : step === s.n
                    ? 'text-white ring-4 ring-orange/20'
                    : 'bg-cream-dark text-brand-dark/30'
                }`}
                style={step >= s.n ? { backgroundColor: 'var(--orange)' } : {}}
              >
                {step > s.n ? '✓' : s.n}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${step === s.n ? 'text-orange' : 'text-brand-dark/40'}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="flex-1 h-0.5 mx-2 mb-4 transition-all duration-300"
                style={{ backgroundColor: step > s.n ? 'var(--orange)' : '#DDD3BB' }}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── Paso 1: Tus datos ── */}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="card p-6 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-brand-dark">Tus datos</h2>
                <p className="text-sm text-brand-dark/50 mt-1">Información de contacto para comunicarnos con vos</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label required>Nombre y apellido</Label>
                  <input
                    className="input-field"
                    placeholder="Tu nombre completo"
                    value={form.contact_name}
                    onChange={(e) => set('contact_name', e.target.value)}
                  />
                </div>
                <div>
                  <Label required>Celular / WhatsApp</Label>
                  <input
                    className="input-field"
                    placeholder="Ej: 353 412-3456"
                    value={form.contact_phone}
                    onChange={(e) => set('contact_phone', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Edad</Label>
                  <input
                    className="input-field"
                    placeholder="Tu edad"
                    value={form.age}
                    onChange={(e) => set('age', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Instagram o Facebook</Label>
                  <input
                    className="input-field"
                    placeholder="@usuario"
                    value={form.social_media}
                    onChange={(e) => set('social_media', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label required>Domicilio completo</Label>
                <input
                  className="input-field"
                  placeholder="Calle, número, piso/depto si aplica"
                  value={form.address}
                  onChange={(e) => set('address', e.target.value)}
                />
              </div>

              <div>
                <Label required>Localidad</Label>
                <input
                  className="input-field"
                  placeholder="Ej: Villa María, Villa Nueva..."
                  value={form.locality}
                  onChange={(e) => set('locality', e.target.value)}
                />
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <button
                onClick={() => {
                  if (!form.contact_name || !form.contact_phone || !form.address || !form.locality) {
                    setError('Completá los campos obligatorios para continuar.')
                    return
                  }
                  setError('')
                  setStep(2)
                }}
                className="btn-primary w-full"
              >
                Continuar →
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Paso 2: Tu hogar ── */}
        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="card p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-brand-dark">Tu hogar</h2>
                <p className="text-sm text-brand-dark/50 mt-1">Información sobre el espacio donde viviría el animal</p>
              </div>

              <div>
                <Label required>Tipo de vivienda</Label>
                <div className="flex gap-6 mt-1">
                  {(['casa', 'depto'] as const).map((opt) => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="location_type"
                        value={opt}
                        checked={form.location_type === opt}
                        onChange={() => set('location_type', opt)}
                        className="accent-orange w-4 h-4"
                      />
                      <span className="text-sm text-brand-dark">
                        {opt === 'casa' ? 'Casa' : 'Departamento'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {form.location_type === 'depto' && (
                <RadioGroup
                  label="¿En el departamento permiten mascotas?"
                  name="depto_allows_pets"
                  value={form.depto_allows_pets}
                  onChange={(v) => set('depto_allows_pets', v)}
                  required
                />
              )}

              <div>
                <Label>¿Tenés patio, balcón o terraza?</Label>
                <div className="flex flex-wrap gap-5 mt-1">
                  {OUTDOOR_OPTIONS.map((opt) => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.outdoor_spaces.includes(opt)}
                        onChange={() => toggleOutdoor(opt)}
                        className="accent-orange w-4 h-4"
                      />
                      <span className="text-sm text-brand-dark">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {form.outdoor_spaces.length > 0 && (
                <RadioGroup
                  label="¿Tenés protección en balcones y ventanas?"
                  name="has_balcony_protection"
                  value={form.has_balcony_protection}
                  onChange={(v) => set('has_balcony_protection', v)}
                />
              )}

              <RadioGroup
                label="¿Tenés otros animales en casa?"
                name="has_other_pets"
                value={form.has_other_pets}
                onChange={(v) => set('has_other_pets', v)}
                required
              />

              <RadioGroup
                label="¿Algún animal en casa tiene VIF o VILEF?"
                name="has_vif_animal"
                value={form.has_vif_animal}
                onChange={(v) => set('has_vif_animal', v)}
              />

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button onClick={() => { setError(''); setStep(1) }} className="btn-secondary flex-1">
                  ← Atrás
                </button>
                <button
                  onClick={() => {
                    if (!form.location_type || !form.has_other_pets) {
                      setError('Completá los campos obligatorios para continuar.')
                      return
                    }
                    setError('')
                    setStep(3)
                  }}
                  className="btn-primary flex-1"
                >
                  Continuar →
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Paso 3: El tránsito ── */}
        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="card p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-brand-dark">El tránsito</h2>
                <p className="text-sm text-brand-dark/50 mt-1">Preferencias y disponibilidad para el animal</p>
              </div>

              <div>
                <Label required>¿Para qué especie querés ser provisorio?</Label>
                <div className="flex gap-6 mt-1">
                  {(['dog', 'cat'] as const).map((s) => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="species"
                        value={s}
                        checked={form.species === s}
                        onChange={() => set('species', s)}
                        className="accent-orange w-4 h-4"
                      />
                      <span className="text-sm text-brand-dark">
                        {s === 'dog' ? '🐶 Perros' : '🐱 Gatos'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <RadioGroup
                label="¿Fuiste hogar de tránsito alguna vez?"
                name="has_fostered_before"
                value={form.has_fostered_before}
                onChange={(v) => set('has_fostered_before', v)}
              />

              <RadioGroup
                label="¿Podrías transitar un animal enfermo o en recuperación?"
                name="can_foster_sick"
                value={form.can_foster_sick}
                onChange={(v) => set('can_foster_sick', v)}
              />

              <div>
                <Label>Preferencias del animal (tamaño, edad, sexo, etc.)</Label>
                <textarea
                  className="input-field"
                  rows={2}
                  placeholder="Ej: Cachorro pequeño, cualquier sexo, no muy activo..."
                  value={form.animal_preferences}
                  onChange={(e) => set('animal_preferences', e.target.value)}
                />
              </div>

              <div>
                <Label>¿Hay algún animal que viste en redes y te interesa puntualmente?</Label>
                <input
                  className="input-field"
                  placeholder="Nombre o descripción del animal. Si no hay ninguno en particular, escribí N/A."
                  value={form.specific_animal}
                  onChange={(e) => set('specific_animal', e.target.value)}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label required>¿Cuántas horas estaría solo por día?</Label>
                  <input
                    className="input-field"
                    placeholder="Ej: 4-6 horas"
                    value={form.hours_alone_per_day}
                    onChange={(e) => set('hours_alone_per_day', e.target.value)}
                  />
                </div>
                <div>
                  <Label required>Tiempo máximo de tránsito</Label>
                  <input
                    className="input-field"
                    placeholder="Ej: 2 semanas, hasta adopción"
                    value={form.max_transit_time}
                    onChange={(e) => set('max_transit_time', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label required>¿Desde cuándo podés recibir un animal?</Label>
                <input
                  className="input-field"
                  placeholder="Ej: A partir del 15 de enero"
                  value={form.available_from}
                  onChange={(e) => set('available_from', e.target.value)}
                />
              </div>

              <RadioGroup
                label="¿Todos los que habitan en el hogar están de acuerdo?"
                name="household_agreement"
                value={form.household_agreement}
                onChange={(v) => set('household_agreement', v)}
                required
              />

              <RadioGroup
                label="¿Tenés movilidad propia?"
                name="has_mobility"
                value={form.has_mobility}
                onChange={(v) => set('has_mobility', v)}
              />

              <RadioGroup
                label="¿Aceptás ser agregado a nuestro grupo de WhatsApp?"
                name="accepts_whatsapp_group"
                value={form.accepts_whatsapp_group}
                onChange={(v) => set('accepts_whatsapp_group', v)}
              />

              <div>
                <Label>Comentarios adicionales</Label>
                <textarea
                  className="input-field"
                  rows={3}
                  placeholder="Cualquier cosa que quieras agregar..."
                  value={form.notes}
                  onChange={(e) => set('notes', e.target.value)}
                />
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button onClick={() => { setError(''); setStep(2) }} className="btn-secondary flex-1">
                  ← Atrás
                </button>
                <button
                  onClick={() => {
                    if (!form.species || !form.hours_alone_per_day || !form.max_transit_time || !form.available_from || !form.household_agreement) {
                      setError('Completá los campos obligatorios para enviar.')
                      return
                    }
                    handleSubmit()
                  }}
                  disabled={loading}
                  className="btn-primary flex-1 disabled:opacity-60"
                >
                  {loading ? 'Enviando...' : 'Enviar solicitud ✓'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  )
}
