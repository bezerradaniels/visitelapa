import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
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

function definirCookieAdmin(response: NextResponse) {
  const cookieConfig = obterCookieDashboardAdmin();
  response.cookies.set(cookieConfig.nome, cookieConfig.valorAutorizado, {
    path: "/",
    maxAge: cookieConfig.duracaoSegundos,
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
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
        const response = NextResponse.json({ sucesso: true });
        definirCookieAdmin(response);
        return response;
      }
    }
  } catch {
    // Supabase não disponível — continua para fallback
  }

  // 2. Fallback: credenciais administrativas temporárias
  if (validarCredenciaisDashboardTemporarias(email, senha)) {
    const response = NextResponse.json({ sucesso: true });
    definirCookieAdmin(response);
    return response;
  }

  return NextResponse.json(
    { erro: "Usuário ou senha inválidos." },
    { status: 401 }
  );
}
