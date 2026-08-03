create or replace function public.auto_confirm_email()
returns trigger as $$
begin
  new.email_confirmed_at = coalesce(new.email_confirmed_at, now());
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists auto_confirm_email_trigger on auth.users;

create trigger auto_confirm_email_trigger
before insert on auth.users
for each row execute function public.auto_confirm_email();
