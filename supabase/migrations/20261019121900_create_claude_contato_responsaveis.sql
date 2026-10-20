-- Catalog of people that can be assigned as a contact owner.
create table public.claude_responsaveis (
  id text primary key,
  nome text not null,
  email text not null unique,
  papel text not null,
  avatar text,
  cor text not null default '#405466',
  ordem integer not null,
  created_at timestamptz not null default now(),
  constraint claude_responsaveis_nome_check check (length(btrim(nome)) > 0),
  constraint claude_responsaveis_email_check check (position('@' in email) > 1),
  constraint claude_responsaveis_papel_check check (length(btrim(papel)) > 0),
  constraint claude_responsaveis_cor_check check (cor ~* '^#[0-9A-Fa-f]{6}$')
);

comment on table public.claude_responsaveis is
  'Pessoas que podem ser responsáveis por um contato.';

-- Assignment of a responsible person to an existing contact.
create table public.claude_contato_responsaveis (
  contato_id uuid not null references public.claude_contatos(id) on delete cascade,
  responsavel_id text not null references public.claude_responsaveis(id) on delete restrict,
  papel text not null,
  created_at timestamptz not null default now(),
  primary key (contato_id, responsavel_id),
  constraint claude_contato_responsaveis_papel_check check (length(btrim(papel)) > 0)
);

comment on table public.claude_contato_responsaveis is
  'Responsáveis atribuídos a cada contato. Contatos criados depois desta migration começam sem linhas aqui.';

create index claude_contato_responsaveis_responsavel_id_idx
  on public.claude_contato_responsaveis (responsavel_id);

alter table public.claude_responsaveis enable row level security;
alter table public.claude_contato_responsaveis enable row level security;

create policy auth_select on public.claude_responsaveis
  for select to authenticated using (true);
create policy auth_insert on public.claude_responsaveis
  for insert to authenticated with check (true);
create policy auth_update on public.claude_responsaveis
  for update to authenticated using (true) with check (true);
create policy auth_delete on public.claude_responsaveis
  for delete to authenticated using (true);

create policy auth_select on public.claude_contato_responsaveis
  for select to authenticated using (true);
create policy auth_insert on public.claude_contato_responsaveis
  for insert to authenticated with check (true);
create policy auth_update on public.claude_contato_responsaveis
  for update to authenticated using (true) with check (true);
create policy auth_delete on public.claude_contato_responsaveis
  for delete to authenticated using (true);

grant select, insert, update, delete on public.claude_responsaveis to anon, authenticated, service_role;
grant select, insert, update, delete on public.claude_contato_responsaveis to anon, authenticated, service_role;

insert into public.claude_responsaveis (id, nome, email, papel, avatar, cor, ordem)
values
  ('guilherme-bossa', 'Guilherme Bossa', 'guilherme.bossa@rdstation.com', 'Responsável de Vendas', 'Avatar-Guilherme.png', '#0088CC', 1),
  ('renata-alves', 'Renata Alves', 'renata.alves@rdstation.com', 'Responsável de Marketing', 'Avatar-Renata.png', '#E60F57', 2),
  ('victor-felipe', 'Victor Felipe', 'victor.felipe@rdstation.com', 'Responsável por Atendimento', 'Avatar-Victor.png', '#08783E', 3),
  ('ana-mendes', 'Ana Paula Mendes', 'ana.mendes@rdstation.com', 'Responsável de Vendas', null, '#00ACC1', 4),
  ('bruno-carvalho', 'Bruno Carvalho', 'bruno.carvalho@rdstation.com', 'Responsável de Vendas', null, '#6F00C7', 5),
  ('camila-ferreira', 'Camila Ferreira', 'camila.ferreira@rdstation.com', 'Responsável de Vendas', null, '#E60F57', 6),
  ('diego-souza', 'Diego Souza', 'diego.souza@rdstation.com', 'Responsável de Vendas', null, '#08783E', 7),
  ('fernanda-lima', 'Fernanda Lima', 'fernanda.lima@rdstation.com', 'Responsável de Vendas', null, '#FF8A00', 8),
  ('henrique-costa', 'Henrique Costa', 'henrique.costa@rdstation.com', 'Responsável de Vendas', null, '#0077B2', 9),
  ('juliana-rocha', 'Juliana Rocha', 'juliana.rocha@rdstation.com', 'Responsável de Vendas', null, '#9C27B0', 10),
  ('lucas-martins', 'Lucas Martins', 'lucas.martins@rdstation.com', 'Responsável de Vendas', null, '#00897B', 11),
  ('marina-oliveira', 'Marina Oliveira', 'marina.oliveira@rdstation.com', 'Responsável de Vendas', null, '#D32F2F', 12),
  ('pedro-alves', 'Pedro Henrique Alves', 'pedro.alves@rdstation.com', 'Responsável de Vendas', null, '#3F51B5', 13);

-- Preserve the three people currently shown on every existing contact.
insert into public.claude_contato_responsaveis (contato_id, responsavel_id, papel)
select contatos.id, responsaveis.id, responsaveis.papel
from public.claude_contatos as contatos
cross join public.claude_responsaveis as responsaveis
where responsaveis.id in ('guilherme-bossa', 'renata-alves', 'victor-felipe');
