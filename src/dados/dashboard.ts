import { PortalContactMessage, PublicSubmission, StatusEditorial } from "@/tipos/plataforma";

export type RegistroDashboard = {
  slug: string;
  titulo: string;
  categoria?: string;
  status: StatusEditorial;
  atualizadoEm: string;
  cidade?: string;
};

export type PacoteDashboard = {
  slug: string;
  titulo: string;
  categoria: string;
  descricao: string;
  origem: string;
  destino: string;
  dataIda: string;
  dataRetorno: string;
  valorVista: string;
  valorParcelado: string;
  parcelas: string;
  status: StatusEditorial;
  atualizadoEm: string;
};

export const paginasDashboard: RegistroDashboard[] = [];
export const conteudosDashboard: RegistroDashboard[] = [];
export const pacotesDashboard: PacoteDashboard[] = [];
export const categoriasDashboard: RegistroDashboard[] = [];
export const tagsDashboard: RegistroDashboard[] = [];
export const cidadesDashboard: RegistroDashboard[] = [];
export const bairrosDashboard: RegistroDashboard[] = [];
export const solicitacoesPublicasDashboard: PublicSubmission[] = [];
export const contatosPortalDashboard: PortalContactMessage[] = [];
