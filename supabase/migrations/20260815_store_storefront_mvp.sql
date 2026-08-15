create extension if not exists pgcrypto;

create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  name text not null,
  description text not null default '',
  price numeric(10,2) not null default 0,
  image_url text,
  stock integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete restrict,
  status text not null default 'pending',
  payment_status text not null default 'simulated',
  subtotal numeric(10,2) not null default 0,
  shipping numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null default 1,
  unit_price numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0
);

create unique index if not exists stores_slug_key on public.stores (slug);
create unique index if not exists customers_store_email_key on public.customers (store_id, email);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger set_stores_updated_at
before update on public.stores
for each row
execute function public.set_updated_at();

create or replace trigger set_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

create or replace trigger set_customers_updated_at
before update on public.customers
for each row
execute function public.set_updated_at();

create or replace trigger set_orders_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

alter table public.stores enable row level security;
alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Stores are viewable publicly"
on public.stores
for select
using (true);

create policy "Store owners manage their stores"
on public.stores
for all
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create policy "Public can view active products"
on public.products
for select
using (active = true);

create policy "Store owners manage their products"
on public.products
for all
using (
  exists (
    select 1 from public.stores s
    where s.id = store_id and s.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.stores s
    where s.id = store_id and s.owner_id = auth.uid()
  )
);

create policy "Customers can be read by store owners or checked out publicly"
on public.customers
for select
using (
  true
);

create policy "Customers can be created for checkout"
on public.customers
for insert
with check (true);

create policy "Store owners manage their customers"
on public.customers
for update
using (
  exists (
    select 1 from public.stores s
    where s.id = store_id and s.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.stores s
    where s.id = store_id and s.owner_id = auth.uid()
  )
);

create policy "Store owners can view own orders"
on public.orders
for select
using (
  exists (
    select 1 from public.stores s
    where s.id = store_id and s.owner_id = auth.uid()
  )
);

create policy "Checkout can create orders"
on public.orders
for insert
with check (true);

create policy "Store owners can update their orders"
on public.orders
for update
using (
  exists (
    select 1 from public.stores s
    where s.id = store_id and s.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.stores s
    where s.id = store_id and s.owner_id = auth.uid()
  )
);

create policy "Store owners can view order items"
on public.order_items
for select
using (
  exists (
    select 1 from public.orders o
    join public.stores s on s.id = o.store_id
    where o.id = order_id and s.owner_id = auth.uid()
  )
);

create policy "Checkout can create order items"
on public.order_items
for insert
with check (true);

create policy "Store owners can update order items"
on public.order_items
for update
using (
  exists (
    select 1 from public.orders o
    join public.stores s on s.id = o.store_id
    where o.id = order_id and s.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.orders o
    join public.stores s on s.id = o.store_id
    where o.id = order_id and s.owner_id = auth.uid()
  )
);

create policy "Store owners can delete own order items"
on public.order_items
for delete
using (
  exists (
    select 1 from public.orders o
    join public.stores s on s.id = o.store_id
    where o.id = order_id and s.owner_id = auth.uid()
  )
);
