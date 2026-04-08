"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import BarraFiltros from "@/componentes/filtros/barra-filtros";
import GradeCards from "@/componentes/listagem/grade-cards";
import CardListagem from "@/componentes/cards/card-listagem";
import CardNegocioPlay from "@/componentes/cards/card-negocio-play";
import CampoBusca from "@/componentes/ui/campo-busca";
import Paginacao from "@/componentes/listagem/paginacao";

type ItemListagem = {
  slug: string;
  username?: string;
  categoria: string;
  titulo: string;
  descricao: string;
  destaqueListagem: string;
  imagem?: string;
  logo?: string;
};

type Props = {
  filtros: { label: string }[];
  itens: ItemListagem[];
  baseHref: string;
  initialFilter?: string;
  variant?: "default" | "negocios-play";
};

const ITENS_POR_PAGINA = 6;

function resolverFiltroInicial(filtros: { label: string }[], initialFilter?: string) {
  if (!initialFilter) {
    return "Todos";
  }

  const filtroEncontrado = filtros.find(
    (filtro) => filtro.label.toLowerCase() === initialFilter.trim().toLowerCase()
  );

  return filtroEncontrado?.label ?? "Todos";
}

type ConteudoProps = {
  filtros: { label: string }[];
  itens: ItemListagem[];
  baseHref: string;
  initialFilter: string;
  variant: "default" | "negocios-play";
};

function ListagemFiltradaConteudo({
  filtros,
  itens,
  baseHref,
  initialFilter,
  variant,
}: ConteudoProps) {
  const [filtroAtivo, setFiltroAtivo] = useState(initialFilter);
  const [termoBusca, setTermoBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);

  function handleFiltroClick(label: string) {
    setFiltroAtivo(label);
    setPaginaAtual(1);
  }

  function handleBuscaChange(valor: string) {
    setTermoBusca(valor);
    setPaginaAtual(1);
  }

  const itensFiltrados = itens
    .filter((item) =>
      filtroAtivo === "Todos" ? true : item.categoria === filtroAtivo
    )
    .filter((item) => {
      if (!termoBusca) return true;
      const termo = termoBusca.toLowerCase();
      return (
        item.titulo.toLowerCase().includes(termo) ||
        item.descricao.toLowerCase().includes(termo)
      );
    });

  const totalPaginas = Math.ceil(itensFiltrados.length / ITENS_POR_PAGINA);
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const itensDaPagina = itensFiltrados.slice(inicio, inicio + ITENS_POR_PAGINA);

  return (
    <div>
      <BarraFiltros
        filtros={filtros.map((f) => ({ ...f, ativo: f.label === filtroAtivo }))}
        onFiltroClick={handleFiltroClick}
      />
      <div className="mx-auto w-full max-w-7xl px-4 py-5">
        <CampoBusca
          valor={termoBusca}
          onChange={handleBuscaChange}
          placeholder="Buscar por nome ou descrição..."
        />
      </div>
      {itensFiltrados.length === 0 ? (
        <div className="px-4 py-20 text-center text-gray-500">
          Nenhum resultado encontrado.
        </div>
      ) : (
        <>
          <GradeCards>
            {itensDaPagina.map((item) => {
              const key = item.slug || item.username || item.titulo;
              if (variant === "negocios-play") {
                const href = item.slug
                  ? `${baseHref}/${item.slug}`
                  : item.username
                  ? `/${item.username}`
                  : null;

                if (!href) return null;

                return (
                  <CardNegocioPlay
                    key={key}
                    href={href}
                    label={item.categoria}
                    titulo={item.titulo}
                    descricao={item.descricao}
                    logo={item.logo}
                  />
                );
              }

              return (
                <CardListagem
                  key={key}
                  href={`${baseHref}/${item.slug}`}
                  tag={item.categoria}
                  destaque={item.destaqueListagem}
                  titulo={item.titulo}
                  descricao={item.descricao}
                  imagem={item.imagem}
                />
              );
            })}
          </GradeCards>
          {totalPaginas > 1 && (
            <Paginacao
              paginaAtual={paginaAtual}
              totalPaginas={totalPaginas}
              onAnterior={() => setPaginaAtual((pagina) => Math.max(1, pagina - 1))}
              onProxima={() =>
                setPaginaAtual((pagina) => Math.min(totalPaginas, pagina + 1))
              }
            />
          )}
        </>
      )}
    </div>
  );
}

export default function ListagemFiltrada({
  filtros,
  itens,
  baseHref,
  initialFilter,
  variant = "default",
}: Props) {
  const filtroInicial = resolverFiltroInicial(filtros, initialFilter);

  return (
    <Suspense
      fallback={
        <ListagemFiltradaConteudo
          key={`fallback-${filtroInicial}`}
          filtros={filtros}
          itens={itens}
          baseHref={baseHref}
          initialFilter={filtroInicial}
          variant={variant}
        />
      }
    >
      <ListagemFiltradaComSearchParams
        filtros={filtros}
        itens={itens}
        baseHref={baseHref}
        initialFilter={initialFilter}
        variant={variant}
      />
    </Suspense>
  );
}

function ListagemFiltradaComSearchParams({
  filtros,
  itens,
  baseHref,
  initialFilter,
  variant = "default",
}: Props) {
  const searchParams = useSearchParams();
  const filtroDaUrl = searchParams.get("filtro") ?? initialFilter;
  const filtroInicial = resolverFiltroInicial(filtros, filtroDaUrl ?? undefined);

  return (
    <ListagemFiltradaConteudo
      key={filtroInicial}
      filtros={filtros}
      itens={itens}
      baseHref={baseHref}
      initialFilter={filtroInicial}
      variant={variant}
    />
  );
}
