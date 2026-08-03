alter table public.scripts
  add column if not exists views int not null default 0,
  add column if not exists likes int not null default 0;

create or replace function public.increment_views(p_slug text)
returns void as $$
begin
  update public.scripts set views = views + 1 where slug = p_slug;
end;
$$ language plpgsql security definer;

create or replace function public.increment_likes(p_slug text)
returns int as $$
declare
  new_likes int;
begin
  update public.scripts set likes = likes + 1 where slug = p_slug
  returning likes into new_likes;
  return new_likes;
end;
$$ language plpgsql security definer;

grant execute on function public.increment_views(text) to anon, authenticated;
grant execute on function public.increment_likes(text) to anon, authenticated;
