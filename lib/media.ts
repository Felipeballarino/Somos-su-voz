export const MAX_IMAGE_MB = 3
export const MAX_VIDEO_MB = 25
export const MAX_IMAGE_DIMENSION = 1600

// Debe coincidir con allowed_mime_types del bucket 'animal-media' (supabase/schema.sql)
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']

// Achica y recomprime imágenes en el navegador antes de subirlas, para cuidar
// el storage gratuito de Supabase (1GB en el free tier).
export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file

  // Formatos que el navegador no puede decodificar (ej. HEIC de iPhone) tiran
  // acá; devolvemos el original y validateMediaFile lo rechaza con un mensaje claro.
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(bitmap, 0, 0, width, height)

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/webp', 0.8)
    )
    if (!blob || blob.size >= file.size) return file

    const newName = file.name.replace(/\.[^.]+$/, '') + '.webp'
    return new File([blob], newName, { type: 'image/webp' })
  } catch {
    return file
  }
}

export function validateMediaFile(file: File): string | null {
  const isVideo = file.type.startsWith('video/')
  const allowedTypes = isVideo ? ALLOWED_VIDEO_TYPES : ALLOWED_IMAGE_TYPES

  if (!allowedTypes.includes(file.type)) {
    return `${file.name}: formato no compatible (HEIC/HEIF no se puede subir, convertilo a JPG o PNG)`
  }

  const maxBytes = (isVideo ? MAX_VIDEO_MB : MAX_IMAGE_MB) * 1024 * 1024
  if (file.size > maxBytes) {
    const limit = isVideo ? MAX_VIDEO_MB : MAX_IMAGE_MB
    return `${file.name}: supera el límite de ${limit}MB`
  }
  return null
}
