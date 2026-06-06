-- Run in Supabase SQL Editor (adds optional customer budget to booking requests)
alter table public.bookings
  add column if not exists customer_budget text;
