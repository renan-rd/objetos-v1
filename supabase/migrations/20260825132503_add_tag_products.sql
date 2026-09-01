alter table public.claude_tags
  add column if not exists produto text;

update public.claude_tags
set produto = case
  when lower(label) in ('campeão', 'evento', 'nutrição', 'reativação', 'trial')
    then 'RD Marketing'
  when lower(label) in ('churn', 'detrator')
    then 'RD Atendimento'
  else 'RD Vendas'
end
where produto is null;

alter table public.claude_tags
  alter column produto set default 'RD Vendas',
  alter column produto set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'claude_tags_produto_check'
      and conrelid = 'public.claude_tags'::regclass
  ) then
    alter table public.claude_tags
      add constraint claude_tags_produto_check
      check (produto in ('RD Marketing', 'RD Atendimento', 'RD Vendas'));
  end if;
end
$$;

create index if not exists claude_tags_produto_label_idx
  on public.claude_tags (produto, label);

with seed(label, color, produto) as (
  values
    ('Lead engajado', '#E60F57', 'RD Marketing'),
    ('Lead inativo', '#7F8D99', 'RD Marketing'),
    ('MQL', '#0077B2', 'RD Marketing'),
    ('Conversão pendente', '#FF9800', 'RD Marketing'),
    ('Campanha ativa', '#43A047', 'RD Marketing'),
    ('Newsletter', '#6C63FF', 'RD Marketing'),
    ('Webinar', '#00ACC1', 'RD Marketing'),
    ('E-book', '#3F51B5', 'RD Marketing'),
    ('Segmentação', '#9C27B0', 'RD Marketing'),
    ('Automação', '#00897B', 'RD Marketing'),
    ('Landing page', '#FFB300', 'RD Marketing'),
    ('Lead scoring', '#D32F2F', 'RD Marketing'),
    ('Atendimento prioritário', '#E60F57', 'RD Atendimento'),
    ('SLA crítico', '#D32F2F', 'RD Atendimento'),
    ('Aguardando cliente', '#FF9800', 'RD Atendimento'),
    ('Em atendimento', '#0077B2', 'RD Atendimento'),
    ('Resolvido', '#43A047', 'RD Atendimento'),
    ('Reaberto', '#9C27B0', 'RD Atendimento'),
    ('Escalado N2', '#6C63FF', 'RD Atendimento'),
    ('Escalado N3', '#3F51B5', 'RD Atendimento'),
    ('CSAT positivo', '#00897B', 'RD Atendimento'),
    ('CSAT negativo', '#E60F57', 'RD Atendimento'),
    ('WhatsApp', '#43A047', 'RD Atendimento'),
    ('Chat', '#00ACC1', 'RD Atendimento'),
    ('Prospecção', '#0077B2', 'RD Vendas'),
    ('Qualificação', '#6C63FF', 'RD Vendas'),
    ('Demonstração agendada', '#00ACC1', 'RD Vendas'),
    ('Proposta enviada', '#FF9800', 'RD Vendas'),
    ('Negociação', '#9C27B0', 'RD Vendas'),
    ('Fechamento', '#3F51B5', 'RD Vendas'),
    ('Ganho', '#43A047', 'RD Vendas'),
    ('Perdido', '#D32F2F', 'RD Vendas'),
    ('Renovação', '#00897B', 'RD Vendas'),
    ('Expansão', '#FFB300', 'RD Vendas'),
    ('Pipeline alto', '#E60F57', 'RD Vendas'),
    ('Forecast', '#795548', 'RD Vendas')
)
insert into public.claude_tags (label, color, produto)
select seed.label, seed.color, seed.produto
from seed
where not exists (
  select 1
  from public.claude_tags existing
  where lower(existing.label) = lower(seed.label)
);

with seed(label, produto) as (
  values
    ('Campeão', 'RD Marketing'),
    ('Evento', 'RD Marketing'),
    ('Nutrição', 'RD Marketing'),
    ('Reativação', 'RD Marketing'),
    ('Trial', 'RD Marketing'),
    ('Churn', 'RD Atendimento'),
    ('Detrator', 'RD Atendimento'),
    ('Cross-sell', 'RD Vendas'),
    ('Decisor', 'RD Vendas'),
    ('Influenciador', 'RD Vendas'),
    ('Parceiro', 'RD Vendas'),
    ('Premium', 'RD Vendas'),
    ('Revisão', 'RD Vendas'),
    ('Upsell', 'RD Vendas')
)
update public.claude_tags tag
set produto = seed.produto
from seed
where lower(tag.label) = lower(seed.label);
