export type BuscaIADominio =
  | "hoteis"
  | "restaurantes"
  | "negocios"
  | "turismo"
  | "eventos"
  | "blog";

export type BuscaIASugestao = {
  dominio: BuscaIADominio;
  titulo: string;
  descricao: string;
  categoria: string;
  href: string;
};

export type BuscaIAResultado = {
  dominio: BuscaIADominio;
  filtro: string;
  mensagem: string;
  labelExplorar: string;
  linkExplorar: string;
  sugestoes: BuscaIASugestao[];
};
