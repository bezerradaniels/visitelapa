import {
  BookOpen01Icon,
  Building03Icon,
  Calendar03Icon,
  ContactBookIcon,
  Hotel01Icon,
  Location01Icon,
  Restaurant01Icon,
} from "@hugeicons/core-free-icons";

export const itensMenuCabecalho = [
  { href: "/negocios", label: "Negócios", icon: Building03Icon },
  { href: "/hoteis", label: "Hotéis", icon: Hotel01Icon },
  { href: "/eventos", label: "Eventos", icon: Calendar03Icon },
  { href: "/blog", label: "Blog", icon: BookOpen01Icon },
  { href: "/restaurantes", label: "Restaurantes", icon: Restaurant01Icon },
  { href: "/turismo", label: "Turismo", icon: Location01Icon },
  { href: "/contato", label: "Contato", icon: ContactBookIcon },
] as const;
