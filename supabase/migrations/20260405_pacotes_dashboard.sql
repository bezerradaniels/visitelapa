create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

create table if not exists public.pacotes (
  id bigserial primary key,
  slug text not null unique,
  categoria text not null default '',
  titulo text not null default '',
  descricao text not null default '',
  imagem text not null default '',
  whatsapp text not null default '',
  instagram text not null default '',
  origem_cidade text not null default '',
  origem_estado text not null default '',
  destino_cidade text not null default '',
  destino_estado text not null default '',
  data_ida text not null default '',
  data_retorno text not null default '',
  valor_vista numeric(12, 2),
  valor_parcelado numeric(12, 2),
  parcelas integer,
  comodidades text[] not null default '{}',
  valor_final_parcelado numeric(12, 2),
  status text not null default 'publicado',
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.pacotes
  add column if not exists categoria text not null default '',
  add column if not exists titulo text not null default '',
  add column if not exists descricao text not null default '',
  add column if not exists imagem text not null default '',
  add column if not exists whatsapp text not null default '',
  add column if not exists instagram text not null default '',
  add column if not exists origem_cidade text not null default '',
  add column if not exists origem_estado text not null default '',
  add column if not exists destino_cidade text not null default '',
  add column if not exists destino_estado text not null default '',
  add column if not exists data_ida text not null default '',
  add column if not exists data_retorno text not null default '',
  add column if not exists valor_vista numeric(12, 2),
  add column if not exists valor_parcelado numeric(12, 2),
  add column if not exists parcelas integer,
  add column if not exists comodidades text[] not null default '{}',
  add column if not exists valor_final_parcelado numeric(12, 2),
  add column if not exists status text not null default 'publicado',
  add column if not exists created_at timestamptz not null default timezone('utc'::text, now()),
  add column if not exists updated_at timestamptz not null default timezone('utc'::text, now());

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'pacotes_status_check'
  ) then
    alter table public.pacotes
      add constraint pacotes_status_check
      check (status in ('rascunho', 'pendente_aprovacao', 'revisao', 'publicado', 'rejeitado', 'arquivado'));
  end if;
end;
$$;

create index if not exists pacotes_status_idx
  on public.pacotes (status);

create index if not exists pacotes_data_ida_idx
  on public.pacotes (data_ida);

drop trigger if exists set_pacotes_updated_at on public.pacotes;
create trigger set_pacotes_updated_at
before update on public.pacotes
for each row
execute function public.set_updated_at();
