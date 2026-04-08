"use client";

import { useDeferredValue, useState } from "react";
import EstadoVazio from "@/componentes/dashboard/estado-vazio";
import TabelaAdmin from "@/componentes/dashboard/tabela-admin";
import CampoBusca from "@/componentes/ui/campo-busca";
import { AdminTableColumn, AdminTableRow } from "@/tipos/plataforma";

type ListaModuloInterativaProps = {
  columns: AdminTableColumn[];
  rows: AdminTableRow[];
  emptyTitle: string;
  emptyDescription: string;
  actionHref?: string;
  actionLabel?: string;
};

function formatarStatus(status: string) {
  switch (status) {
    case "pendente_aprovacao":
      return "Pendente";
    case "revisao":
      return "Revisao";
    case "publicado":
      return "Publicado";
    case "rascunho":
      return "Rascunho";
    case "rejeitado":
      return "Rejeitado";
    case "arquivado":
      return "Arquivado";
    case "novo":
      return "Novo";
    case "lido":
      return "Lido";
    case "respondido":
      return "Respondido";
    default:
      return status;
  }
}

export default function ListaModuloInterativa({
  columns,
  rows,
  emptyTitle,
  emptyDescription,
  actionHref,
  actionLabel,
}: ListaModuloInterativaProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("todos");
  const deferredQuery = useDeferredValue(query);

  const statusOptions = Array.from(
    new Set(
      rows
        .map((row) => (typeof row.status === "string" ? row.status : ""))
        .filter(Boolean)
    )
  );

  const filteredRows = rows.filter((row) => {
    const haystack = [row.titulo, row.categoria, row.status, row.atualizado]
      .join(" ")
      .toLowerCase();

    const matchesQuery = haystack.includes(deferredQuery.trim().toLowerCase());
    const matchesStatus = status === "todos" ? true : row.status === status;

    return matchesQuery && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-4xl border border-slate-200 bg-white p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full max-w-md">
          <CampoBusca
            valor={query}
            onChange={setQuery}
            placeholder="Buscar por título, categoria, status ou data..."
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-500">Status</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-4xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400"
          >
            <option value="todos">Todos</option>
            {statusOptions.map((option) => (
              <option
                key={option}
                value={option}
              >
                {formatarStatus(option)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredRows.length === 0 ? (
        <EstadoVazio
          titulo={emptyTitle}
          descricao={emptyDescription}
          actionHref={actionHref}
          actionLabel={actionLabel}
        />
      ) : (
        <TabelaAdmin
          columns={columns}
          rows={filteredRows}
        />
      )}
    </div>
  );
}
