'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { supabase, uploadMedia, getPublicUrl } from '@/lib/supabase'
import { compressImage, validateMediaFile, MAX_IMAGE_MB, MAX_VIDEO_MB } from '@/lib/media'
import { Species, Gender, Size } from '@/lib/types'

interface FormData {
  name: string
  species: Species
  breed: string
  age_years: number
  age_months: number
  gender: Gender
  size: Size
  is_vaccinated: boolean
  is_sterilized: boolean
  is_dewormed: boolean
  vaccines: string
  diseases: string
  rescuer_name: string
  rescuer_phone: string
  story: string
}

const defaultForm: FormData = {
  name: '',
  species: 'dog',
  breed: '',
  age_years: 0,
  age_months: 0,
  gender: 'male',
  size: 'medium',
  is_vaccinated: false,
  is_sterilized: false,
  is_dewormed: false,
  vaccines: '',
  diseases: '',
  rescuer_name: '',
  rescuer_phone: '',
  story: '',
}

const STEPS = [
  { n: 1, label: 'Datos básicos' },
  { n: 2, label: 'Salud' },
  { n: 3, label: 'Fotos' },
  { n: 4, label: 'Rescatista' },
]

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-brand-dark/70 mb-1.5">
      {children}
    </label>
  )
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-brand-dark/40 mt-1">{children}</p>
}

export default function AdminForm() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(defaultForm)
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [processingFiles, setProcessingFiles] = useState(false)

  const handleFilesSelected = async (fileList: FileList | null) => {
    const selected = Array.from(fileList ?? [])
    if (selected.length === 0) return

    setProcessingFiles(true)
    try {
      const processed: File[] = []
      for (const file of selected) {
        try {
          const compressed = file.type.startsWith('image/') ? await compressImage(file) : file
          const error = validateMediaFile(compressed)
          if (error) {
            toast.error(error)
            continue
          }
          processed.push(compressed)
        } catch (err) {
          console.error(err)
          toast.error(`${file.name}: no se pudo procesar el archivo`)
        }
      }
      setFiles((prev) => [...prev, ...processed])
    } finally {
      setProcessingFiles(false)
    }
  }

  const set = (field: keyof FormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async () => {
    if (!form.name || !form.rescuer_name || !form.rescuer_phone) {
      toast.error('Completá todos los campos obligatorios')
      return
    }

    setLoading(true)
    try {
      const vaccines = form.vaccines
        .split('\n')
        .filter(Boolean)
        .map((line) => {
          const [name, date] = line.split(',').map((s) => s.trim())
          return { name: name ?? line.trim(), date: date ?? '' }
        })

      const diseases = form.diseases
        .split('\n')
        .filter(Boolean)
        .map((line) => {
          const [name, status] = line.split(',').map((s) => s.trim())
          return { name: name ?? line.trim(), status: status ?? 'En tratamiento' }
        })

      const { data: animal, error: animalError } = await supabase
        .from('animals')
        .insert({
          name: form.name,
          species: form.species,
          breed: form.breed || null,
          age_years: form.age_years,
          age_months: form.age_months,
          gender: form.gender,
          size: form.size,
          is_vaccinated: form.is_vaccinated,
          is_sterilized: form.is_sterilized,
          is_dewormed: form.is_dewormed,
          vaccines,
          diseases,
          rescuer_name: form.rescuer_name,
          rescuer_phone: form.rescuer_phone,
          story: form.story || null,
          is_available: true,
        })
        .select()
        .single()

      if (animalError) throw animalError

      const failedUploads: string[] = []
      let uploadedCount = 0

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        try {
          const path = await uploadMedia(animal.id, file)
          const url = getPublicUrl(path)
          const { error: mediaError } = await supabase.from('animal_media').insert({
            animal_id: animal.id,
            url,
            type: file.type.startsWith('video/') ? 'video' : 'photo',
            is_primary: uploadedCount === 0,
            order_index: uploadedCount,
          })
          if (mediaError) throw mediaError
          uploadedCount++
        } catch (err) {
          console.error(err)
          failedUploads.push(file.name)
        }
      }

      if (failedUploads.length > 0) {
        toast.error(`No se pudieron subir: ${failedUploads.join(', ')}`)
      }
      toast.success(`¡${form.name} fue publicado! 🐾`)
      setForm(defaultForm)
      setFiles([])
      setStep(1)
    } catch (err) {
      console.error(err)
      const message = err instanceof Error ? err.message : 'Ocurrió un error. Intentá de nuevo.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* ── Stepper ── */}
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
                style={
                  step >= s.n
                    ? { backgroundColor: 'var(--orange)' }
                    : {}
                }
              >
                {step > s.n ? '✓' : s.n}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  step === s.n ? 'text-orange' : 'text-brand-dark/40'
                }`}
              >
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
        {/* ── Paso 1: Datos básicos ── */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="card p-6 space-y-5"
          >
            <div>
              <h2 className="text-xl font-bold text-brand-dark">Datos del animal</h2>
              <p className="text-sm text-brand-dark/50 mt-1">Información básica para el perfil de adopción</p>
            </div>

            <div>
              <Label>Nombre *</Label>
              <input
                className="input-field"
                placeholder="Ej: Firulais, Luna, Rocky..."
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
              />
            </div>

            <div>
              <Label>Su historia</Label>
              <textarea
                className="input-field min-h-[100px] resize-none"
                placeholder="¿De dónde fue rescatado? ¿Cómo llegó? Contá su historia para que los adoptantes lo conozcan mejor..."
                value={form.story}
                onChange={(e) => set('story', e.target.value)}
              />
              <Hint>Opcional, pero hace la diferencia</Hint>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Especie *</Label>
                <select
                  className="input-field"
                  value={form.species}
                  onChange={(e) => set('species', e.target.value as Species)}
                >
                  <option value="dog">🐶 Perro</option>
                  <option value="cat">🐱 Gato</option>
                </select>
              </div>
              <div>
                <Label>Sexo *</Label>
                <select
                  className="input-field"
                  value={form.gender}
                  onChange={(e) => set('gender', e.target.value as Gender)}
                >
                  <option value="male">Macho</option>
                  <option value="female">Hembra</option>
                </select>
              </div>
            </div>

            <div>
              <Label>Raza</Label>
              <input
                className="input-field"
                placeholder="Ej: Labrador, Mestizo..."
                value={form.breed}
                onChange={(e) => set('breed', e.target.value)}
              />
              <Hint>Dejá vacío si es de raza mixta</Hint>
            </div>

            <div>
              <Label>Edad</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="number" min={0} max={30}
                    className="input-field"
                    placeholder="0"
                    value={form.age_years}
                    onChange={(e) => set('age_years', Number(e.target.value))}
                  />
                  <Hint>Años</Hint>
                </div>
                <div>
                  <input
                    type="number" min={0} max={11}
                    className="input-field"
                    placeholder="0"
                    value={form.age_months}
                    onChange={(e) => set('age_months', Number(e.target.value))}
                  />
                  <Hint>Meses</Hint>
                </div>
              </div>
            </div>

            <div>
              <Label>Tamaño *</Label>
              <select
                className="input-field"
                value={form.size}
                onChange={(e) => set('size', e.target.value as Size)}
              >
                <option value="small">Pequeño (menos de 10 kg)</option>
                <option value="medium">Mediano (10 a 25 kg)</option>
                <option value="large">Grande (más de 25 kg)</option>
              </select>
            </div>

            <button className="btn-primary w-full justify-center" onClick={() => setStep(2)}>
              Siguiente →
            </button>
          </motion.div>
        )}

        {/* ── Paso 2: Salud ── */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="card p-6 space-y-5"
          >
            <div>
              <h2 className="text-xl font-bold text-brand-dark">Estado de salud</h2>
              <p className="text-sm text-brand-dark/50 mt-1">Información sanitaria del animal</p>
            </div>

            <div className="space-y-3">
              <Label>Condición sanitaria</Label>
              {([
                ['is_vaccinated', '💉 Vacunado/a'],
                ['is_sterilized', '✂️ Castrado/a o esterilizado/a'],
                ['is_dewormed', '🛡️ Desparasitado/a'],
              ] as [keyof FormData, string][]).map(([field, label]) => (
                <button
                  key={field}
                  type="button"
                  onClick={() => set(field, !form[field])}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                    form[field]
                      ? 'border-orange bg-orange/5'
                      : 'border-cream-darker bg-cream hover:border-orange/40'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center transition-all ${
                      form[field] ? 'bg-orange' : 'bg-cream-darker'
                    }`}
                  >
                    {form[field] && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  <span className={`text-sm font-medium ${form[field] ? 'text-brand-dark' : 'text-brand-dark/60'}`}>
                    {label}
                  </span>
                </button>
              ))}
            </div>

            <div>
              <Label>Vacunas aplicadas</Label>
              <textarea
                className="input-field min-h-[90px] resize-none"
                placeholder={'Antirrábica, 2024-03\nSéxtuple, 2024-03'}
                value={form.vaccines}
                onChange={(e) => set('vaccines', e.target.value)}
              />
              <Hint>Una por línea con el formato: Nombre de vacuna, Año-Mes</Hint>
            </div>

            <div>
              <Label>Enfermedades o condiciones especiales</Label>
              <textarea
                className="input-field min-h-[70px] resize-none"
                placeholder={'Ej: Leishmaniasis, En tratamiento'}
                value={form.diseases}
                onChange={(e) => set('diseases', e.target.value)}
              />
              <Hint>Una por línea con el formato: Nombre, Estado actual</Hint>
            </div>

            <div className="flex gap-3">
              <button className="btn-secondary flex-1 justify-center" onClick={() => setStep(1)}>← Atrás</button>
              <button className="btn-primary flex-1 justify-center" onClick={() => setStep(3)}>Siguiente →</button>
            </div>
          </motion.div>
        )}

        {/* ── Paso 3: Fotos ── */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="card p-6 space-y-5"
          >
            <div>
              <h2 className="text-xl font-bold text-brand-dark">Fotos y videos</h2>
              <p className="text-sm text-brand-dark/50 mt-1">Las fotos son lo que más atrae a los adoptantes</p>
            </div>

            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-cream-darker rounded-xl p-8 text-center hover:border-orange/50 hover:bg-orange/5 transition-all duration-200">
                <div className="text-4xl mb-3">📸</div>
                <p className="text-sm font-medium text-brand-dark/70 mb-1">
                  {processingFiles ? 'Procesando...' : 'Tocá para subir fotos'}
                </p>
                <p className="text-xs text-brand-dark/40">
                  Fotos: máx {MAX_IMAGE_MB}MB (se comprimen automáticamente) · Videos: máx {MAX_VIDEO_MB}MB
                </p>
              </div>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                multiple
                className="hidden"
                disabled={processingFiles}
                onChange={(e) => handleFilesSelected(e.target.files)}
              />
            </label>

            {files.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-brand-dark/50 uppercase tracking-wider">
                  {files.length} archivo{files.length > 1 ? 's' : ''} seleccionado{files.length > 1 ? 's' : ''}
                </p>
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 bg-cream rounded-xl px-4 py-2.5">
                    <span className="text-lg">{f.type.startsWith('video/') ? '🎥' : '🖼️'}</span>
                    <span className="text-sm text-brand-dark/70 truncate flex-1">{f.name}</span>
                    {i === 0 && (
                      <span className="badge-orange text-xs">Portada</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <button className="btn-secondary flex-1 justify-center" onClick={() => setStep(2)}>← Atrás</button>
              <button className="btn-primary flex-1 justify-center" onClick={() => setStep(4)}>Siguiente →</button>
            </div>
          </motion.div>
        )}

        {/* ── Paso 4: Rescatista ── */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="card p-6 space-y-5"
          >
            <div>
              <h2 className="text-xl font-bold text-brand-dark">Tus datos</h2>
              <p className="text-sm text-brand-dark/50 mt-1">Los adoptantes te van a contactar directamente</p>
            </div>

            <div>
              <Label>Tu nombre *</Label>
              <input
                className="input-field"
                placeholder="Ej: María García"
                value={form.rescuer_name}
                onChange={(e) => set('rescuer_name', e.target.value)}
              />
            </div>

            <div>
              <Label>Número de WhatsApp *</Label>
              <input
                className="input-field"
                placeholder="5491112345678"
                value={form.rescuer_phone}
                onChange={(e) => set('rescuer_phone', e.target.value)}
              />
              <Hint>Con código de país: 549 + código de área + número (sin 0 ni 15)</Hint>
            </div>

            <div className="p-4 bg-orange/5 border border-orange/20 rounded-xl">
              <p className="text-sm text-brand-dark/70">
                <span className="font-semibold text-orange">¿Todo listo?</span> Al publicar, el animal va a aparecer
                en la sección de adopción y los interesados te van a escribir por WhatsApp.
              </p>
            </div>

            <div className="flex gap-3">
              <button className="btn-secondary flex-1 justify-center" onClick={() => setStep(3)}>← Atrás</button>
              <button
                className="btn-primary flex-1 justify-center disabled:opacity-50"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Publicando...' : '🐾 Publicar animal'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
