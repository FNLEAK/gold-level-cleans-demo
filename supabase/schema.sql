-- Run this in Supabase → SQL Editor
-- Gold Level Cleans: profiles + bookings with RLS

create extension if not exists "pgcrypto";

-- ─── Profiles (linked to Supabase Auth) ─────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'customer' check (role in ('owner', 'customer')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.is_owner()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'owner'
  );
$$;

create or replace function public.current_user_email()
returns text
language sql
security definer
stable
set search_path = public
as $$
  select email from public.profiles where id = auth.uid();
$$;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Owners can read all profiles"
  on public.profiles for select
  using ((select public.is_owner()));

-- ─── Bookings ─────────────────────────────────────────────────────────────
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  scheduled_date date not null,
  start_time time,
  service text,
  notes text,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled')),
  source text not null default 'online'
    check (source in ('online', 'owner')),
  customer_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bookings_scheduled_date_idx on public.bookings (scheduled_date);
create index if not exists bookings_status_idx on public.bookings (status);
create index if not exists bookings_email_idx on public.bookings (customer_email);

alter table public.bookings enable row level security;

-- Anyone (including guests) can submit a booking request
create policy "Public can insert pending bookings"
  on public.bookings for insert
  with check (status = 'pending');

-- Owners can read all bookings
create policy "Owners can read all bookings"
  on public.bookings for select
  using ((select public.is_owner()));

-- Public can read active bookings (weekly availability on Book Now page)
create policy "Public can read active bookings for availability"
  on public.bookings for select
  using (status in ('pending', 'confirmed'));

-- Owners can update bookings (confirm / cancel)
create policy "Owners can update bookings"
  on public.bookings for update
  using ((select public.is_owner()));

-- Customers see their own bookings by email
create policy "Customers can read own bookings"
  on public.bookings for select
  using (
    customer_email = (select public.current_user_email())
  );

-- Owners can insert confirmed/owner bookings directly
create policy "Owners can insert bookings"
  on public.bookings for insert
  with check ((select public.is_owner()));

-- ─── Auto-create profile on signup ────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Set owner role (run once for Mykala after creating auth user) ────────
-- update public.profiles set role = 'owner', full_name = 'Mykala Ashbaugh'
-- where email = 'MykalaAshbaugh353@gmail.com';
