-- Store-scoped checkout, RLS isolation, and realtime.
-- Run this migration in the Supabase SQL Editor before using the updated checkout flow.

alter table public.customers
  add column if not exists address text;

create unique index if not exists stores_owner_id_key
  on public.stores (owner_id);

alter table public.stores enable row level security;
alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Stores are viewable publicly" on public.stores;
drop policy if exists "Store owners manage their stores" on public.stores;
drop policy if exists "Public can view active products" on public.products;
drop policy if exists "Store owners manage their products" on public.products;
drop policy if exists "Customers can be read by store owners or checked out publicly" on public.customers;
drop policy if exists "Customers can be created for checkout" on public.customers;
drop policy if exists "Store owners manage their customers" on public.customers;
drop policy if exists "Store owners can view own orders" on public.orders;
drop policy if exists "Checkout can create orders" on public.orders;
drop policy if exists "Store owners can update their orders" on public.orders;
drop policy if exists "Store owners can view order items" on public.order_items;
drop policy if exists "Checkout can create order items" on public.order_items;
drop policy if exists "Store owners can update order items" on public.order_items;
drop policy if exists "Store owners can delete own order items" on public.order_items;

create policy "Public can view stores and owners can view own store"
on public.stores for select
using (auth.uid() is null or auth.uid() = owner_id);

create policy "Store owners manage their stores"
on public.stores for all
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create policy "Public can view active products"
on public.products for select
using (
  active = true
  and (
    auth.uid() is null
    or exists (
      select 1 from public.stores s
      where s.id = store_id and s.owner_id = auth.uid()
    )
  )
);

create policy "Store owners manage their products"
on public.products for all
using (exists (select 1 from public.stores s where s.id = store_id and s.owner_id = auth.uid()))
with check (exists (select 1 from public.stores s where s.id = store_id and s.owner_id = auth.uid()));

create policy "Store owners view their customers"
on public.customers for select
using (exists (select 1 from public.stores s where s.id = store_id and s.owner_id = auth.uid()));

create policy "Store owners manage their customers"
on public.customers for update
using (exists (select 1 from public.stores s where s.id = store_id and s.owner_id = auth.uid()))
with check (exists (select 1 from public.stores s where s.id = store_id and s.owner_id = auth.uid()));

create policy "Store owners can view own orders"
on public.orders for select
using (exists (select 1 from public.stores s where s.id = store_id and s.owner_id = auth.uid()));

create policy "Store owners can update their orders"
on public.orders for update
using (exists (select 1 from public.stores s where s.id = store_id and s.owner_id = auth.uid()))
with check (exists (select 1 from public.stores s where s.id = store_id and s.owner_id = auth.uid()));

create policy "Store owners can view order items"
on public.order_items for select
using (exists (
  select 1 from public.orders o
  join public.stores s on s.id = o.store_id
  where o.id = order_id and s.owner_id = auth.uid()
));

create policy "Store owners can update order items"
on public.order_items for update
using (exists (
  select 1 from public.orders o
  join public.stores s on s.id = o.store_id
  where o.id = order_id and s.owner_id = auth.uid()
))
with check (exists (
  select 1 from public.orders o
  join public.stores s on s.id = o.store_id
  where o.id = order_id and s.owner_id = auth.uid()
));

create policy "Store owners can delete own order items"
on public.order_items for delete
using (exists (
  select 1 from public.orders o
  join public.stores s on s.id = o.store_id
  where o.id = order_id and s.owner_id = auth.uid()
));

revoke insert on public.customers, public.orders, public.order_items from anon, authenticated;

create or replace function public.create_store_order(
  p_store_id uuid,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_customer_address text,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid;
  v_order_id uuid;
  v_subtotal numeric(10,2) := 0;
  v_item jsonb;
  v_product public.products%rowtype;
  v_quantity integer;
begin
  if not exists (select 1 from public.stores where id = p_store_id) then
    raise exception 'Store not found';
  end if;

  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Order must contain at least one item';
  end if;

  insert into public.customers (store_id, name, email, phone, address)
  values (p_store_id, trim(p_customer_name), lower(trim(p_customer_email)), nullif(trim(p_customer_phone), ''), trim(p_customer_address))
  on conflict (store_id, email) do update set
    name = excluded.name,
    phone = excluded.phone,
    address = excluded.address,
    updated_at = now()
  returning id into v_customer_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_quantity := (v_item->>'quantity')::integer;
    if v_quantity is null or v_quantity < 1 then
      raise exception 'Invalid item quantity';
    end if;

    select * into v_product
    from public.products
    where id = (v_item->>'product_id')::uuid
      and store_id = p_store_id
      and active = true
      and stock >= v_quantity;

    if not found then
      raise exception 'Product is unavailable or does not have enough stock';
    end if;

    v_subtotal := v_subtotal + (v_product.price * v_quantity);
  end loop;

  insert into public.orders (store_id, customer_id, status, payment_status, subtotal, shipping, total)
  values (p_store_id, v_customer_id, 'Paid', 'simulated', v_subtotal, 0, v_subtotal)
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select * into v_product from public.products where id = (v_item->>'product_id')::uuid;
    v_quantity := (v_item->>'quantity')::integer;
    insert into public.order_items (order_id, product_id, quantity, unit_price, total)
    values (v_order_id, v_product.id, v_quantity, v_product.price, v_product.price * v_quantity);
    update public.products set stock = stock - v_quantity where id = v_product.id;
  end loop;

  return v_order_id;
end;
$$;

revoke all on function public.create_store_order(uuid, text, text, text, text, jsonb) from public;
grant execute on function public.create_store_order(uuid, text, text, text, text, jsonb) to anon, authenticated;

do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'orders') then
    alter publication supabase_realtime add table public.orders;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'products') then
    alter publication supabase_realtime add table public.products;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'customers') then
    alter publication supabase_realtime add table public.customers;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'order_items') then
    alter publication supabase_realtime add table public.order_items;
  end if;
end $$;
