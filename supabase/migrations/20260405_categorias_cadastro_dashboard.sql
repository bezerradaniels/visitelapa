create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

create table if not exists public.categorias_cadastro (
  id uuid primary key default gen_random_uuid(),
  tipo_cadastro text not null,
  nome text not null,
  slug text not null,
  descricao text not null default '',
  status text not null default 'publicado',
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.categorias_cadastro
  add column if not exists tipo_cadastro text not null default 'negocios',
  add column if not exists nome text not null default '',
  add column if not exists slug text not null default '',
  add column if not exists descricao text not null default '',
  add column if not exists status text not null default 'publicado',
  add column if not exists created_at timestamptz not null default timezone('utc'::text, now()),
  add column if not exists updated_at timestamptz not null default timezone('utc'::text, now());

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'categorias_cadastro_tipo_check'
  ) then
    alter table public.categorias_cadastro
      add constraint categorias_cadastro_tipo_check
      check (tipo_cadastro in ('pacotes', 'eventos', 'hoteis', 'negocios', 'restaurantes'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'categorias_cadastro_status_check'
  ) then
    alter table public.categorias_cadastro
      add constraint categorias_cadastro_status_check
      check (status in ('rascunho', 'pendente_aprovacao', 'revisao', 'publicado', 'rejeitado', 'arquivado'));
  end if;
end;
$$;

create unique index if not exists categorias_cadastro_tipo_slug_key
  on public.categorias_cadastro (tipo_cadastro, slug);

create index if not exists categorias_cadastro_tipo_nome_idx
  on public.categorias_cadastro (tipo_cadastro, nome);

drop trigger if exists set_categorias_cadastro_updated_at on public.categorias_cadastro;
create trigger set_categorias_cadastro_updated_at
before update on public.categorias_cadastro
for each row
execute function public.set_updated_at();

insert into public.categorias_cadastro (tipo_cadastro, nome, slug, descricao, status)
values
  ('pacotes', 'Eventos', 'eventos', '', 'publicado'),
  ('pacotes', 'Hotéis', 'hoteis', '', 'publicado'),
  ('pacotes', 'Negócios', 'negocios', '', 'publicado'),
  ('pacotes', 'Pacotes', 'pacotes', '', 'publicado'),
  ('pacotes', 'Restaurante', 'restaurante', '', 'publicado'),
  ('eventos', 'Religioso', 'religioso', '', 'publicado'),
  ('eventos', 'Cultural', 'cultural', '', 'publicado'),
  ('eventos', 'Empresarial', 'empresarial', '', 'publicado'),
  ('eventos', 'Esportivo', 'esportivo', '', 'publicado'),
  ('hoteis', 'Hotel', 'hotel', '', 'publicado'),
  ('hoteis', 'Pousada', 'pousada', '', 'publicado'),
  ('hoteis', 'Hostel', 'hostel', '', 'publicado'),
  ('hoteis', 'Apart-hotel', 'apart-hotel', '', 'publicado'),
  ('hoteis', 'Flat', 'flat', '', 'publicado'),
  ('negocios', 'Eventos', 'eventos', '', 'publicado'),
  ('negocios', 'Hotéis', 'hoteis', '', 'publicado'),
  ('negocios', 'Negócios', 'negocios', '', 'publicado'),
  ('negocios', 'Pacotes', 'pacotes', '', 'publicado'),
  ('negocios', 'Restaurante', 'restaurante', '', 'publicado'),
  ('restaurantes', 'Restaurante', 'restaurante', '', 'publicado'),
  ('restaurantes', 'Comida regional', 'comida-regional', '', 'publicado'),
  ('restaurantes', 'Self-service', 'self-service', '', 'publicado'),
  ('restaurantes', 'Churrascaria', 'churrascaria', '', 'publicado'),
  ('restaurantes', 'Pizzaria', 'pizzaria', '', 'publicado'),
  ('restaurantes', 'Hamburgueria', 'hamburgueria', '', 'publicado'),
  ('restaurantes', 'Lanchonete', 'lanchonete', '', 'publicado'),
  ('restaurantes', 'Cafeteria', 'cafeteria', '', 'publicado'),
  ('restaurantes', 'Padaria', 'padaria', '', 'publicado'),
  ('restaurantes', 'Sorveteria', 'sorveteria', '', 'publicado'),
  ('restaurantes', 'Doceria', 'doceria', '', 'publicado'),
  ('restaurantes', 'Bistrô', 'bistro', '', 'publicado')
on conflict (tipo_cadastro, slug) do update
set
  nome = excluded.nome,
  descricao = excluded.descricao,
  status = excluded.status,
  updated_at = timezone('utc'::text, now());
