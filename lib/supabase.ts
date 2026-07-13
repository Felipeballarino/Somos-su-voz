import { createClient } from '@supabase/supabase-js'
import { AppSettings, BankAccount, FosterRequest, FosterStatus } from './types'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? 'placeholder'
)

export async function getSettings(): Promise<AppSettings> {
  const { data, error } = await supabase
    .from('app_settings')
    .select('whatsapp_number, bank_alias, cbu')
    .eq('id', true)
    .single()

  if (error) console.error('getSettings error:', error.message)

  return data ?? { whatsapp_number: '', bank_alias: null, cbu: null }
}

export async function getBankAccounts(): Promise<BankAccount[]> {
  const { data, error } = await supabase
    .from('bank_accounts')
    .select('id, owner_name, alias, cbu, order_index')
    .order('order_index', { ascending: true })

  if (error) console.error('getBankAccounts error:', error.message)

  return data ?? []
}

export async function deleteMediaFile(url: string): Promise<void> {
  const path = url.split('/animal-media/').pop()
  if (!path) return
  await supabase.storage.from('animal-media').remove([path])
}

export async function uploadMedia(
  animalId: string,
  file: File
): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `${animalId}/${Date.now()}.${ext}`

  const { error } = await supabase.storage
    .from('animal-media')
    .upload(path, file, { cacheControl: '3600', upsert: false })

  if (error) throw error

  return path
}

export function getPublicUrl(path: string): string {
  const { data } = supabase.storage.from('animal-media').getPublicUrl(path)
  return data.publicUrl
}

// ── Hogares de tránsito ──────────────────────────────────────

export async function getFosterRequests(): Promise<FosterRequest[]> {
  const { data } = await supabase
    .from('foster_requests')
    .select('*')
    .order('created_at', { ascending: false })
  return (data as FosterRequest[]) ?? []
}

export async function updateFosterStatus(id: string, status: FosterStatus): Promise<void> {
  await supabase.from('foster_requests').update({ status }).eq('id', id)
}

export async function deleteFosterRequest(id: string): Promise<void> {
  await supabase.from('foster_requests').delete().eq('id', id)
}
