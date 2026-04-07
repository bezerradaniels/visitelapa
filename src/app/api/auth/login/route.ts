import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  criarSessaoDashboard,
  obterCookieDashboardAdmin,
  validarCredenciaisDashboardTemporarias,
} from "@/servicos/admin-auth";

function tentarAutenticarSupabase(email: string, senha: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl.includes("placeholder") ||
    supabaseAnonKey.includes("placeholder")
  ) {
    return null;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return supabase.auth.signInWithPassword({ email, password: senha });
}

function obterDominioCookie(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const dominio = host.split(":")[0];
  if (dominio === "localhost" || dominio.startsWith("127.") || dominio.startsWith("0.")) {
    return undefined;
  }
  return dominio.replace(/^www\./, ".");
}

function definirCookieAdmin(
  response: NextResponse,
  sessao: string,
  request: NextRequest
) {
  const cookieConfig = obterCookieDashboardAdmin();
  response.cookies.set(cookieConfig.nome, sessao, {
    path: "/",
    maxAge: cookieConfig.duracaoSegundos,
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    domain: obterDominioCookie(request),
  });
}

function anexarMetadadosSessaoDashboard(response: NextResponse, sessao: string) {
  const cookieConfig = obterCookieDashboardAdmin();

  response.headers.set("x-dashboard-cookie-name", cookieConfig.nome);
  response.headers.set("x-dashboard-cookie-max-age", String(cookieConfig.duracaoSegundos));
  response.headers.set(
    "x-dashboard-session",
    process.env.NODE_ENV === "production" ? "set" : sessao
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = String(body.email ?? "").trim();
  const senha = String(body.senha ?? "");

  if (!email || !senha) {
    return NextResponse.json(
      { erro: "Informe e-mail e senha para acessar o painel." },
      { status: 400 }
    );
  }

  // 1. Tentar autenticação via Supabase (quando configurado)
  try {
    const authPromise = tentarAutenticarSupabase(email, senha);
    if (authPromise) {
      const { data, error } = await authPromise;
      if (!error && data.user) {
        const sessao = criarSessaoDashboard({
          identificador: data.user.email ?? email,
          origem: "supabase",
        });
        const response = NextResponse.json({ sucesso: true });
        definirCookieAdmin(response, sessao, request);
        anexarMetadadosSessaoDashboard(response, sessao);
        return response;
      }
    }
  } catch {
    // Supabase não disponível — continua para fallback
  }

  // 2. Fallback: credenciais administrativas temporárias
  if (validarCredenciaisDashboardTemporarias(email, senha)) {
    const sessao = criarSessaoDashboard({
      identificador: email,
      origem: "temporario",
    });
    const response = NextResponse.json({ sucesso: true });
    definirCookieAdmin(response, sessao, request);
    anexarMetadadosSessaoDashboard(response, sessao);
    return response;
  }

  return NextResponse.json(
    { erro: "Usuário ou senha inválidos." },
    { status: 401 }
  );
}
