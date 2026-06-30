-- ============================================================
-- Rescatados — Migración: múltiples alias/CBU con propietario
-- Ejecutar en: Supabase > SQL Editor
-- ============================================================

create table if not exists bank_accounts (
  id           uuid primary key default gen_random_uuid(),
  owner_name   text not null,
  alias        text,
  cbu          text,
  order_index  int not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists bank_accounts_order_idx on bank_accounts(order_index);

alter table bank_accounts enable row level security;

drop policy if exists "Lectura pública de cuentas bancarias" on bank_accounts;
create policy "Lectura pública de cuentas bancarias"
  on bank_accounts for select
  using (true);

drop policy if exists "Insertar cuentas bancarias autenticados" on bank_accounts;
create policy "Insertar cuentas bancarias autenticados"
  on bank_accounts for insert
  to authenticated
  with check (true);

drop policy if exists "Actualizar cuentas bancarias autenticados" on bank_accounts;
create policy "Actualizar cuentas bancarias autenticados"
  on bank_accounts for update
  to authenticated
  using (true);

drop policy if exists "Eliminar cuentas bancarias autenticados" on bank_accounts;
create policy "Eliminar cuentas bancarias autenticados"
  on bank_accounts for delete
  to authenticated
  using (true);

-- Migra el alias/CBU único existente (si lo había) a la nueva tabla
insert into bank_accounts (owner_name, alias, cbu, order_index)
select 'Somos su voz', bank_alias, cbu, 0
from app_settings
where id = true and (bank_alias is not null or cbu is not null)
and not exists (select 1 from bank_accounts);
