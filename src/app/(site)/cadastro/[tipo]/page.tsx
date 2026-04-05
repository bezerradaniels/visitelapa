import { notFound } from "next/navigation";
import CadastroTipoPagina from "@/paginas/cadastro/[tipo]";
import {
  obterTipoCadastroPublico,
} from "@/servicos/cadastros";
import { CadastroTipoId } from "@/tipos/plataforma";

type PageProps = {
  params: Promise<{
    tipo: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { tipo } = await params;

  if (!obterTipoCadastroPublico(tipo)) {
    notFound();
  }

  return <CadastroTipoPagina tipo={tipo as CadastroTipoId} />;
}
