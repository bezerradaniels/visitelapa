export const acessoTemporarioDashboard = {
  username: "admin",
  email: "admin@visitelapa.com.br",
  senha: "visitelapa2026",
} as const;

export const cookieDashboardAdmin = {
  nome: "visite_lapa_admin",
  valorAutorizado: "autorizado",
  duracaoSegundos: 60 * 60 * 24 * 30, // 30 dias
} as const;
