import Link from "next/link";
import { InstagramIcon, WhatsappIcon } from "@hugeicons/core-free-icons";
import Icone from "@/componentes/ui/icone";

type SocialButtonsProps = {
  whatsapp?: string;
  instagram?: string;
};

export default function SocialButtons({
  whatsapp,
  instagram,
}: SocialButtonsProps) {
  const numeroLimpo = whatsapp ? whatsapp.replace(/\D/g, "") : "";
  const whatsappHref =
    numeroLimpo.length >= 10
      ? `https://wa.me/${numeroLimpo}?text=${encodeURIComponent(
          "Olá! Vim pelo portal Visite Lapa e gostaria de mais informações."
        )}`
      : undefined;

  const instagramHref = instagram
    ? instagram.startsWith("http")
      ? instagram
      : `https://instagram.com/${instagram.replace(/^@/, "")}`
    : undefined;

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      {whatsappHref && (
        <Link
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-4xl bg-white px-4 py-2.5 text-sm font-semibold text-main transition hover:bg-gray-100"
        >
          <Icone
            icon={WhatsappIcon}
            size={17}
          />
          WhatsApp
        </Link>
      )}

      {instagramHref && (
        <Link
          href={instagramHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-4xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
        >
          <Icone
            icon={InstagramIcon}
            size={17}
          />
          Instagram
        </Link>
      )}
    </div>
  );
}
