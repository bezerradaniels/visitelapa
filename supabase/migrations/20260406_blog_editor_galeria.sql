alter table if exists public.blog_posts
add column if not exists conteudo_html text;

alter table if exists public.blog_posts
add column if not exists galeria jsonb not null default '[]'::jsonb;

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'blog_posts'
  ) then
    update public.blog_posts
    set galeria = '[]'::jsonb
    where galeria is null;
  end if;
end
$$;
