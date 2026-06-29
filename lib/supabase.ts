import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? 'placeholder'
)

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
