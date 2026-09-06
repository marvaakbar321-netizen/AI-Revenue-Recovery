-- Add missing store columns used by the Store Setup form
-- and enforce one store per admin at the database level.

alter table public.stores
  add column if not exists logo text,
  add column if not exists hero_title text,
  add column if not exists hero_description text,
  add column if not exists banner text,
  add column if not exists category text,
  add column if not exists owner text,
  add column if not exists email text,
  add column if not exists phone text,
  add column if not exists address text,
  add column if not exists currency text default 'USD',
  add column if not exists shipping text,
  add column if not exists status text default 'Active';

-- Enforce one store per admin/user.
create unique index if not exists stores_owner_id_key
  on public.stores (owner_id);

-- Ensure RLS is enabled.
alter table public.stores enable row level security;

-- Drop and recreate policies so they are idempotent and aligned with the schema.
drop policy if exists "Stores are viewable publicly" on public.stores;
drop policy if exists "Store owners manage their stores" on public.stores;

create policy "Stores are viewable publicly"
  on public.stores
  for select
  using (true);

create policy "Store owners manage their stores"
  on public.stores
  for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Make sure the updated_at trigger exists.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_stores_updated_at on public.stores;
create trigger set_stores_updated_at
  before update on public.stores
  for each row
  execute function public.set_updated_at();
