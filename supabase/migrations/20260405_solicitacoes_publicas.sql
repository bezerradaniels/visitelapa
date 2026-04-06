create extension if not exists pgcrypto;

create or replace function public.set_atualizado_em()
returns trigger
language plpgsql
as $$
begin
  new.atualizado_em = timezone('utc'::text, now());
  return new;
end;
$$;

create table if not exists public.solicitacoes_publicas (
  id uuid primary key default gen_random_uuid(),
  tipo text not null,
  titulo text not null default '',
  responsavel text not null default '',
  contato_email text not null default '',
  contato_whatsapp text not null default '',
  status text not null default 'pendente_aprovacao',
  payload jsonb not null default '{}'::jsonb,
  criado_em timestamptz not null default timezone('utc'::text, now()),
  atualizado_em timestamptz not null default timezone('utc'::text, now())
);

alter table public.solicitacoes_publicas
  add column if not exists tipo text not null default '',
  add column if not exists titulo text not null default '',
  add column if not exists responsavel text not null default '',
  add column if not exists contato_email text not null default '',
  add column if not exists contato_whatsapp text not null default '',
  add column if not exists status text not null default 'pendente_aprovacao',
  add column if not exists payload jsonb not null default '{}'::jsonb,
  add column if not exists criado_em timestamptz not null default timezone('utc'::text, now()),
  add column if not exists atualizado_em timestamptz not null default timezone('utc'::text, now());

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'solicitacoes_publicas_tipo_check'
  ) then
    alter table public.solicitacoes_publicas
      add constraint solicitacoes_publicas_tipo_check
      check (tipo in ('pacotes', 'eventos', 'hoteis', 'negocios', 'restaurantes'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'solicitacoes_publicas_status_check'
  ) then
    alter table public.solicitacoes_publicas
      add constraint solicitacoes_publicas_status_check
      check (status in ('rascunho', 'pendente_aprovacao', 'revisao', 'publicado', 'rejeitado', 'arquivado'));
  end if;
end;
$$;

create index if not exists solicitacoes_publicas_tipo_idx
  on public.solicitacoes_publicas (tipo);

create index if not exists solicitacoes_publicas_status_idx
  on public.solicitacoes_publicas (status);

create index if not exists solicitacoes_publicas_pendentes_criado_em_idx
  on public.solicitacoes_publicas (criado_em desc)
  where status = 'pendente_aprovacao';

drop trigger if exists set_solicitacoes_publicas_atualizado_em on public.solicitacoes_publicas;
create trigger set_solicitacoes_publicas_atualizado_em
before update on public.solicitacoes_publicas
for each row
execute function public.set_atualizado_em();
