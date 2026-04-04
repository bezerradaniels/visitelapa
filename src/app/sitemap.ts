import type { MetadataRoute } from "next";
import { listarNegocios } from "@/servicos/negocios";
import { listarHoteis } from "@/servicos/hoteis";
import { listarEventos } from "@/servicos/eventos";
import { listarRestaurantes } from "@/servicos/restaurantes";
import { listarTurismo } from "@/servicos/turismo";
import { listarBlog } from "@/servicos/blog";

const BASE_URL = "https://visitelapa.com.br";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let negocios: { slug: string }[] = [];
  let hoteis: { slug: string }[] = [];
  let eventos: { slug: string }[] = [];
  let restaurantes: { slug: string }[] = [];
  let turismo: { slug: string }[] = [];
  let blog: { slug: string }[] = [];

  try {
    [negocios, hoteis, eventos, restaurantes, turismo, blog] =
      await Promise.all([
        listarNegocios(),
        listarHoteis(),
        listarEventos(),
        listarRestaurantes(),
        listarTurismo(),
        listarBlog(),
      ]);
  } catch {
    // Supabase not available during build — return only static routes
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/negocios`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/hoteis`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/eventos`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/restaurantes`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/turismo`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/contato`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/cadastrar-conteudo`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const negociosRoutes: MetadataRoute.Sitemap = negocios.map((item) => ({
    url: `${BASE_URL}/negocios/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const hoteisRoutes: MetadataRoute.Sitemap = hoteis.map((item) => ({
    url: `${BASE_URL}/hoteis/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const eventosRoutes: MetadataRoute.Sitemap = eventos.map((item) => ({
    url: `${BASE_URL}/eventos/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const restaurantesRoutes: MetadataRoute.Sitemap = restaurantes.map((item) => ({
    url: `${BASE_URL}/restaurantes/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const turismoRoutes: MetadataRoute.Sitemap = turismo.map((item) => ({
    url: `${BASE_URL}/turismo/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blog.map((item) => ({
    url: `${BASE_URL}/blog/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...negociosRoutes,
    ...hoteisRoutes,
    ...eventosRoutes,
    ...restaurantesRoutes,
    ...turismoRoutes,
    ...blogRoutes,
  ];
}
