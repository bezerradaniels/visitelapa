import BlocoContato from "@/componentes/dashboard/blocos-info/bloco-contato";
import BlocoDestaques from "@/componentes/dashboard/blocos-info/bloco-destaques";
import BlocoLocalizacao from "@/componentes/dashboard/blocos-info/bloco-localizacao";
import BlocoPeriodo from "@/componentes/dashboard/blocos-info/bloco-periodo";
import BlocoResumo from "@/componentes/dashboard/blocos-info/bloco-resumo";
import BlocoSolicitarAlteracao from "@/componentes/dashboard/blocos-info/bloco-solicitar-alteracao";
import LayoutDetalhe from "@/componentes/layouts/layout-detalhe";
import { buscarHotelPorSlug } from "@/servicos/hoteis";
import { obterConfiguracaoPortal } from "@/servicos/portal";

type HotelDetalhePaginaProps = {
  params: {
    slug: string;
  };
};

export default async function HotelDetalhePagina({
  params,
}: HotelDetalhePaginaProps) {
  const hotel = await buscarHotelPorSlug(params.slug);

  if (!hotel) {
    return (
      <div className="bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl border border-gray-200 bg-white p-10">
          <h1 className="text-3xl font-bold text-main">
            Hotel não encontrado
          </h1>

          <p className="mt-4 text-base leading-7 text-gray-600">
            Não encontramos um hotel com esse identificador.
          </p>
        </div>
      </div>
    );
  }

  const portal = obterConfiguracaoPortal();
  const urlPublica = `${portal.siteUrl}/hoteis/${hotel.slug}`;

  return (
    <LayoutDetalhe
      categoria={hotel.categoria}
      titulo={hotel.titulo}
      descricao={hotel.descricao}
      imagem={hotel.imagem}
      whatsapp={hotel.whatsapp}
      instagram={hotel.instagram}
      aside={
        <div className="space-y-6">
          <BlocoLocalizacao local={hotel.localizacao} />
          <BlocoPeriodo
            titulo="Hospedagem"
            principalLabel="Check-in"
            principalValor={hotel.checkIn}
            secundarioLabel="Check-out"
            secundarioValor={hotel.checkOut}
          />
          <BlocoContato
            telefone={hotel.contato}
            whatsapp={hotel.whatsapp}
            instagram={hotel.instagram}
            ctaLabel="Reservar agora"
          />
          <BlocoSolicitarAlteracao
            tipo="Hotel"
            titulo={hotel.titulo}
            url={urlPublica}
          />
        </div>
      }
    >
      <BlocoResumo
        titulo="Sobre o hotel"
        texto={hotel.descricao}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <BlocoDestaques
          titulo="Comodidades"
          itens={hotel.comodidades}
        />
        <BlocoDestaques
          titulo="Diferenciais"
          itens={hotel.diferenciais}
        />
      </div>
    </LayoutDetalhe>
  );
}
