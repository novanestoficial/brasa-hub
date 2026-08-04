create table if not exists public.site_stats (
  id int primary key default 1,
  total_visits int not null default 0,
  constraint single_row check (id = 1)
);

insert into public.site_stats (id, total_visits)
values (1, 0)
on conflict (id) do nothing;

create table if not exists public.visit_log (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

alter table public.site_stats enable row level security;
alter table public.visit_log enable row level security;
-- Sem policies de select/insert/update pra anon/authenticated: só o service role
-- (usado exclusivamente no servidor, nunca no navegador) consegue ler essas tabelas.

create or replace function public.log_site_visit()
returns void as $$
begin
  update public.site_stats set total_visits = total_visits + 1 where id = 1;
  insert into public.visit_log default values;
end;
$$ language plpgsql security definer;

grant execute on function public.log_site_visit() to anon, authenticated;
