import { notFound } from "next/navigation";
import AprovacaoDetalhePagina from "@/paginas/dashboard/aprovacoes/[id]";
import { obterSolicitacaoPublica } from "@/servicos/solicitacoes-publicas";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const solicitacao = await obterSolicitacaoPublica(id);

  if (!solicitacao) {
    notFound();
  }

  return <AprovacaoDetalhePagina solicitacao={solicitacao} />;
}
