-- Patch existing tables to support the current web/admin flow.
-- Safe to run multiple times.

create extension if not exists "pgcrypto";

alter table if exists public.customers
  add column if not exists id uuid primary key default gen_random_uuid(),
  add column if not exists full_name text not null default '',
  add column if not exists phone text,
  add column if not exists email text,
  add column if not exists created_at timestamptz not null default now();

alter table if exists public.addresses
  add column if not exists id uuid primary key default gen_random_uuid(),
  add column if not exists customer_id uuid,
  add column if not exists address_line text,
  add column if not exists subdistrict text,
  add column if not exists district text,
  add column if not exists province text,
  add column if not exists zipcode text,
  add column if not exists full_address text,
  add column if not exists created_at timestamptz not null default now();

alter table if exists public.orders
  add column if not exists id uuid primary key default gen_random_uuid(),
  add column if not exists order_no text unique,
  add column if not exists customer_id uuid,
  add column if not exists address_id uuid,
  add column if not exists status text not null default 'Pending',
  add column if not exists subtotal numeric(12, 2) not null default 0,
  add column if not exists shipping numeric(12, 2) not null default 0,
  add column if not exists total numeric(12, 2) not null default 0,
  add column if not exists admin_note text,
  add column if not exists tracking_no text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table if exists public.order_items
  add column if not exists id bigint generated always as identity primary key,
  add column if not exists order_id uuid,
  add column if not exists product_id text,
  add column if not exists product_name text not null default '',
  add column if not exists product_image text,
  add column if not exists unit_price numeric(12, 2) not null default 0,
  add column if not exists quantity integer not null default 1,
  add column if not exists line_total numeric(12, 2) not null default 0,
  add column if not exists created_at timestamptz not null default now();

alter table if exists public.payments
  add column if not exists id uuid primary key default gen_random_uuid(),
  add column if not exists order_id uuid,
  add column if not exists method text,
  add column if not exists status text,
  add column if not exists reference_no text,
  add column if not exists paid_at timestamptz,
  add column if not exists payload jsonb,
  add column if not exists created_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1
    from information_schema.table_constraints
    where table_schema = 'public'
      and table_name = 'addresses'
      and constraint_name = 'addresses_customer_id_fkey'
  ) then
    alter table public.addresses
      add constraint addresses_customer_id_fkey
      foreign key (customer_id) references public.customers(id) on delete set null;
  end if;
end$$;

do $$
begin
  if not exists (
    select 1
    from information_schema.table_constraints
    where table_schema = 'public'
      and table_name = 'orders'
      and constraint_name = 'orders_customer_id_fkey'
  ) then
    alter table public.orders
      add constraint orders_customer_id_fkey
      foreign key (customer_id) references public.customers(id) on delete set null;
  end if;

  if not exists (
    select 1
    from information_schema.table_constraints
    where table_schema = 'public'
      and table_name = 'orders'
      and constraint_name = 'orders_address_id_fkey'
  ) then
    alter table public.orders
      add constraint orders_address_id_fkey
      foreign key (address_id) references public.addresses(id) on delete set null;
  end if;
end$$;

do $$
begin
  if not exists (
    select 1
    from information_schema.table_constraints
    where table_schema = 'public'
      and table_name = 'order_items'
      and constraint_name = 'order_items_order_id_fkey'
  ) then
    alter table public.order_items
      add constraint order_items_order_id_fkey
      foreign key (order_id) references public.orders(id) on delete cascade;
  end if;
end$$;

do $$
begin
  if not exists (
    select 1
    from information_schema.table_constraints
    where table_schema = 'public'
      and table_name = 'payments'
      and constraint_name = 'payments_order_id_fkey'
  ) then
    alter table public.payments
      add constraint payments_order_id_fkey
      foreign key (order_id) references public.orders(id) on delete cascade;
  end if;
end$$;

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

alter table public.customers enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;

drop policy if exists "customers_all" on public.customers;
create policy "customers_all" on public.customers for all using (true) with check (true);

drop policy if exists "addresses_all" on public.addresses;
create policy "addresses_all" on public.addresses for all using (true) with check (true);

drop policy if exists "orders_all" on public.orders;
create policy "orders_all" on public.orders for all using (true) with check (true);

drop policy if exists "order_items_all" on public.order_items;
create policy "order_items_all" on public.order_items for all using (true) with check (true);

drop policy if exists "payments_all" on public.payments;
create policy "payments_all" on public.payments for all using (true) with check (true);

