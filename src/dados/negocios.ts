export type Negocio = {
  slug: string;
  username: string;
  categoria: string;
  titulo: string;
  descricao: string;
  logo: string;
  imagem: string;
  whatsapp: string;
  instagram: string;
  endereco: string;
  atendimento: string;
  contato: string;
  sobre: string[];
  especialidades: string[];
  diferenciais: string[];
  destaqueListagem: string;
};

export const negocios: Negocio[] = [];
