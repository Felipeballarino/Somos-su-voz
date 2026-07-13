'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { BankAccount } from '@/lib/types'

type BankAccountDraft = {
  id: string | null
  owner_name: string
  alias: string
  cbu: string
}

let tempIdCounter = 0
function newTempId() {
  tempIdCounter += 1
  return `new-${tempIdCounter}`
}

function toDrafts(accounts: BankAccount[]): BankAccountDraft[] {
  return accounts.map((a) => ({
    id: a.id,
    owner_name: a.owner_name,
    alias: a.alias ?? '',
    cbu: a.cbu ?? '',
  }))
}

export default function AdminSettingsForm() {
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [accounts, setAccounts] = useState<BankAccountDraft[]>([])
  const [removedIds, setRemovedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      supabase.from('app_settings').select('whatsapp_number').eq('id', true).single(),
      supabase.from('bank_accounts').select('id, owner_name, alias, cbu, order_index').order('order_index', { ascending: true }),
    ]).then(([settingsRes, accountsRes]) => {
      setWhatsappNumber(settingsRes.data?.whatsapp_number ?? '')
      setAccounts(toDrafts((accountsRes.data as BankAccount[]) ?? []))
      setLoading(false)
    })
  }, [])

  const handleAddAccount = () => {
    setAccounts((prev) => [...prev, { id: newTempId(), owner_name: '', alias: '', cbu: '' }])
  }

  const handleRemoveAccount = (id: string | null) => {
    if (!id) return
    setAccounts((prev) => prev.filter((a) => a.id !== id))
    if (!id.startsWith('new-')) {
      setRemovedIds((prev) => [...prev, id])
    }
  }

  const handleAccountChange = (id: string | null, field: 'owner_name' | 'alias' | 'cbu', value: string) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error: settingsError } = await supabase
        .from('app_settings')
        .update({
          whatsapp_number: whatsappNumber,
          updated_at: new Date().toISOString(),
        })
        .eq('id', true)
      if (settingsError) throw settingsError

      if (removedIds.length > 0) {
        const { error: deleteError } = await supabase.from('bank_accounts').delete().in('id', removedIds)
        if (deleteError) throw deleteError
      }

      const incompleteAccount = accounts.find(
        (a) => (a.alias.trim() || a.cbu.trim()) && !a.owner_name.trim()
      )
      if (incompleteAccount) {
        toast.error('Completá el nombre del propietario en todas las cuentas con alias o CBU cargado')
        setSaving(false)
        return
      }

      const validAccounts = accounts.filter((a) => a.owner_name.trim() && (a.alias.trim() || a.cbu.trim()))

      const toUpdate = validAccounts.filter((a) => a.id && !a.id.startsWith('new-'))
      const toInsert = validAccounts.filter((a) => !a.id || a.id.startsWith('new-'))

      for (let index = 0; index < validAccounts.length; index += 1) {
        const account = validAccounts[index]
        if (account.id && !account.id.startsWith('new-')) {
          const { error } = await supabase
            .from('bank_accounts')
            .update({
              owner_name: account.owner_name,
              alias: account.alias || null,
              cbu: account.cbu || null,
              order_index: index,
            })
            .eq('id', account.id)
          if (error) throw error
        }
      }

      if (toInsert.length > 0) {
        const startIndex = toUpdate.length
        const { error } = await supabase.from('bank_accounts').insert(
          toInsert.map((a, i) => ({
            owner_name: a.owner_name,
            alias: a.alias || null,
            cbu: a.cbu || null,
            order_index: startIndex + i,
          }))
        )
        if (error) throw error
      }

      setRemovedIds([])

      const { data: refreshed } = await supabase
        .from('bank_accounts')
        .select('id, owner_name, alias, cbu, order_index')
        .order('order_index', { ascending: true })
      setAccounts(toDrafts((refreshed as BankAccount[]) ?? []))

      toast.success('Configuración guardada')
    } catch (err) {
      console.error(err)
      toast.error('Ocurrió un error al guardar')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="card p-6 space-y-5 max-w-lg mx-auto">
      <div>
        <h2 className="text-xl font-bold text-brand-dark">Configuración general</h2>
        <p className="text-sm text-brand-dark/50 mt-1">
          Estos datos se usan en todo el sitio, para todos los animales.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-dark/70 mb-1.5">Número de WhatsApp para donaciones en efectivo *</label>
        <input
          className="input-field"
          placeholder="5491112345678"
          value={whatsappNumber}
          onChange={(e) => setWhatsappNumber(e.target.value)}
        />
        <p className="text-xs text-brand-dark/40 mt-1">
          Con código de país: 549 + código de área + número (sin 0 ni 15). Se usa solo para coordinar donaciones en efectivo. El contacto por cada animal usa el WhatsApp cargado por su rescatista.
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-medium text-brand-dark/70">Alias y CBU para donaciones</label>
          <button
            type="button"
            onClick={handleAddAccount}
            className="text-xs font-semibold text-orange hover:underline"
          >
            + Agregar otro
          </button>
        </div>
        <p className="text-xs text-brand-dark/40 mb-3">
          Opcional. Se muestran todos en la sección &ldquo;Doná dinero&rdquo; del sitio, junto al nombre del propietario.
        </p>

        {accounts.length === 0 && (
          <p className="text-xs text-brand-dark/40 italic mb-3">No hay alias ni CBU cargados todavía.</p>
        )}

        <div className="space-y-4">
          {accounts.map((account) => (
            <div key={account.id} className="p-3 bg-cream rounded-xl border border-cream-darker space-y-2 relative">
              <button
                type="button"
                onClick={() => handleRemoveAccount(account.id)}
                className="absolute top-2 right-2 text-xs text-red-500 hover:underline"
              >
                Quitar
              </button>
              <div>
                <label className="block text-xs font-medium text-brand-dark/60 mb-1">Nombre del propietario *</label>
                <input
                  className="input-field"
                  placeholder="Nombre y apellido"
                  value={account.owner_name}
                  onChange={(e) => handleAccountChange(account.id, 'owner_name', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-dark/60 mb-1">Alias</label>
                <input
                  className="input-field"
                  placeholder="rescatados.donaciones"
                  value={account.alias}
                  onChange={(e) => handleAccountChange(account.id, 'alias', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-dark/60 mb-1">CBU</label>
                <input
                  className="input-field"
                  placeholder="0000003100000000000000"
                  value={account.cbu}
                  onChange={(e) => handleAccountChange(account.id, 'cbu', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        className="btn-primary w-full justify-center disabled:opacity-50"
        onClick={handleSave}
        disabled={saving || !whatsappNumber}
      >
        {saving ? 'Guardando...' : 'Guardar configuración'}
      </button>
    </div>
  )
}
