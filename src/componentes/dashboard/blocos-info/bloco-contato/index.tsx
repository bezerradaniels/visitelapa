import Link from "next/link";
import { Call02Icon, InstagramIcon, Message01Icon } from "@hugeicons/core-free-icons";
import Icone from "@/componentes/ui/icone";

type BlocoContatoProps = {
  telefone: string;
  whatsapp?: string;
  instagram?: string;
  ctaLabel: string;
};

export default function BlocoContato({
  telefone,
  whatsapp,
  instagram,
  ctaLabel,
}: BlocoContatoProps) {
  // Monta link real do WhatsApp com mensagem personalizada
  let whatsappHref: string | undefined = undefined;
  if (whatsapp) {
    // Remove tudo que não for número
    const numeroLimpo = whatsapp.replace(/\D/g, "");
    if (numeroLimpo.length >= 10) {
      whatsappHref = `https://wa.me/${numeroLimpo}?text=${encodeURIComponent(
        "Olá! Encontrei seu contato pelo portal Visite Lapa."
      )}`;
    }
  }

  // Monta link real do Instagram
  const instagramHref = instagram
    ? instagram.startsWith("http")
      ? instagram
      : `https://instagram.com/${instagram.replace(/^@/, "")}`
    : undefined;

  return (
    <div className="rounded-4xl border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-slate-950">Contato</h3>

      <div className="mt-5 space-y-4 text-sm text-slate-700">
        <div className="flex items-start gap-3">
          <Icone
            icon={Call02Icon}
            size={18}
            className="mt-0.5 text-slate-500"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Telefone
            </p>
            <p className="mt-2">{telefone}</p>
          </div>
        </div>

        {instagramHref ? (
          <div className="flex items-start gap-3">
            <Icone
              icon={InstagramIcon}
              size={18}
              className="mt-0.5 text-slate-500"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Instagram
              </p>
              <Link
                href={instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-slate-700 transition hover:text-slate-950"
              >
                Abrir perfil
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      {whatsappHref ? (
        <Link
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-4xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Icone
            icon={Message01Icon}
            size={18}
          />
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}
