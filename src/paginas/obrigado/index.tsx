import Link from "next/link";
import {
  ArrowLeft01Icon,
  CheckmarkCircle01Icon,
  Home01Icon,
  Mail01Icon,
  Note01Icon,
} from "@hugeicons/core-free-icons";
import Container from "@/componentes/ui/container";
import Icone from "@/componentes/ui/icone";
import { obterRotuloTipoCadastro, obterTipoCadastroPublico } from "@/servicos/cadastros";
import { CadastroTipoId } from "@/tipos/plataforma";

type ObrigadoPaginaProps = {
  origem?: string;
  tipo?: string;
};

function obterConteudo(origem?: string, tipo?: string) {
  if (origem === "contato") {
    return {
      eyebrow: "Mensagem recebida",
      titulo: "Obrigado pelo seu contato",
      descricao:
        "Sua mensagem foi enviada com sucesso. Nossa equipe vai analisar o que você enviou e responder pelo canal informado assim que possível.",
      detalhe: "Se precisar complementar a solicitação, você pode enviar uma nova mensagem pela página de contato.",
      icone: Mail01Icon,
      acoes: [
        {
          href: "/contato",
          label: "Voltar para contato",
          icon: ArrowLeft01Icon,
          variant: "secondary" as const,
        },
        {
          href: "/",
          label: "Ir para o portal",
          icon: Home01Icon,
          variant: "primary" as const,
        },
      ],
    };
  }

  if (origem === "cadastro") {
    const tipoValido = tipo && obterTipoCadastroPublico(tipo);
    const rotuloTipo = tipoValido
      ? obterRotuloTipoCadastro(tipo as CadastroTipoId)
      : "conteúdo";

    return {
      eyebrow: "Solicitação recebida",
      titulo: "Obrigado por enviar sua nova solicitação",
      descricao: `Recebemos seu cadastro de ${rotuloTipo} e ele já entrou na fila de aprovação do portal. A publicação só acontece depois da revisão administrativa.`,
      detalhe:
        "Se estiver tudo certo, sua solicitação seguirá para validação editorial e depois poderá ser publicada no módulo correspondente.",
      icone: Note01Icon,
      acoes: [
        {
          href: "/cadastro",
          label: "Enviar outro cadastro",
          icon: ArrowLeft01Icon,
          variant: "secondary" as const,
        },
        {
          href: "/",
          label: "Voltar ao portal",
          icon: Home01Icon,
          variant: "primary" as const,
        },
      ],
    };
  }

  return {
    eyebrow: "Envio concluído",
    titulo: "Obrigado",
    descricao:
      "Recebemos sua solicitação com sucesso. Se precisar de mais alguma coisa, você pode voltar ao portal ou entrar em contato com a equipe.",
    detalhe: "Esta página confirma apenas que o envio foi concluído.",
    icone: CheckmarkCircle01Icon,
    acoes: [
      {
        href: "/",
        label: "Ir para o portal",
        icon: Home01Icon,
        variant: "primary" as const,
      },
    ],
  };
}

export default function ObrigadoPagina({ origem, tipo }: ObrigadoPaginaProps) {
  const conteudo = obterConteudo(origem, tipo);

  return (
    <div className="bg-page py-16 md:py-24">
      <Container>
        <section className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-12">
          <div className="rounded-[32px] bg-emerald-50 p-4 text-emerald-700 w-fit">
            <Icone
              icon={conteudo.icone}
              size={28}
            />
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
            {conteudo.eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            {conteudo.titulo}
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-600 md:text-lg">
            {conteudo.descricao}
          </p>
          <p className="mt-4 rounded-[28px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-7 text-slate-600">
            {conteudo.detalhe}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {conteudo.acoes.map((acao) => (
              <Link
                key={acao.href}
                href={acao.href}
                className={
                  acao.variant === "primary"
                    ? "inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    : "inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                }
              >
                <Icone
                  icon={acao.icon}
                  size={18}
                />
                {acao.label}
              </Link>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
