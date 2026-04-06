import Link from "next/link";
import {
  ArrowRight01Icon,
  Building03Icon,
  Calendar03Icon,
  Hotel01Icon,
  Restaurant01Icon,
  Ticket01Icon,
} from "@hugeicons/core-free-icons";
import Container from "@/componentes/ui/container";
import Icone from "@/componentes/ui/icone";
import { listarTiposCadastroPublico } from "@/servicos/cadastros";
import { CadastroTipoId } from "@/tipos/plataforma";

const ICONES: Record<CadastroTipoId, typeof Ticket01Icon> = {
  pacotes: Ticket01Icon,
  eventos: Calendar03Icon,
  hoteis: Hotel01Icon,
  negocios: Building03Icon,
  restaurantes: Restaurant01Icon,
};

export default function CadastroPagina() {
  const tipos = listarTiposCadastroPublico();

  return (
    <div className="bg-page py-16 md:py-24">
      <Container>
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
            Cadastro público
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            Escolha o tipo de solicitação que deseja enviar
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-600 md:text-lg">
            Todos os formulários desta área já compartilham campos reutilizáveis,
            validações e regra editorial de aprovação antes da publicação.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {tipos.map((tipo) => (
            <Link
              key={tipo.id}
              href={tipo.href}
              className="group rounded-4xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-slate-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-[32px] bg-slate-100 p-3 text-slate-700">
                  <Icone
                    icon={ICONES[tipo.id]}
                    size={22}
                  />
                </div>

                <Icone
                  icon={ArrowRight01Icon}
                  size={18}
                  className="text-slate-400 transition group-hover:text-slate-700"
                />
              </div>

              <h2 className="mt-6 text-2xl font-semibold text-slate-950">
                {tipo.titulo}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {tipo.subtitulo}
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-500">
                {tipo.descricao}
              </p>

              <p className="mt-6 text-sm font-semibold text-main">
                Abrir cadastro
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
