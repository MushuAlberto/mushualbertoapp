
-- Create the push_subscriptions table to store web push subscriptions
create table public.push_subscriptions (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null,
  subscription jsonb not null,
  created_at timestamp with time zone not null default now()
);

-- Add a basic index for easier lookup (not required but recommended)
create index idx_push_subscriptions_user_id on public.push_subscriptions(user_id);

-- Enable RLS
alter table public.push_subscriptions enable row level security;

-- Allow users to insert/update/select/delete only their own records
create policy "Only owner can view their push subscriptions" on public.push_subscriptions
  for select using (auth.uid() = user_id);
create policy "Only owner can insert their push subscription" on public.push_subscriptions
  for insert with check (auth.uid() = user_id);
create policy "Only owner can update their push subscription" on public.push_subscriptions
  for update using (auth.uid() = user_id);
create policy "Only owner can delete their push subscription" on public.push_subscriptions
  for delete using (auth.uid() = user_id);
