export type SecaoBlog = {
  titulo: string;
  texto: string;
};

export type PostBlog = {
  slug: string;
  categoria: string;
  titulo: string;
  descricao: string;
  imagem: string;
  whatsapp: string;
  instagram: string;
  publicadoEm: string;
  leitura: string;
  autor: string;
  conteudo: string[];
  secoes: SecaoBlog[];
  fechamento: string;
  destaqueListagem: string;
};

export const postsBlog: PostBlog[] = [];
