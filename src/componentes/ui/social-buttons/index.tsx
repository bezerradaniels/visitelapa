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
  return (
    <div className="mt-4 flex flex-wrap gap-3">
      {whatsapp && (
        <Link
          href={whatsapp}
          target="_blank"
          className="inline-flex items-center justify-center gap-2 rounded-[32px] bg-white px-4 py-2.5 text-sm font-semibold text-main transition hover:bg-gray-100"
        >
          <Icone
            icon={WhatsappIcon}
            size={17}
          />
          WhatsApp
        </Link>
      )}

      {instagram && (
        <Link
          href={instagram}
          target="_blank"
          className="inline-flex items-center justify-center gap-2 rounded-[32px] border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
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
