import { createHmac, timingSafeEqual } from "crypto";
import { acessoTemporarioDashboard, cookieDashboardAdmin } from "@/dados/admin";

type DashboardSession = {
  identificador: string;
  origem: "supabase" | "temporario" | "legado";
  exp: number;
};

function normalizarIdentificadorDashboard(valor: string) {
  return valor.trim().toLowerCase();
}

function obterSegredoSessaoDashboard() {
  return (
    process.env.DASHBOARD_AUTH_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "visite-lapa-dashboard"
  );
}

function assinarSessaoDashboard(payloadCodificado: string) {
  return createHmac("sha256", obterSegredoSessaoDashboard())
    .update(payloadCodificado)
    .digest("base64url");
}

export function obterCredenciaisDashboardTemporarias() {
  return acessoTemporarioDashboard;
}

export function validarCredenciaisDashboardTemporarias(
  identificador: string,
  senha: string
) {
  const valor = normalizarIdentificadorDashboard(identificador);

  return (
    senha === acessoTemporarioDashboard.senha &&
    (valor === acessoTemporarioDashboard.username ||
      valor === acessoTemporarioDashboard.email)
  );
}

export function obterCookieDashboardAdmin() {
  return cookieDashboardAdmin;
}

export function criarSessaoDashboard({
  identificador,
  origem,
}: {
  identificador: string;
  origem: "supabase" | "temporario";
}) {
  const cookieConfig = obterCookieDashboardAdmin();
  const agora = Math.floor(Date.now() / 1000);
  const payload: DashboardSession = {
    identificador: normalizarIdentificadorDashboard(identificador),
    origem,
    exp: agora + cookieConfig.duracaoSegundos,
  };
  const payloadCodificado = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const assinatura = assinarSessaoDashboard(payloadCodificado);

  return `${payloadCodificado}.${assinatura}`;
}

export function validarSessaoDashboard(token?: string | null) {
  const cookieConfig = obterCookieDashboardAdmin();

  if (!token) {
    return null;
  }

  if (token === cookieConfig.valorAutorizado) {
    return {
      identificador: acessoTemporarioDashboard.email,
      origem: "legado" as const,
      exp: Number.MAX_SAFE_INTEGER,
    };
  }

  const [payloadCodificado, assinatura] = token.split(".");

  if (!payloadCodificado || !assinatura) {
    return null;
  }

  const assinaturaEsperada = assinarSessaoDashboard(payloadCodificado);
  const assinaturaBuffer = Buffer.from(assinatura);
  const assinaturaEsperadaBuffer = Buffer.from(assinaturaEsperada);

  if (
    assinaturaBuffer.length !== assinaturaEsperadaBuffer.length ||
    !timingSafeEqual(assinaturaBuffer, assinaturaEsperadaBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(payloadCodificado, "base64url").toString("utf8")
    ) as Partial<DashboardSession>;

    if (
      typeof payload.identificador !== "string" ||
      typeof payload.origem !== "string" ||
      typeof payload.exp !== "number"
    ) {
      return null;
    }

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    if (
      payload.origem !== "supabase" &&
      payload.origem !== "temporario" &&
      payload.origem !== "legado"
    ) {
      return null;
    }

    return {
      identificador: normalizarIdentificadorDashboard(payload.identificador),
      origem: payload.origem,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}

export function cookieDashboardAutoriza(valorCookie?: string | null) {
  return Boolean(validarSessaoDashboard(valorCookie));
}
