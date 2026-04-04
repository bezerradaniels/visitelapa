import { acessoTemporarioDashboard, cookieDashboardAdmin } from "@/dados/admin";

export function obterCredenciaisDashboardTemporarias() {
  return acessoTemporarioDashboard;
}

export function validarCredenciaisDashboardTemporarias(
  identificador: string,
  senha: string
) {
  const valor = identificador.trim().toLowerCase();

  return (
    senha === acessoTemporarioDashboard.senha &&
    (valor === acessoTemporarioDashboard.username ||
      valor === acessoTemporarioDashboard.email)
  );
}

export function obterCookieDashboardAdmin() {
  return cookieDashboardAdmin;
}
