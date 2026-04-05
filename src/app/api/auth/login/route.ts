import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { obterCookieDashboardAdmin } from "@/servicos/admin-auth";

function criarClienteSupabaseAuth() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("As credenciais públicas do Supabase não estão configuradas.");
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function POST(request: NextRequest) {
  const { email, senha } = await request.json();

  if (!email || !senha) {
    return NextResponse.json(
      { erro: "Informe e-mail e senha para acessar o painel." },
      { status: 400 }
    );
  }

  try {
    const supabase = criarClienteSupabaseAuth();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: String(email).trim(),
      password: String(senha),
    });

    if (error || !data.user) {
      return NextResponse.json(
        { erro: "Usuário ou senha inválidos." },
        { status: 401 }
      );
    }

    const cookieConfig = obterCookieDashboardAdmin();
    const response = NextResponse.json({ sucesso: true });

    response.cookies.set(cookieConfig.nome, cookieConfig.valorAutorizado, {
      path: "/",
      maxAge: cookieConfig.duracaoSegundos,
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("[auth/login] erro ao autenticar admin:", error);

    return NextResponse.json(
      { erro: "Não foi possível autenticar no momento." },
      { status: 500 }
    );
  }
}
