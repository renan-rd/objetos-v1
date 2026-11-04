update custom_objects
set show_in_catalog = true,
    description = coalesce(nullif(trim(description), ''), 'Informações gerais dos leads.')
where name = 'Lead'
  and kind = 'padrao';
