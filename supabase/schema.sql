-- Run this script in Supabase SQL Editor.
-- It creates tables for orders + order items used by the web and admin pages.

create extension if not exists "pgcrypto";

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  app_order_id text not null unique,
  order_date timestamptz not null default now(),

  customer_name text not null,
  customer_phone text,
  customer_email text,
  customer_address text,

  subtotal numeric(12, 2) not null default 0,
  shipping numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,

  payment_method text,
  payment_timestamp timestamptz,
  payment_reference_no text,

  status text not null default 'Pending',
  admin_note text,
  tracking_no text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders(id) on delete cascade,

  product_id text,
  product_name text not null,
  product_image text,
  unit_price numeric(12, 2) not null default 0,
  quantity integer not null default 1,
  line_total numeric(12, 2) not null default 0,

  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

-- Optional analytics view for quick reporting
create or replace view public.v_product_sales_summary as
select
  oi.product_id,
  oi.product_name,
  sum(oi.quantity) as total_quantity,
  sum(oi.line_total) as total_revenue
from public.order_items oi
group by oi.product_id, oi.product_name
order by total_quantity desc, total_revenue desc;

-- Basic RLS: allow client app to read/write only order tables.
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "orders_select_all" on public.orders;
create policy "orders_select_all"
on public.orders for select
using (true);

drop policy if exists "orders_insert_all" on public.orders;
create policy "orders_insert_all"
on public.orders for insert
with check (true);

drop policy if exists "orders_update_all" on public.orders;
create policy "orders_update_all"
on public.orders for update
using (true)
with check (true);

drop policy if exists "orders_delete_all" on public.orders;
create policy "orders_delete_all"
on public.orders for delete
using (true);

drop policy if exists "order_items_select_all" on public.order_items;
create policy "order_items_select_all"
on public.order_items for select
using (true);

drop policy if exists "order_items_insert_all" on public.order_items;
create policy "order_items_insert_all"
on public.order_items for insert
with check (true);

drop policy if exists "order_items_update_all" on public.order_items;
create policy "order_items_update_all"
on public.order_items for update
using (true)
with check (true);

drop policy if exists "order_items_delete_all" on public.order_items;
create policy "order_items_delete_all"
on public.order_items for delete
using (true);

