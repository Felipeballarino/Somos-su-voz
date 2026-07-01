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

-- Tabla de configuración global (fila única)
create table if not exists app_settings (
  id              boolean primary key default true,
  whatsapp_number text not null default '',
  bank_alias      text,
  cbu             text,
  updated_at      timestamptz not null default now(),
  constraint app_settings_singleton check (id)
);

insert into app_settings (id, whatsapp_number, bank_alias, cbu)
values (true, '', null, null)
on conflict (id) do nothing;

-- Tabla de cuentas bancarias para donaciones (alias/CBU, puede haber varias)
create table if not exists bank_accounts (
  id           uuid primary key default gen_random_uuid(),
  owner_name   text not null,
  alias        text,
  cbu          text,
  order_index  int not null default 0,
  created_at   timestamptz not null default now()
);

-- Índices
create index if not exists animals_species_idx on animals(species);
create index if not exists animals_available_idx on animals(is_available);
create index if not exists animal_media_animal_id_idx on animal_media(animal_id);
create index if not exists bank_accounts_order_idx on bank_accounts(order_index);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table animals enable row level security;
alter table animal_media enable row level security;
alter table app_settings enable row level security;
alter table bank_accounts enable row level security;

-- Lectura pública de animales disponibles
create policy "Lectura pública de animales disponibles"
  on animals for select
  using (is_available = true);

-- El admin necesita ver también los no disponibles (adoptados/devueltos)
create policy "Lectura completa autenticados"
  on animals for select
  to authenticated
  using (true);

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

create policy "Actualizar media autenticados"
  on animal_media for update
  to authenticated
  using (true);

create policy "Eliminar media autenticados"
  on animal_media for delete
  to authenticated
  using (true);

-- Configuración global: lectura pública, escritura autenticada
create policy "Lectura pública de configuración"
  on app_settings for select
  using (true);

create policy "Actualizar configuración autenticados"
  on app_settings for update
  to authenticated
  using (true);

-- Cuentas bancarias: lectura pública, escritura autenticada
create policy "Lectura pública de cuentas bancarias"
  on bank_accounts for select
  using (true);

create policy "Insertar cuentas bancarias autenticados"
  on bank_accounts for insert
  to authenticated
  with check (true);

create policy "Actualizar cuentas bancarias autenticados"
  on bank_accounts for update
  to authenticated
  using (true);

create policy "Eliminar cuentas bancarias autenticados"
  on bank_accounts for delete
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

-- Política de borrado para autenticados (editar/eliminar fotos)
create policy "Eliminar storage autenticados"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'animal-media');

-- ============================================================
-- Datos de ejemplo
-- ============================================================

-- ============================================================
-- Formularios de ayuda voluntaria
-- ============================================================

create type help_status as enum ('pending', 'in_progress', 'resolved');

-- Provisorios: personas que ofrecen hogar transitorio
create table if not exists foster_requests (
  id                 uuid primary key default gen_random_uuid(),
  contact_name       text not null,
  contact_phone      text not null,
  address            text not null,
  has_other_pets     boolean not null default false,
  has_outdoor_space  boolean not null default false,
  availability       text not null,
  notes              text,
  status             help_status not null default 'pending',
  created_at         timestamptz not null default now()
);

-- Traslados: personas que ofrecen llevar animales de un lugar a otro
create table if not exists transport_requests (
  id                  uuid primary key default gen_random_uuid(),
  contact_name        text not null,
  contact_phone       text not null,
  origin              text not null,
  destination         text not null,
  requested_date      text not null,
  animal_description  text,
  notes               text,
  status              help_status not null default 'pending',
  created_at          timestamptz not null default now()
);

-- Fotos: personas que ofrecen sacar fotos a los animales rescatados
create table if not exists photo_requests (
  id                  uuid primary key default gen_random_uuid(),
  contact_name        text not null,
  contact_phone       text not null,
  address             text not null,
  availability        text not null,
  has_own_camera      boolean not null default false,
  animal_description  text,
  notes               text,
  status              help_status not null default 'pending',
  created_at          timestamptz not null default now()
);

-- Índices
create index if not exists foster_requests_status_idx    on foster_requests(status);
create index if not exists transport_requests_status_idx on transport_requests(status);
create index if not exists photo_requests_status_idx     on photo_requests(status);

-- RLS
alter table foster_requests    enable row level security;
alter table transport_requests enable row level security;
alter table photo_requests     enable row level security;

-- Cualquiera puede enviar una solicitud (formulario público)
create policy "Insertar foster público"    on foster_requests    for insert with check (true);
create policy "Insertar transport público" on transport_requests for insert with check (true);
create policy "Insertar photo público"     on photo_requests     for insert with check (true);

-- Solo autenticados pueden leer y gestionar las solicitudes
create policy "Leer foster autenticado"    on foster_requests    for select to authenticated using (true);
create policy "Leer transport autenticado" on transport_requests for select to authenticated using (true);
create policy "Leer photo autenticado"     on photo_requests     for select to authenticated using (true);

create policy "Actualizar foster autenticado"    on foster_requests    for update to authenticated using (true);
create policy "Actualizar transport autenticado" on transport_requests for update to authenticated using (true);
create policy "Actualizar photo autenticado"     on photo_requests     for update to authenticated using (true);

create policy "Eliminar foster autenticado"    on foster_requests    for delete to authenticated using (true);
create policy "Eliminar transport autenticado" on transport_requests for delete to authenticated using (true);
create policy "Eliminar photo autenticado"     on photo_requests     for delete to authenticated using (true);

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
