do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'solicitacoes_publicas_tipo_check'
  ) then
    alter table public.solicitacoes_publicas
      drop constraint solicitacoes_publicas_tipo_check;
  end if;

  alter table public.solicitacoes_publicas
    add constraint solicitacoes_publicas_tipo_check
    check (tipo in ('pacotes', 'eventos', 'hoteis', 'negocios', 'restaurantes'));
end;
$$;
