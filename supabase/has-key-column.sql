alter table public.scripts
  add column if not exists has_key boolean not null default false;

update public.scripts set has_key = true where slug = 'atherhub';
