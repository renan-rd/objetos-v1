-- Links a contact to one or more existing companies.
create table public.claude_contato_empresas (
  contato_id uuid not null references public.claude_contatos(id) on delete cascade,
  empresa_id uuid not null references public.claude_empresas(id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (contato_id, empresa_id)
);

comment on table public.claude_contato_empresas is
  'Empresas vinculadas a cada contato. Um contato pode ter mais de uma empresa.';

create index claude_contato_empresas_empresa_id_idx
  on public.claude_contato_empresas (empresa_id);

alter table public.claude_contato_empresas enable row level security;

create policy auth_select on public.claude_contato_empresas
  for select to authenticated using (true);
create policy auth_insert on public.claude_contato_empresas
  for insert to authenticated with check (true);
create policy auth_update on public.claude_contato_empresas
  for update to authenticated using (true) with check (true);
create policy auth_delete on public.claude_contato_empresas
  for delete to authenticated using (true);

grant select, insert, update, delete on public.claude_contato_empresas to anon, authenticated, service_role;

insert into public.claude_contato_empresas (contato_id, empresa_id)
select contatos.id, contatos.empresa_id
from public.claude_contatos as contatos
join public.claude_empresas as empresas on empresas.id = contatos.empresa_id
where contatos.empresa_id is not null
on conflict do nothing;
