import { createClient } from '@supabase/supabase-js'
import { AppSettings, BankAccount } from './types'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? 'placeholder'
)

export async function getSettings(): Promise<AppSettings> {
  const { data } = await supabase
    .from('app_settings')
    .select('whatsapp_number, bank_alias, cbu')
    .eq('id', true)
    .single()

  return data ?? { whatsapp_number: '', bank_alias: null, cbu: null }
}

export async function getBankAccounts(): Promise<BankAccount[]> {
  const { data } = await supabase
    .from('bank_accounts')
    .select('id, owner_name, alias, cbu, order_index')
    .order('order_index', { ascending: true })

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
