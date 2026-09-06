-- Enforce one store per admin/user
create unique index if not exists stores_owner_id_key
  on public.stores (owner_id);
