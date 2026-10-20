-- One assigned person is the contact's principal responsible.
alter table public.claude_contato_responsaveis
  add column principal boolean not null default false;

comment on column public.claude_contato_responsaveis.principal is
  'Responsável principal do contato. No máximo um por contato.';

update public.claude_contato_responsaveis as vinculo
set principal = true
where (vinculo.contato_id, vinculo.responsavel_id) in (
  select distinct on (outro.contato_id) outro.contato_id, outro.responsavel_id
  from public.claude_contato_responsaveis as outro
  join public.claude_responsaveis as pessoa on pessoa.id = outro.responsavel_id
  order by outro.contato_id, pessoa.ordem, outro.responsavel_id
);

create unique index claude_contato_responsaveis_one_principal_idx
  on public.claude_contato_responsaveis (contato_id)
  where principal;
