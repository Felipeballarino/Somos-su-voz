-- ============================================================
-- Migration v2: Hogar de tránsito con campos extendidos
-- Ejecutar en: Supabase > SQL Editor
-- ============================================================

-- 1. Cambiar tipo de status a text (antes era help_status enum con valores distintos)
alter table foster_requests alter column status type text using status::text;
alter table foster_requests alter column status set default 'pending';

-- 2. Agregar columnas nuevas del formulario extendido
alter table foster_requests
  add column if not exists species               text,
  add column if not exists age                   text,
  add column if not exists locality              text,
  add column if not exists location_type         text,
  add column if not exists depto_allows_pets     boolean,
  add column if not exists outdoor_spaces        text[],
  add column if not exists has_balcony_protection boolean,
  add column if not exists has_vif_animal        boolean,
  add column if not exists has_fostered_before   boolean,
  add column if not exists can_foster_sick       boolean,
  add column if not exists animal_preferences    text,
  add column if not exists specific_animal       text,
  add column if not exists hours_alone_per_day   text,
  add column if not exists max_transit_time      text,
  add column if not exists available_from        text,
  add column if not exists household_agreement   boolean,
  add column if not exists has_mobility          boolean,
  add column if not exists accepts_whatsapp_group boolean,
  add column if not exists social_media          text;

-- Nota: transport_requests y photo_requests ya no se usan desde la UI
-- pero se dejan en la DB para no perder datos existentes.
-- Si querés eliminarlas manualmente:
-- drop table if exists transport_requests;
-- drop table if exists photo_requests;
