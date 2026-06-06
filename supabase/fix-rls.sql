-- Run this in Supabase → SQL Editor (fixes infinite recursion + guest booking reads)
-- Safe to run after schema.sql

-- Helper: check owner role without triggering RLS recursion
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

-- Helper: current user's email without RLS recursion
create or replace function public.current_user_email()
returns text
language sql
security definer
stable
set search_path = public
as $$
  select email from public.profiles where id = auth.uid();
$$;

-- ─── Fix profiles policies ─────────────────────────────────────────────────
drop policy if exists "Owners can read all profiles" on public.profiles;
create policy "Owners can read all profiles"
  on public.profiles for select
  using ((select public.is_owner()));

-- ─── Fix bookings policies ─────────────────────────────────────────────────
drop policy if exists "Owners can read all bookings" on public.bookings;
create policy "Owners can read all bookings"
  on public.bookings for select
  using ((select public.is_owner()));

drop policy if exists "Owners can update bookings" on public.bookings;
create policy "Owners can update bookings"
  on public.bookings for update
  using ((select public.is_owner()));

drop policy if exists "Customers can read own bookings" on public.bookings;
create policy "Customers can read own bookings"
  on public.bookings for select
  using (
    customer_email = (select public.current_user_email())
  );

drop policy if exists "Owners can insert bookings" on public.bookings;
create policy "Owners can insert bookings"
  on public.bookings for insert
  with check ((select public.is_owner()));

-- Guests need to read active bookings for weekly availability on the Book Now page
drop policy if exists "Public can read active bookings for availability" on public.bookings;
create policy "Public can read active bookings for availability"
  on public.bookings for select
  using (status in ('pending', 'confirmed'));
