'use client'

import { useState, useEffect, useCallback } from 'react'
import { getFosterRequests, updateFosterStatus, deleteFosterRequest } from '@/lib/supabase'
import { FosterRequest, FosterStatus, FOSTER_STATUS_LABELS } from '@/lib/types'

const STATUS_COLORS: Record<FosterStatus, string> = {
  pending:     'bg-yellow-100 text-yellow-800',
  available:   'bg-green-100 text-green-800',
  unavailable: 'bg-red-100 text-red-800',
  in_transit:  'bg-blue-100 text-blue-800',
}

function bool(val: boolean | null | undefined): string {
  if (val === null || val === undefined) return '—'
  return val ? 'Sí' : 'No'
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-brand-dark/40">{label}</p>
      <p className="text-sm font-medium text-brand-dark mt-0.5">{value ?? '—'}</p>
    </div>
  )
}

function FosterCard({ req, onUpdate, onDelete }: {
  req: FosterRequest
  onUpdate: (id: string, status: FosterStatus) => void
  onDelete: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="card p-5 space-y-4">
      {/* Cabecera */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="font-bold text-brand-dark">{req.contact_name}</p>
            {req.species && (
              <span className="text-xs bg-cream-dark text-brand-dark/60 px-2 py-0.5 rounded-full">
                {req.species === 'dog' ? '🐶 Perros' : '🐱 Gatos'}
              </span>
            )}
          </div>
          <a href={`tel:${req.contact_phone}`} className="text-sm text-orange hover:underline">
            {req.contact_phone}
          </a>
          {req.locality && (
            <p className="text-xs text-brand-dark/50 mt-0.5">{req.locality}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[req.status]}`}>
            {FOSTER_STATUS_LABELS[req.status]}
          </span>
          <select
            value={req.status}
            onChange={(e) => onUpdate(req.id, e.target.value as FosterStatus)}
            className="text-xs border border-cream-darker rounded-lg px-2 py-1 bg-white text-brand-dark outline-none"
          >
            {(Object.keys(FOSTER_STATUS_LABELS) as FosterStatus[]).map((s) => (
              <option key={s} value={s}>{FOSTER_STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Resumen rápido */}
      <div className="grid grid-cols-3 gap-3">
        <Detail
          label="Vivienda"
          value={req.location_type === 'casa' ? 'Casa' : req.location_type === 'depto' ? 'Departamento' : null}
        />
        <Detail label="Disponible desde" value={req.available_from} />
        <Detail label="Tiempo máx." value={req.max_transit_time} />
      </div>

      {/* Toggle detalles */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-orange hover:text-orange/70 font-semibold flex items-center gap-1 transition-colors"
      >
        {expanded ? '▲ Ocultar detalles' : '▼ Ver detalles completos'}
      </button>

      {expanded && (
        <div className="pt-4 border-t border-cream-dark space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Detail label="Edad" value={req.age} />
            <Detail label="Instagram/Facebook" value={req.social_media} />
            <Detail label="Dirección" value={req.address} />
            {req.location_type === 'depto' && (
              <Detail label="Permiten mascotas (depto)" value={bool(req.depto_allows_pets)} />
            )}
            <Detail label="Espacios exteriores" value={req.outdoor_spaces?.join(', ')} />
            <Detail label="Protección balcones" value={bool(req.has_balcony_protection)} />
            <Detail label="Otros animales en casa" value={bool(req.has_other_pets)} />
            <Detail label="Animal con VIF/VILEF" value={bool(req.has_vif_animal)} />
            <Detail label="Fue provisorio antes" value={bool(req.has_fostered_before)} />
            <Detail label="Puede transitar enfermos" value={bool(req.can_foster_sick)} />
            <Detail label="Horas solo/día" value={req.hours_alone_per_day} />
            <Detail label="Acuerdo familiar" value={bool(req.household_agreement)} />
            <Detail label="Tiene movilidad" value={bool(req.has_mobility)} />
            <Detail label="Acepta grupo WA" value={bool(req.accepts_whatsapp_group)} />
          </div>
          {req.animal_preferences && (
            <Detail label="Preferencias del animal" value={req.animal_preferences} />
          )}
          {req.specific_animal && (
            <Detail label="Animal de interés" value={req.specific_animal} />
          )}
          {req.notes && (
            <Detail label="Notas adicionales" value={req.notes} />
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-cream-dark">
        <span className="text-xs text-brand-dark/40">
          {new Date(req.created_at).toLocaleDateString('es-AR', {
            day: '2-digit', month: 'short', year: 'numeric',
          })}
        </span>
        <div className="flex items-center gap-3">
          <a
            href={`https://wa.me/${req.contact_phone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-green-100 text-green-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-green-200 transition-colors"
          >
            WhatsApp
          </a>
          <button
            onClick={() => onDelete(req.id)}
            className="text-xs text-red-400 hover:text-red-600 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminHelpRequests() {
  const [fosters, setFosters] = useState<FosterRequest[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setFosters(await getFosterRequests())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleUpdate = async (id: string, status: FosterStatus) => {
    await updateFosterStatus(id, status)
    setFosters((prev) => prev.map((r) => r.id === id ? { ...r, status } : r))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta solicitud?')) return
    await deleteFosterRequest(id)
    setFosters((prev) => prev.filter((r) => r.id !== id))
  }

  const pendingCount = fosters.filter((r) => r.status === 'pending').length

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-lg font-bold text-brand-dark">Solicitudes de tránsito</h2>
          {pendingCount > 0 && (
            <p className="text-sm text-orange mt-0.5">
              {pendingCount} pendiente{pendingCount > 1 ? 's' : ''} de revisar
            </p>
          )}
        </div>
        <button
          onClick={load}
          className="text-sm text-brand-dark/50 hover:text-brand-dark transition-colors"
        >
          Actualizar
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : fosters.length === 0 ? (
        <div className="text-center py-12 text-brand-dark/40">
          <p className="text-3xl mb-3">📭</p>
          <p className="text-sm">No hay solicitudes todavía</p>
        </div>
      ) : (
        <div className="space-y-4">
          {fosters.map((r) => (
            <FosterCard key={r.id} req={r} onUpdate={handleUpdate} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
