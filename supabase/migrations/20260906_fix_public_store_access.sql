-- Fix RLS policies so public store pages remain accessible to all visitors.
-- Run this migration in the Supabase SQL Editor.

drop policy if exists "Public can view stores and owners can view own store" on public.stores;
drop policy if exists "Public can view active products" on public.products;

create policy "Stores are viewable publicly"
on public.stores
for select
using (true);

create policy "Public can view active products"
on public.products
for select
using (active = true);
