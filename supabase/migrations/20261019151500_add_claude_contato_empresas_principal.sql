-- One linked company is the contact's principal company.
alter table public.claude_contato_empresas
  add column principal boolean not null default false;

comment on column public.claude_contato_empresas.principal is
  'Empresa principal do contato. No máximo uma associação por contato.';

update public.claude_contato_empresas as vinculo
set principal = true
from public.claude_contatos as contato
where contato.id = vinculo.contato_id
  and contato.empresa_id = vinculo.empresa_id;

update public.claude_contato_empresas as vinculo
set principal = true
where (vinculo.contato_id, vinculo.empresa_id) in (
  select distinct on (outro.contato_id) outro.contato_id, outro.empresa_id
  from public.claude_contato_empresas as outro
  where not exists (
    select 1
    from public.claude_contato_empresas as marcada
    where marcada.contato_id = outro.contato_id
      and marcada.principal
  )
  order by outro.contato_id, outro.created_at, outro.empresa_id
);

create unique index claude_contato_empresas_one_principal_idx
  on public.claude_contato_empresas (contato_id)
  where principal;
