create table public.scripts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tag text not null,
  description text not null,
  meta_description text not null,
  copy_command text not null,
  cover_path text not null,
  categories text[] not null default '{}',
  is_paid boolean not null default false,
  origin text not null default 'script pessoal',
  sort_order int not null,
  created_at timestamptz not null default now()
);

alter table public.scripts enable row level security;

create policy "Public read access"
  on public.scripts for select
  to anon, authenticated
  using (true);
