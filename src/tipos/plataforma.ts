export type StatusEditorial =
  | "rascunho"
  | "pendente_aprovacao"
  | "revisao"
  | "publicado"
  | "rejeitado"
  | "arquivado";

export type CadastroTipoId =
  | "pacotes"
  | "eventos"
  | "hoteis"
  | "negocios"
  | "restaurantes"
  | "turismo";

export type DashboardModuloId =
  | "paginas"
  | "conteudos"
  | "pacotes"
  | "eventos"
  | "hoteis"
  | "negocios"
  | "restaurantes"
  | "turismo"
  | "blog"
  | "categorias"
  | "tags"
  | "cidades"
  | "bairros"
  | "contatos";

export type FieldKind =
  | "text"
  | "textarea"
  | "select"
  | "checkbox"
  | "switch"
  | "date"
  | "date-range"
  | "currency"
  | "number"
  | "tags"
  | "image-single"
  | "image-gallery";

export type ImageAspectRatio = "1:1" | "16:10";

export type ImageCropFocus = "center" | "top" | "bottom" | "left" | "right";

export type ImageFieldItem = {
  id: string;
  name: string;
  src: string;
  cropFocus: ImageCropFocus;
  zoom: number;
};

export type ImageFieldValue = ImageFieldItem[];

export type FieldOption = {
  label: string;
  value: string;
};

export type FormFieldDefinition = {
  kind: FieldKind;
  name: string;
  label: string;
  section: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  options?: FieldOption[];
  rows?: number;
  maxLength?: number;
  min?: number;
  step?: number;
  startName?: string;
  endName?: string;
  startLabel?: string;
  endLabel?: string;
  aspectRatio?: ImageAspectRatio;
  maxFiles?: number;
  accept?: string;
  buttonLabel?: string;
  placeholderSrc?: string;
};

export type FormValue = string | number | boolean | ImageFieldValue;

export type FormValues = Record<string, FormValue>;

export type AdminTableColumn = {
  key: string;
  label: string;
};

export type AdminTableRow = Record<string, string> & {
  id: string;
  href?: string;
};

export type DashboardModuleConfig = {
  id: DashboardModuloId;
  label: string;
  descricao: string;
  href: string;
  acaoLabel?: string;
  supportsCreate?: boolean;
  supportsEdit?: boolean;
};

export type DashboardStat = {
  id: string;
  label: string;
  valor: string;
  descricao: string;
};

export type PublicSubmission = {
  id: string;
  tipo: CadastroTipoId;
  titulo: string;
  responsavel: string;
  contatoEmail: string;
  status: StatusEditorial;
  criadoEm: string;
};

export type PortalContactMessage = {
  id: string;
  nome: string;
  email: string;
  whatsapp: string;
  assunto: string;
  mensagem: string;
  status: "novo" | "lido" | "respondido" | "arquivado";
  recebidoEm: string;
};
