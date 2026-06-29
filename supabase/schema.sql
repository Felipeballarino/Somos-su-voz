-- ============================================================
-- Rescatados — Schema completo
-- Ejecutar en: Supabase > SQL Editor
-- ============================================================

-- Tabla principal de animales
create table if not exists animals (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  species         text not null check (species in ('dog', 'cat')),
  breed           text,
  age_years       int not null default 0,
  age_months      int not null default 0,
  gender          text not null check (gender in ('male', 'female')),
  size            text not null check (size in ('small', 'medium', 'large')),
  vaccines        jsonb not null default '[]'::jsonb,
  diseases        jsonb not null default '[]'::jsonb,
  is_vaccinated   boolean not null default false,
  is_sterilized   boolean not null default false,
  is_dewormed     boolean not null default false,
  rescuer_name    text not null,
  rescuer_phone   text not null,
  is_available    boolean not null default true,
  created_at      timestamptz not null default now()
);

-- Tabla de fotos y videos
create table if not exists animal_media (
  id            uuid primary key default gen_random_uuid(),
  animal_id     uuid not null references animals(id) on delete cascade,
  url           text not null,
  type          text not null check (type in ('photo', 'video')),
  is_primary    boolean not null default false,
  order_index   int not null default 0,
  created_at    timestamptz not null default now()
);

-- Índices
create index if not exists animals_species_idx on animals(species);
create index if not exists animals_available_idx on animals(is_available);
create index if not exists animal_media_animal_id_idx on animal_media(animal_id);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table animals enable row level security;
alter table animal_media enable row level security;

-- Lectura pública de animales disponibles
create policy "Lectura pública de animales disponibles"
  on animals for select
  using (is_available = true);

-- Lectura pública de media
create policy "Lectura pública de media"
  on animal_media for select
  using (true);

-- Escritura solo para usuarios autenticados
create policy "Insertar animales autenticados"
  on animals for insert
  to authenticated
  with check (true);

create policy "Insertar media autenticados"
  on animal_media for insert
  to authenticated
  with check (true);

create policy "Actualizar animales propios"
  on animals for update
  to authenticated
  using (true);

-- ============================================================
-- Storage bucket
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'animal-media',
  'animal-media',
  true,
  52428800,  -- 50MB
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
)
on conflict (id) do nothing;

-- Política de lectura pública del storage
create policy "Storage público"
  on storage.objects for select
  using (bucket_id = 'animal-media');

-- Política de subida para autenticados
create policy "Subida autenticada"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'animal-media');

-- ============================================================
-- Datos de ejemplo
-- ============================================================

insert into animals (name, species, breed, age_years, age_months, gender, size, is_vaccinated, is_sterilized, is_dewormed, rescuer_name, rescuer_phone, vaccines)
values
  (
    'Firulais', 'dog', 'Labrador', 2, 3, 'male', 'large',
    true, true, true, 'María García', '5491112345678',
    '[{"name": "Antirrábica", "date": "2024-03"}, {"name": "Séxtuple", "date": "2024-03"}]'::jsonb
  ),
  (
    'Luna', 'cat', null, 0, 8, 'female', 'small',
    true, false, true, 'Juan Pérez', '5491187654321',
    '[{"name": "Triple felina", "date": "2024-06"}]'::jsonb
  ),
  (
    'Rocky', 'dog', 'Pit Bull', 3, 0, 'male', 'medium',
    true, true, true, 'Ana López', '5491198765432',
    '[{"name": "Antirrábica", "date": "2024-01"}, {"name": "Séxtuple", "date": "2024-01"}]'::jsonb
  );
