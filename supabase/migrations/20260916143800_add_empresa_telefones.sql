alter table public.claude_empresas
  add column if not exists telefones jsonb default '[]'::jsonb;

update public.claude_empresas
set telefones = jsonb_build_array(
  jsonb_build_object('numero', telefone, 'tipo', coalesce(telefone_tipo, 'Comercial'))
)
where coalesce(telefone, '') <> ''
  and (telefones is null or telefones = '[]'::jsonb);
