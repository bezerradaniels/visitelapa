import GaleriaPost from "@/componentes/blog/galeria-post";
import BlocoContato from "@/componentes/dashboard/blocos-info/bloco-contato";
import BlocoDestaques from "@/componentes/dashboard/blocos-info/bloco-destaques";
import BlocoListaInformacoes from "@/componentes/dashboard/blocos-info/bloco-lista-informacoes";
import BlocoResumo from "@/componentes/dashboard/blocos-info/bloco-resumo";
import BlocoSolicitarAlteracao from "@/componentes/dashboard/blocos-info/bloco-solicitar-alteracao";
import CardNegocioPlay from "@/componentes/cards/card-negocio-play";
import LayoutDetalhe from "@/componentes/layouts/layout-detalhe";
import {
  criarCapaFallbackNegocio,
  criarLogoFallbackNegocio,
} from "@/servicos/negocios-fallback";
import { buscarNegocioPorSlug, buscarNegociosRelacionados } from "@/servicos/negocios";
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

  const [relacionados] = await Promise.all([
    buscarNegociosRelacionados(negocio.categoria, negocio.slug),
  ]);

  const portal = obterConfiguracaoPortal();
  const urlPublica = `${portal.siteUrl}/${negocio.username}`;
  const capaNegocio = negocio.imagem || criarCapaFallbackNegocio(negocio.titulo);
  const avatarNegocio = negocio.logo || criarLogoFallbackNegocio(negocio.titulo);

  // Separa endereço: rua, bairro (sem cidade - último segmento)
  const partesEndereco = (negocio.endereco ?? "").split(",").map((p) => p.trim()).filter(Boolean);
  const ruaNumero = partesEndereco.slice(0, partesEndereco.length > 2 ? partesEndereco.length - 2 : partesEndereco.length - 1).join(", ");
  const bairro = partesEndereco.length >= 2 ? partesEndereco[partesEndereco.length - 2] : "";
  const enderecoFormatado = [ruaNumero, bairro].filter(Boolean).join("\n");

  return (
    <LayoutDetalhe
      categoria={negocio.categoria}
      titulo={negocio.titulo}
      descricao={negocio.descricao}
      imagem={capaNegocio}
      avatarSrc={avatarNegocio}
      avatarAlt={`Logo de ${negocio.titulo}`}
      avatarFallback={negocio.titulo}
      whatsapp={negocio.whatsapp}
      instagram={negocio.instagram}
      aside={
        <div className="space-y-6">
          <BlocoListaInformacoes
            titulo="Informações"
            itens={[
              { label: "Categoria", value: negocio.categoria },
              { label: "Endereço", value: enderecoFormatado },
            ]}
          />

          <BlocoContato
            telefone={negocio.contato}
            whatsapp={negocio.whatsapp}
            instagram={negocio.instagram}
            ctaLabel="Visitar perfil"
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
          titulo="Serviços"
          itens={negocio.especialidades}
        />
        <BlocoDestaques
          titulo="Diferenciais"
          itens={negocio.diferenciais}
        />
      </div>

      <GaleriaPost imagens={negocio.galeria} />

      {relacionados.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Outras empresas em {negocio.categoria}
          </h2>
          <div className="mt-4 grid gap-4">
            {relacionados.map((r) => (
              <CardNegocioPlay
                key={r.slug}
                href={`/negocios/${r.slug}`}
                label={r.categoria}
                titulo={r.titulo}
                descricao={r.descricao}
                logo={r.logo}
              />
            ))}
          </div>
        </div>
      ) : null}
    </LayoutDetalhe>
  );
}
