do $$
declare
  lead_id uuid;
begin
  select id into lead_id
  from public.custom_objects
  where name = 'Lead';

  if lead_id is null then
    return;
  end if;

  delete from public.custom_fields
  where object_id = lead_id
    and name not in (
      'Nome do lead',
      'Etapa',
      'Fonte',
      'Campanha'
    );

  insert into public.custom_fields (
    object_id, name, field_type, type_label, type_detail, description,
    is_required, is_primary, preference, position, options
  )
  values
    (
      lead_id, 'Nome do lead', 'text', 'Texto curto', '', '',
      true, true, 'Visível', 0, '[]'::jsonb
    ),
    (
      lead_id, 'Etapa', 'option', 'Seleção única', 'Escolha de apenas um item', '',
      true, false, '', 1,
      '["Novo","Tentativa de contato","Em qualificação","Pronto para negociação","Descartado"]'::jsonb
    ),
    (
      lead_id, 'Fonte', 'text', 'Texto curto', '', '',
      false, false, '', 2, '[]'::jsonb
    ),
    (
      lead_id, 'Campanha', 'text', 'Texto curto', '', '',
      false, false, '', 3, '[]'::jsonb
    )
  on conflict (object_id, name) do update
  set field_type = excluded.field_type,
      type_label = excluded.type_label,
      type_detail = excluded.type_detail,
      description = excluded.description,
      is_required = excluded.is_required,
      is_primary = excluded.is_primary,
      preference = excluded.preference,
      position = excluded.position,
      options = excluded.options;
end $$;
