-- ============================================================
-- Rescatados — Migración: configuración global + edición admin
-- Ejecutar en: Supabase > SQL Editor (proyectos ya existentes)
-- ============================================================

-- Tabla de configuración global (fila única)
create table if not exists app_settings (
  id              boolean primary key default true,
  whatsapp_number text not null default '',
  bank_alias      text,
  cbu             text,
  updated_at      timestamptz not null default now(),
  constraint app_settings_singleton check (id)
);

alter table app_settings add column if not exists cbu text;

insert into app_settings (id, whatsapp_number, bank_alias, cbu)
values (true, '', null, null)
on conflict (id) do nothing;

alter table app_settings enable row level security;

drop policy if exists "Lectura pública de configuración" on app_settings;
create policy "Lectura pública de configuración"
  on app_settings for select
  using (true);

drop policy if exists "Actualizar configuración autenticados" on app_settings;
create policy "Actualizar configuración autenticados"
  on app_settings for update
  to authenticated
  using (true);

-- Permitir que el admin vea TODOS los animales (no solo los disponibles)
drop policy if exists "Lectura completa autenticados" on animals;
create policy "Lectura completa autenticados"
  on animals for select
  to authenticated
  using (true);

-- Permitir editar y borrar fotos/videos desde el panel admin
drop policy if exists "Actualizar media autenticados" on animal_media;
create policy "Actualizar media autenticados"
  on animal_media for update
  to authenticated
  using (true);

drop policy if exists "Eliminar media autenticados" on animal_media;
create policy "Eliminar media autenticados"
  on animal_media for delete
  to authenticated
  using (true);

-- Permitir borrar archivos del storage al eliminar fotos/videos
drop policy if exists "Eliminar storage autenticados" on storage.objects;
create policy "Eliminar storage autenticados"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'animal-media');
