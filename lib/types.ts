export type Species = 'dog' | 'cat'
export type Gender = 'male' | 'female'
export type Size = 'small' | 'medium' | 'large'
export type MediaType = 'photo' | 'video'

export interface Vaccine {
  name: string
  date: string
}

export interface Disease {
  name: string
  status: string
}

export interface Animal {
  id: string
  name: string
  species: Species
  breed: string | null
  age_years: number
  age_months: number
  gender: Gender
  size: Size
  vaccines: Vaccine[]
  diseases: Disease[]
  is_vaccinated: boolean
  is_sterilized: boolean
  is_dewormed: boolean
  rescuer_name: string
  rescuer_phone: string
  is_available: boolean
  story: string | null
  created_at: string
  media?: AnimalMedia[]
}

export interface AnimalMedia {
  id: string
  animal_id: string
  url: string
  type: MediaType
  is_primary: boolean
  order_index: number
}

export interface AppSettings {
  whatsapp_number: string
  bank_alias: string | null
  cbu: string | null
}

export interface BankAccount {
  id: string
  owner_name: string
  alias: string | null
  cbu: string | null
  order_index: number
}

export function getAgeText(years: number, months: number): string {
  if (years === 0 && months === 0) return 'Recién nacido'
  if (years === 0) return `${months} ${months === 1 ? 'mes' : 'meses'}`
  if (months === 0) return `${years} ${years === 1 ? 'año' : 'años'}`
  return `${years} ${years === 1 ? 'año' : 'años'} y ${months} ${months === 1 ? 'mes' : 'meses'}`
}

export function getSpeciesText(species: Species): string {
  return species === 'dog' ? 'Perro' : 'Gato'
}

export function getGenderText(gender: Gender): string {
  return gender === 'male' ? 'Macho' : 'Hembra'
}

export function getSizeText(size: Size): string {
  const map: Record<Size, string> = { small: 'Pequeño', medium: 'Mediano', large: 'Grande' }
  return map[size]
}

export function getPrimaryPhoto(animal: Animal): string | null {
  if (!animal.media?.length) return null
  const primary = animal.media.find((m) => m.is_primary && m.type === 'photo')
  return primary?.url ?? animal.media.find((m) => m.type === 'photo')?.url ?? null
}

export function buildWhatsAppMessage(animal: Animal): string {
  const age = getAgeText(animal.age_years, animal.age_months)
  const species = getSpeciesText(animal.species)
  const gender = getGenderText(animal.gender)
  const size = getSizeText(animal.size)

  return `Hola! Vi a *${animal.name}* en Somos su voz y me gustaría saber más 🐾\n\n` +
    `*${species}* · ${animal.breed ?? 'Raza mixta'} · ${age}\n` +
    `*Sexo:* ${gender} · *Tamaño:* ${size}\n\n` +
    `¿Podés darme más información sobre ${animal.name}?`
}

export function buildWhatsAppUrl(phone: string, animal: Animal): string {
  const message = encodeURIComponent(buildWhatsAppMessage(animal))
  const cleanPhone = phone.replace(/\D/g, '')
  return `https://wa.me/${cleanPhone}?text=${message}`
}

// ── Hogares de tránsito ──────────────────────────────────────

export type FosterStatus = 'pending' | 'available' | 'unavailable' | 'in_transit'

export const FOSTER_STATUS_LABELS: Record<FosterStatus, string> = {
  pending:     'Pendiente',
  available:   'Disponible',
  unavailable: 'No disponible',
  in_transit:  'En tránsito',
}

export interface FosterRequest {
  id: string
  // Especie de interés
  species: 'dog' | 'cat' | null
  // Datos de contacto
  contact_name: string
  contact_phone: string
  age: string | null
  social_media: string | null
  // Hogar
  address: string
  locality: string | null
  location_type: 'casa' | 'depto' | null
  depto_allows_pets: boolean | null
  outdoor_spaces: string[] | null
  has_balcony_protection: boolean | null
  has_other_pets: boolean
  has_vif_animal: boolean | null
  // Experiencia y preferencias
  has_fostered_before: boolean | null
  can_foster_sick: boolean | null
  animal_preferences: string | null
  specific_animal: string | null
  // Logística
  hours_alone_per_day: string | null
  max_transit_time: string | null
  available_from: string | null
  // Compromisos
  household_agreement: boolean | null
  has_mobility: boolean | null
  accepts_whatsapp_group: boolean | null
  // Otros
  notes: string | null
  has_outdoor_space: boolean
  availability: string
  // Estado
  status: FosterStatus
  created_at: string
}
