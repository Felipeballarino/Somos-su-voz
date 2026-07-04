'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { supabase, uploadMedia, getPublicUrl, deleteMediaFile } from '@/lib/supabase'
import { Animal, AnimalMedia, getAgeText, getSpeciesText } from '@/lib/types'

interface AdminEditAnimalProps {
  animal: Animal
  onBack: () => void
  onSaved: () => void
}

export default function AdminEditAnimal({ animal, onBack, onSaved }: AdminEditAnimalProps) {
  const [isAvailable, setIsAvailable] = useState(animal.is_available)
  const [media, setMedia] = useState<AnimalMedia[]>(
    [...(animal.media ?? [])].sort((a, b) => a.order_index - b.order_index)
  )
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [saving, setSaving] = useState(false)

  const handleSetPrimary = async (mediaId: string) => {
    setMedia((prev) => prev.map((m) => ({ ...m, is_primary: m.id === mediaId })))
    await supabase.from('animal_media').update({ is_primary: false }).eq('animal_id', animal.id)
    await supabase.from('animal_media').update({ is_primary: true }).eq('id', mediaId)
  }

  const handleDeletePhoto = async (item: AnimalMedia) => {
    setMedia((prev) => prev.filter((m) => m.id !== item.id))
    await supabase.from('animal_media').delete().eq('id', item.id)
    await deleteMediaFile(item.url)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error: updateError } = await supabase
        .from('animals')
        .update({ is_available: isAvailable })
        .eq('id', animal.id)
      if (updateError) throw updateError

      const startIndex = media.length
      for (let i = 0; i < newFiles.length; i++) {
        const file = newFiles[i]
        const path = await uploadMedia(animal.id, file)
        const url = getPublicUrl(path)
        const { error: mediaError } = await supabase.from('animal_media').insert({
          animal_id: animal.id,
          url,
          type: file.type.startsWith('video/') ? 'video' : 'photo',
          is_primary: media.every((m) => !m.is_primary) && i === 0,
          order_index: startIndex + i,
        })
        if (mediaError) throw mediaError
      }

      toast.success('Cambios guardados')
      setNewFiles([])
      onSaved()
    } catch (err) {
      console.error(err)
      const message = err instanceof Error ? err.message : 'Ocurrió un error al guardar'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card p-6 space-y-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-dark">{animal.name}</h2>
          <p className="text-sm text-brand-dark/50 mt-1">
            {getSpeciesText(animal.species)} · {getAgeText(animal.age_years, animal.age_months)}
          </p>
        </div>
        <button onClick={onBack} className="text-sm text-brand-dark/50 hover:text-brand-dark transition-colors">
          ← Volver
        </button>
      </div>

      {/* Estado */}
      <div>
        <label className="block text-sm font-medium text-brand-dark/70 mb-1.5">Estado</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setIsAvailable(true)}
            className={`p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
              isAvailable ? 'border-orange bg-orange/5 text-brand-dark' : 'border-cream-darker bg-cream text-brand-dark/50'
            }`}
          >
            🐾 Disponible
          </button>
          <button
            type="button"
            onClick={() => setIsAvailable(false)}
            className={`p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
              !isAvailable ? 'border-orange bg-orange/5 text-brand-dark' : 'border-cream-darker bg-cream text-brand-dark/50'
            }`}
          >
            ✅ Adoptado
          </button>
        </div>
        <p className="text-xs text-brand-dark/40 mt-1">
          Si no está disponible, deja de aparecer en el listado público.
        </p>
      </div>

      {/* Fotos existentes */}
      <div>
        <label className="block text-sm font-medium text-brand-dark/70 mb-1.5">Fotos y videos</label>
        {media.length === 0 ? (
          <p className="text-sm text-brand-dark/40">Este animal no tiene fotos cargadas.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {media.map((item) => (
              <div key={item.id} className="relative group rounded-xl overflow-hidden border border-cream-darker">
                {item.type === 'photo' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt="" className="w-full aspect-square object-cover" />
                ) : (
                  <div className="w-full aspect-square flex items-center justify-center bg-cream text-2xl">🎥</div>
                )}
                {item.is_primary && (
                  <span className="absolute top-1 left-1 badge-orange text-xs">Portada</span>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                  {!item.is_primary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(item.id)}
                      className="text-xs text-white bg-white/20 px-2 py-1 rounded-lg hover:bg-white/30"
                    >
                      Hacer portada
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(item)}
                    className="text-xs text-white bg-red-500/70 px-2 py-1 rounded-lg hover:bg-red-500/90"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Agregar fotos */}
      <div>
        <label className="block cursor-pointer">
          <div className="border-2 border-dashed border-cream-darker rounded-xl p-5 text-center hover:border-orange/50 hover:bg-orange/5 transition-all duration-200">
            <p className="text-sm font-medium text-brand-dark/70">📸 Agregar fotos o videos</p>
            <p className="text-xs text-brand-dark/40 mt-1">Podés elegir varios archivos a la vez, y agregar más en varias tandas</p>
          </div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
            multiple
            className="hidden"
            onChange={(e) => {
              const picked = Array.from(e.target.files ?? [])
              setNewFiles((prev) => [...prev, ...picked])
              e.target.value = ''
            }}
          />
        </label>
        {newFiles.length > 0 && (
          <div className="space-y-2 mt-3">
            {newFiles.map((file, i) => (
              <div key={`${file.name}-${i}`} className="flex items-center gap-3 bg-cream rounded-xl px-4 py-2.5">
                <span className="text-lg">{file.type.startsWith('video/') ? '🎥' : '🖼️'}</span>
                <span className="text-sm text-brand-dark/70 truncate flex-1">{file.name}</span>
                <button
                  type="button"
                  onClick={() => setNewFiles((prev) => prev.filter((_, idx) => idx !== i))}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button className="btn-secondary flex-1 justify-center" onClick={onBack}>
          Cancelar
        </button>
        <button
          className="btn-primary flex-1 justify-center disabled:opacity-50"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}
