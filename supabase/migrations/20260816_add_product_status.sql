alter table public.products
  add column if not exists status text not null default 'Active';

create or replace function public.sync_product_status()
returns trigger as $$
begin
  new.active := new.status = 'Active';
  return new;
end;
$$ language plpgsql;

drop trigger if exists sync_product_status on public.products;

create trigger sync_product_status
  before insert or update of status on public.products
  for each row execute function public.sync_product_status();

update public.products
  set status = case when active then 'Active' else 'Draft' end
  where status = 'Active' or status = 'Draft';
