import BlocoContato from "@/componentes/dashboard/blocos-info/bloco-contato";
import BlocoDestaques from "@/componentes/dashboard/blocos-info/bloco-destaques";
import BlocoPeriodo from "@/componentes/dashboard/blocos-info/bloco-periodo";
import BlocoResumo from "@/componentes/dashboard/blocos-info/bloco-resumo";
import BlocoSolicitarAlteracao from "@/componentes/dashboard/blocos-info/bloco-solicitar-alteracao";
import LayoutDetalhe from "@/componentes/layouts/layout-detalhe";
import { buscarTurismoPorSlug } from "@/servicos/turismo";
import { obterConfiguracaoPortal } from "@/servicos/portal";

type TurismoDetalhePaginaProps = {
  params: {
    slug: string;
  };
};

export default async function TurismoDetalhePagina({
  params,
}: TurismoDetalhePaginaProps) {
  const roteiro = await buscarTurismoPorSlug(params.slug);

  if (!roteiro) {
    return (
      <div className="bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl border border-gray-200 bg-white p-10">
          <h1 className="text-3xl font-bold text-main">
            Experiência não encontrada
          </h1>

          <p className="mt-4 text-base leading-7 text-gray-600">
            Não encontramos uma experiência com esse identificador.
          </p>
        </div>
      </div>
    );
  }

  const portal = obterConfiguracaoPortal();
  const urlPublica = `${portal.siteUrl}/turismo/${roteiro.slug}`;

  return (
    <LayoutDetalhe
      categoria={roteiro.categoria}
      titulo={roteiro.titulo}
      descricao={roteiro.descricao}
      imagem={roteiro.imagem}
      whatsapp={roteiro.whatsapp}
      instagram={roteiro.instagram}
      aside={
        <div className="space-y-6">
          <BlocoPeriodo
            titulo="Formato da experiência"
            principalLabel="Duração"
            principalValor={roteiro.duracao}
            secundarioLabel="Formato"
            secundarioValor={roteiro.formato}
          />
          <BlocoContato
            telefone={roteiro.contato}
            whatsapp={roteiro.whatsapp}
            instagram={roteiro.instagram}
            ctaLabel="Solicitar informações"
          />
          <BlocoSolicitarAlteracao
            tipo="Turismo"
            titulo={roteiro.titulo}
            url={urlPublica}
          />
        </div>
      }
    >
      <BlocoResumo
        titulo="Sobre a experiência"
        paragrafos={roteiro.sobre}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <BlocoDestaques
          titulo="O que inclui"
          itens={roteiro.inclui}
        />
        <BlocoDestaques
          titulo="Diferenciais"
          itens={roteiro.diferenciais}
        />
      </div>
    </LayoutDetalhe>
  );
}
