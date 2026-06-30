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

  return `Hola! Vi a *${animal.name}* en Rescatados y me gustaría saber más 🐾\n\n` +
    `*${species}* · ${animal.breed ?? 'Raza mixta'} · ${age}\n` +
    `*Sexo:* ${gender} · *Tamaño:* ${size}\n\n` +
    `¿Podés darme más información sobre ${animal.name}?`
}

export function buildWhatsAppUrl(phone: string, animal: Animal): string {
  const message = encodeURIComponent(buildWhatsAppMessage(animal))
  return `https://wa.me/${phone}?text=${message}`
}
