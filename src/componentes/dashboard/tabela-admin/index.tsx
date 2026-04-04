import Link from "next/link";
import { AdminTableColumn, AdminTableRow } from "@/tipos/plataforma";

type TabelaAdminProps = {
  columns: AdminTableColumn[];
  rows: AdminTableRow[];
};

function badgeClasses(status?: string) {
  switch (status) {
    case "publicado":
    case "respondido":
      return "bg-emerald-100 text-emerald-800";
    case "pendente_aprovacao":
    case "novo":
      return "bg-amber-100 text-amber-800";
    case "revisao":
    case "lido":
      return "bg-sky-100 text-sky-800";
    case "rascunho":
    case "arquivado":
      return "bg-slate-100 text-slate-700";
    case "rejeitado":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function TabelaAdmin({ columns, rows }: TabelaAdminProps) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-500"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-slate-100"
              >
                {columns.map((column) => {
                  const rawValue = row[column.key] ?? "";
                  const isStatus = column.key === "status";

                  return (
                    <td
                      key={column.key}
                      className="px-6 py-5 align-top text-sm text-slate-600"
                    >
                      {column.key === "titulo" && row.href ? (
                        <Link
                          href={row.href}
                          className="font-semibold text-slate-950 transition hover:text-slate-700"
                        >
                          {rawValue}
                        </Link>
                      ) : isStatus ? (
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClasses(rawValue)}`}
                        >
                          {rawValue}
                        </span>
                      ) : (
                        rawValue
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
