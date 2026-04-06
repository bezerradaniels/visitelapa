import Link from "next/link";
import {
  Building03Icon,
  Calendar03Icon,
  Hotel01Icon,
  Restaurant01Icon,
  Shield01Icon,
  HelpCircleIcon,
  Ticket01Icon,
} from "@hugeicons/core-free-icons";
import HeroListagem from "@/componentes/secoes/hero-listagem";
import Container from "@/componentes/ui/container";
import Icone from "@/componentes/ui/icone";
import { assetsEstaticos } from "@/dados/assets";
import { listarTiposCadastroPublico } from "@/servicos/cadastros";
import { obterConfiguracaoPortal } from "@/servicos/portal";
import { CadastroTipoId } from "@/tipos/plataforma";

const ICONES: Record<CadastroTipoId, typeof Ticket01Icon> = {
  pacotes: Ticket01Icon,
  eventos: Calendar03Icon,
  hoteis: Hotel01Icon,
  negocios: Building03Icon,
  restaurantes: Restaurant01Icon,
};

const TITULOS_BOTOES: Record<CadastroTipoId, string> = {
  pacotes: "Pacotes",
  eventos: "Eventos",
  hoteis: "Hotéis",
  negocios: "Negócios",
  restaurantes: "Restaurantes",
};

export default function CadastrarConteudoPagina() {
  const tipos = listarTiposCadastroPublico();
  const portal = obterConfiguracaoPortal();

  return (
    <>
      <HeroListagem
        titulo="Cadastrar conteúdo no Visite Lapa"
        subtitulo="Escolha o tipo de cadastro que deseja enviar e siga para o formulário correspondente."
        imagem={assetsEstaticos.hero.aurora}
      />

      <div className="bg-page py-16 md:py-24">
        <Container>
          <section>
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                Tipos de conteúdo
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                Selecione o formulário que deseja preencher
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Os botões abaixo levam direto para cada formulário público de cadastro.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {tipos.map((tipo) => (
                <Link
                  key={tipo.id}
                  href={tipo.href}
                  className="inline-flex items-center gap-3 rounded-[32px] border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-main transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
                >
                  <span className="rounded-2xl bg-slate-100 p-2 text-slate-700">
                    <Icone
                      icon={ICONES[tipo.id]}
                      size={18}
                    />
                  </span>
                  <span>{TITULOS_BOTOES[tipo.id]}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-14 grid gap-6 lg:grid-cols-2">
            <article className="rounded-4xl border border-slate-200 bg-white p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-[32px] bg-slate-100 p-3 text-slate-700">
                  <Icone
                    icon={HelpCircleIcon}
                    size={20}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-950">
                    Precisa de ajuda?
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Se você tiver dúvida sobre qual tipo escolher, fale com a equipe
                    antes de enviar o cadastro.
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-slate-700">
                    <p>
                      <strong>Email:</strong> {portal.email}
                    </p>
                    <p>
                      <strong>WhatsApp:</strong> {portal.whatsappExibicao}
                    </p>
                  </div>

                  <Link
                    href="/contato"
                    className="mt-5 inline-flex text-sm font-semibold text-main transition hover:text-slate-700"
                  >
                    Falar com a equipe
                  </Link>
                </div>
              </div>
            </article>

            <article className="rounded-4xl border border-slate-200 bg-white p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-[32px] bg-slate-100 p-3 text-slate-700">
                  <Icone
                    icon={Shield01Icon}
                    size={20}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-950">
                    Publicação com aprovação
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Nenhum cadastro é publicado automaticamente. Toda solicitação
                    enviada passa por revisão e aprovação administrativa antes de
                    aparecer no portal.
                  </p>
                </div>
              </div>
            </article>
          </section>
        </Container>
      </div>
    </>
  );
}
