do $$
declare
  negociacao_id uuid;
begin
  select id into negociacao_id
  from public.custom_objects
  where name = 'Negociação';

  if negociacao_id is null then
    return;
  end if;

  delete from public.custom_fields
  where object_id = negociacao_id
    and name not in (
      'Nome da negociação',
      'Valor total',
      'Valor único',
      'Funil',
      'Etapa do funil',
      'Qualificação',
      'Previsão de fechamento',
      'Fonte',
      'Campanha',
      'Data de criação'
    );

  update public.custom_fields
  set field_type = 'text',
      type_label = 'Texto curto',
      type_detail = '',
      description = '',
      is_required = true,
      is_primary = true,
      preference = 'Visível',
      position = 0,
      options = '[]'::jsonb
  where object_id = negociacao_id
    and name = 'Nome da negociação';

  insert into public.custom_fields (
    object_id, name, field_type, type_label, type_detail, is_required, is_primary, position
  )
  select negociacao_id, field.name, field.field_type, field.type_label, field.type_detail, false, false, field.position
  from (
    values
      ('Valor total'::text, 'number'::text, 'Decimal (moeda)'::text, ''::text, 1),
      ('Valor único', 'number', 'Decimal (moeda)', '', 2),
      ('Funil', 'option', 'Seleção única', 'Escolha de apenas um item', 3),
      ('Etapa do funil', 'option', 'Seleção única', 'Escolha de apenas um item', 4),
      ('Qualificação', 'option', 'Seleção única', 'Escolha de apenas um item', 5),
      ('Previsão de fechamento', 'date', 'Data', 'DD/MM/AAAA', 6),
      ('Fonte', 'text', 'Texto curto', '', 7),
      ('Campanha', 'text', 'Texto curto', '', 8),
      ('Data de criação', 'date', 'Data', 'DD/MM/AAAA', 9)
  ) as field(name, field_type, type_label, type_detail, position)
  where not exists (
    select 1
    from public.custom_fields existing
    where existing.object_id = negociacao_id
      and existing.name = field.name
  );
end $$;
