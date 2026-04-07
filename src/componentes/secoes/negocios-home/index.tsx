import Link from "next/link";
import Secao from "@/componentes/secoes/secao";
import TituloSecao from "@/componentes/secoes/titulo-secao";
import { listarNegocios } from "@/servicos/negocios";
import CardNegocioPlay from "@/componentes/cards/card-negocio-play";

export default async function NegociosHome() {
  const negocios = (await listarNegocios()).slice(0, 3);

  if (negocios.length === 0) {
    return null;
  }

  return (
    <Secao>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <TituloSecao
          titulo="Negócios em destaque"
          subtitulo="Conheça empresas, serviços e profissionais que movimentam Bom Jesus da Lapa."
        />

        <Link
          href="/negocios"
          className="text-sm font-semibold text-main transition hover:text-gray-700"
        >
          Ver todos os negócios
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {negocios.map((negocio) => (
          <CardNegocioPlay
            key={negocio.slug}
            href={`/negocios/${negocio.slug}`}
            label={negocio.categoria}
            titulo={negocio.titulo}
            descricao={negocio.descricao}
            logo={negocio.logo}
          />
        ))}
      </div>
    </Secao>
  );
}
