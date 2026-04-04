import Image from "next/image";
import Link from "next/link";
import {
  ContactBookIcon,
  Home01Icon,
  Hotel01Icon,
  Location01Icon,
  Login03Icon,
  Note01Icon,
  BookOpen01Icon,
  Building03Icon,
  Calendar03Icon,
  Restaurant01Icon,
  GlobeIcon,
} from "@hugeicons/core-free-icons";
import Container from "@/componentes/ui/container";
import Icone from "@/componentes/ui/icone";
import { assetsEstaticos } from "@/dados/assets";

const linksPortal = [
  { label: "Home", href: "/", icon: Home01Icon },
  { label: "Cadastro", href: "/cadastrar-conteudo", icon: Note01Icon },
  { label: "Contato", href: "/contato", icon: ContactBookIcon },
  { label: "Login", href: "/login", icon: Login03Icon },
];

const linksCategorias = [
  { label: "Negócios", href: "/negocios", icon: Building03Icon },
  { label: "Hotéis", href: "/hoteis", icon: Hotel01Icon },
  { label: "Eventos", href: "/eventos", icon: Calendar03Icon },
  { label: "Blog", href: "/blog", icon: BookOpen01Icon },
  { label: "Restaurantes", href: "/restaurantes", icon: Restaurant01Icon },
  { label: "Turismo", href: "/turismo", icon: Location01Icon },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <Container>
        <div className="flex flex-col gap-10 py-12">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-3 text-lg font-bold text-main"
              >
                <Image
                  src={assetsEstaticos.logos.principal}
                  alt="Visite Lapa"
                  width={120}
                  height={32}
                  className="h-20 w-auto"
                />
              </Link>

              <p className="mt-4 max-w-sm text-sm leading-6 text-gray-600">
                Um portal para descobrir experiências, negócios, hospedagem,
                gastronomia e eventos em Bom Jesus da Lapa.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-main">
                Portal
              </h3>

              <div className="mt-4 flex flex-col gap-3">
                {linksPortal.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center gap-2 text-sm text-gray-600 transition hover:text-main"
                  >
                    <Icone
                      icon={link.icon}
                      size={16}
                      className="text-gray-400"
                    />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-main">
                Categorias
              </h3>

              <div className="mt-4 flex flex-col gap-3">
                {linksCategorias.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center gap-2 text-sm text-gray-600 transition hover:text-main"
                  >
                    <Icone
                      icon={link.icon}
                      size={16}
                      className="text-gray-400"
                    />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-main">
                Informações
              </h3>

              <div className="mt-4 flex flex-col gap-3 text-sm text-gray-600">
                <p className="inline-flex items-center gap-2">
                  <Icone
                    icon={Location01Icon}
                    size={16}
                    className="text-gray-400"
                  />
                  Bom Jesus da Lapa - Bahia
                </p>
                <p className="inline-flex items-center gap-2">
                  <Icone
                    icon={GlobeIcon}
                    size={16}
                    className="text-gray-400"
                  />
                  Portal turístico e comercial da cidade
                </p>
                <p className="inline-flex items-center gap-2">
                  <Icone
                    icon={Note01Icon}
                    size={16}
                    className="text-gray-400"
                  />
                  Conteúdos, eventos e experiências locais
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Visite Lapa. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
