import Hero from "@/componentes/secoes/hero";
import AtalhosPortal from "@/componentes/secoes/atalhos-portal";
import DestaquesHome from "@/componentes/secoes/destaques-home";
import EventosHome from "@/componentes/secoes/eventos-home";
import BlogHome from "@/componentes/secoes/blog-home";
import HoteisHome from "@/componentes/secoes/hoteis-home";
import NegociosHome from "@/componentes/secoes/negocios-home";
import RestaurantesHome from "@/componentes/secoes/restaurantes-home";

export default function HomePagina() {
  return (
    <>
      <Hero />
      <AtalhosPortal />
      <DestaquesHome />
      <EventosHome />
      <HoteisHome />
      <NegociosHome />
      <RestaurantesHome />
      <BlogHome />
    </>
  );
}
