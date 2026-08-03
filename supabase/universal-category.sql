update public.scripts
set categories = array_append(categories, 'universal')
where slug in ('atherhub', 'explhub')
  and not ('universal' = any(categories));
