import BlocoContato from "@/componentes/dashboard/blocos-info/bloco-contato";
import BlocoDestaques from "@/componentes/dashboard/blocos-info/bloco-destaques";
import BlocoListaInformacoes from "@/componentes/dashboard/blocos-info/bloco-lista-informacoes";
import BlocoPeriodo from "@/componentes/dashboard/blocos-info/bloco-periodo";
import BlocoResumo from "@/componentes/dashboard/blocos-info/bloco-resumo";
import BlocoSolicitarAlteracao from "@/componentes/dashboard/blocos-info/bloco-solicitar-alteracao";
import LayoutDetalhe from "@/componentes/layouts/layout-detalhe";
import { buscarEventoPorSlug } from "@/servicos/eventos";
import { obterConfiguracaoPortal } from "@/servicos/portal";

type EventoDetalhePaginaProps = {
  params: {
    slug: string;
  };
};

export default async function EventoDetalhePagina({
  params,
}: EventoDetalhePaginaProps) {
  const evento = await buscarEventoPorSlug(params.slug);

  if (!evento) {
    return (
      <div className="bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl border border-gray-200 bg-white p-10">
          <h1 className="text-3xl font-bold text-main">
            Evento não encontrado
          </h1>

          <p className="mt-4 text-base leading-7 text-gray-600">
            Não encontramos um evento com esse identificador.
          </p>
        </div>
      </div>
    );
  }

  const portal = obterConfiguracaoPortal();
  const urlPublica = `${portal.siteUrl}/eventos/${evento.slug}`;

  return (
    <LayoutDetalhe
      categoria={evento.categoria}
      titulo={evento.titulo}
      descricao={evento.descricao}
      imagem={evento.imagem}
      whatsapp={evento.whatsapp}
      instagram={evento.instagram}
      aside={
        <div className="space-y-6">
          <BlocoListaInformacoes
            titulo="Informações"
            itens={[
              { label: "Categoria", value: evento.categoria },
              { label: "Local", value: evento.local },
            ]}
          />
          <BlocoPeriodo
            principalLabel="Data"
            principalValor={evento.data}
          />
          <BlocoContato
            telefone={evento.contato}
            whatsapp={evento.whatsapp}
            instagram={evento.instagram}
            ctaLabel="Ver programação"
          />
          <BlocoSolicitarAlteracao
            tipo="Evento"
            titulo={evento.titulo}
            url={urlPublica}
          />
        </div>
      }
    >
      <BlocoResumo
        titulo="Sobre o evento"
        texto={evento.descricao}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <BlocoDestaques
          titulo="Programação"
          itens={evento.programacao}
        />
        <BlocoDestaques
          titulo="Extras"
          itens={evento.destaques}
        />
      </div>
    </LayoutDetalhe>
  );
}
