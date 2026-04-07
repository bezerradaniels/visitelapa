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
  | "restaurantes";

export type DashboardModuloId =
  | "paginas"
  | "conteudos"
  | "pacotes"
  | "eventos"
  | "hoteis"
  | "negocios"
  | "restaurantes"
  | "blog"
  | "categorias"
  | "tags"
  | "cidades"
  | "bairros"
  | "contatos";

export type FieldKind =
  | "text"
  | "textarea"
  | "rich-text"
  | "text-array"
  | "select"
  | "checkbox-group"
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
  singleDayFieldName?: string;
  singleDayLabel?: string;
  aspectRatio?: ImageAspectRatio;
  maxFiles?: number;
  accept?: string;
  buttonLabel?: string;
  placeholderSrc?: string;
  allowCustom?: boolean;
  multiple?: boolean;
  size?: number;
  readOnly?: boolean;
  fullWidth?: boolean;
  quickActions?: Array<{
    label: string;
    value: string;
    updates?: Array<{
      name: string;
      value: string;
    }>;
  }>;
};

export type FormValue = string | number | boolean | ImageFieldValue;

export type FormValues = Record<string, FormValue>;

export type AdminTableColumn = {
  key: string;
  label: string;
};

export type AdminTableAction =
  | {
      type: "view" | "edit";
      href: string;
      label?: string;
    }
  | {
      type: "approve" | "reject";
      actionPath: string;
      label?: string;
      confirmMessage?: string;
    };

export type AdminTableRow = {
  id: string;
  href?: string;
  actions?: AdminTableAction[];
  [key: string]: string | AdminTableAction[] | undefined;
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

export type PublicSubmissionDetail = PublicSubmission & {
  contatoWhatsapp: string;
  atualizadoEm: string;
  payload: FormValues;
};

export type PublicSubmissionAction =
  | "salvar"
  | "aprovar"
  | "solicitar_revisao"
  | "rejeitar"
  | "arquivar";

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
