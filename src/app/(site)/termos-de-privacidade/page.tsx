import type { Metadata } from "next";
import Container from "@/componentes/ui/container";

export const metadata: Metadata = {
  title: "Política de Privacidade | Visite Lapa",
  description: "Informações sobre coleta, uso e proteção de dados no portal Visite Lapa.",
};

export default function Page() {
  return (
    <div className="bg-page py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
            Legal
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
            Política de privacidade
          </h1>
          <div className="mt-8 space-y-6 text-base leading-8 text-slate-600">
            <p>
              Os dados enviados pelo formulário são usados para análise editorial,
              contato operacional e organização interna do portal.
            </p>
            <p>
              As informações podem ser armazenadas para acompanhamento do cadastro,
              prevenção de abuso e comunicação com a pessoa responsável pelo envio.
            </p>
            <p>
              Dados públicos só devem ser exibidos no portal após aprovação editorial,
              respeitando a finalidade informada no momento do cadastro.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
