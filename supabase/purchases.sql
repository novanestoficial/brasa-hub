create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_session_id text unique,
  created_at timestamptz not null default now()
);

alter table public.purchases enable row level security;

create policy "Users can read own purchases"
  on public.purchases for select
  to authenticated
  using (auth.uid() = user_id);
