import BlocoContato from "@/componentes/dashboard/blocos-info/bloco-contato";
import BlocoDestaques from "@/componentes/dashboard/blocos-info/bloco-destaques";
import BlocoListaInformacoes from "@/componentes/dashboard/blocos-info/bloco-lista-informacoes";
import BlocoResumo from "@/componentes/dashboard/blocos-info/bloco-resumo";
import BlocoSolicitarAlteracao from "@/componentes/dashboard/blocos-info/bloco-solicitar-alteracao";
import LayoutDetalhe from "@/componentes/layouts/layout-detalhe";
import { buscarNegocioPorSlug } from "@/servicos/negocios";
import { obterConfiguracaoPortal } from "@/servicos/portal";

type NegocioDetalhePaginaProps = {
  params: {
    slug: string;
  };
};

export default async function NegocioDetalhePagina({
  params,
}: NegocioDetalhePaginaProps) {
  const negocio = await buscarNegocioPorSlug(params.slug);

  if (!negocio) {
    return (
      <div className="bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl border border-gray-200 bg-white p-10">
          <h1 className="text-3xl font-bold text-main">
            Negócio não encontrado
          </h1>

          <p className="mt-4 text-base leading-7 text-gray-600">
            Não encontramos um negócio com esse identificador.
          </p>
        </div>
      </div>
    );
  }

  const portal = obterConfiguracaoPortal();
  const urlPublica = `${portal.siteUrl}/${negocio.username}`;

  return (
    <LayoutDetalhe
      categoria={negocio.categoria}
      titulo={negocio.titulo}
      descricao={negocio.descricao}
      imagem={negocio.imagem}
      whatsapp={negocio.whatsapp}
      instagram={negocio.instagram}
      aside={
        <div className="space-y-6">
          <BlocoListaInformacoes
            titulo="Informações"
            itens={[
              { label: "Categoria", value: negocio.categoria },
              { label: "Endereço", value: negocio.endereco },
              { label: "Atendimento", value: negocio.atendimento },
              {
                label: "URL curta",
                value: urlPublica.replace("https://", ""),
              },
            ]}
          />

          <BlocoContato
            telefone={negocio.contato}
            whatsapp={negocio.whatsapp}
            instagram={negocio.instagram}
            ctaLabel="Entrar em contato"
          />

          <BlocoSolicitarAlteracao
            tipo="Negócio"
            titulo={negocio.titulo}
            url={urlPublica}
          />
        </div>
      }
    >
      <BlocoResumo
        titulo="Sobre o negócio"
        texto={negocio.descricao}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <BlocoDestaques
          titulo="Especialidades"
          itens={negocio.especialidades}
        />
        <BlocoDestaques
          titulo="Diferenciais"
          itens={negocio.diferenciais}
        />
      </div>
    </LayoutDetalhe>
  );
}
