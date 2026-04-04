import BlocoContato from "@/componentes/dashboard/blocos-info/bloco-contato";
import BlocoDestaques from "@/componentes/dashboard/blocos-info/bloco-destaques";
import BlocoLocalizacao from "@/componentes/dashboard/blocos-info/bloco-localizacao";
import BlocoPeriodo from "@/componentes/dashboard/blocos-info/bloco-periodo";
import BlocoResumo from "@/componentes/dashboard/blocos-info/bloco-resumo";
import BlocoSolicitarAlteracao from "@/componentes/dashboard/blocos-info/bloco-solicitar-alteracao";
import LayoutDetalhe from "@/componentes/layouts/layout-detalhe";
import { buscarRestaurantePorSlug } from "@/servicos/restaurantes";
import { obterConfiguracaoPortal } from "@/servicos/portal";

type RestauranteDetalhePaginaProps = {
  params: {
    slug: string;
  };
};

export default async function RestauranteDetalhePagina({
  params,
}: RestauranteDetalhePaginaProps) {
  const restaurante = await buscarRestaurantePorSlug(params.slug);

  if (!restaurante) {
    return (
      <div className="bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl border border-gray-200 bg-white p-10">
          <h1 className="text-3xl font-bold text-main">
            Restaurante não encontrado
          </h1>

          <p className="mt-4 text-base leading-7 text-gray-600">
            Não encontramos um restaurante com esse identificador.
          </p>
        </div>
      </div>
    );
  }

  const portal = obterConfiguracaoPortal();
  const urlPublica = `${portal.siteUrl}/restaurantes/${restaurante.slug}`;

  return (
    <LayoutDetalhe
      categoria={restaurante.categoria}
      titulo={restaurante.titulo}
      descricao={restaurante.descricao}
      imagem={restaurante.imagem}
      whatsapp={restaurante.whatsapp}
      instagram={restaurante.instagram}
      aside={
        <div className="space-y-6">
          <BlocoLocalizacao local={restaurante.endereco} />
          <BlocoPeriodo
            titulo="Operação"
            principalLabel="Funcionamento"
            principalValor={restaurante.funcionamento}
            secundarioLabel="Categoria"
            secundarioValor={restaurante.categoria}
          />
          <BlocoContato
            telefone={restaurante.contato}
            whatsapp={restaurante.whatsapp}
            instagram={restaurante.instagram}
            ctaLabel="Fazer reserva"
          />
          <BlocoSolicitarAlteracao
            tipo="Restaurante"
            titulo={restaurante.titulo}
            url={urlPublica}
          />
        </div>
      }
    >
      <BlocoResumo
        titulo="Sobre o restaurante"
        paragrafos={restaurante.sobre}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <BlocoDestaques
          titulo="Especialidades"
          itens={restaurante.especialidades}
        />
        <BlocoDestaques
          titulo="Diferenciais"
          itens={restaurante.diferenciais}
        />
      </div>
    </LayoutDetalhe>
  );
}
