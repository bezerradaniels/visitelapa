import CadastroTipoPagina from "@/paginas/cadastro/[tipo]";
import CadastroPagina from "@/paginas/cadastro";
import { obterTipoCadastroPublico } from "@/servicos/cadastros";
import { CadastroTipoId } from "@/tipos/plataforma";

type PageProps = {
  searchParams: Promise<{
    tipo?: string;
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  const { tipo } = await searchParams;

  if (tipo && obterTipoCadastroPublico(tipo)) {
    return <CadastroTipoPagina tipo={tipo as CadastroTipoId} />;
  }

  return <CadastroPagina />;
}
