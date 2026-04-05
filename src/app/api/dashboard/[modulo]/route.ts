import { NextRequest, NextResponse } from "next/server";
import { obterCookieDashboardAdmin } from "@/servicos/admin-auth";
import { salvarRegistroDashboard } from "@/servicos/dashboard-persistencia";
import { DashboardModuloId, FormValues } from "@/tipos/plataforma";

function validarAcessoAdmin(request: NextRequest) {
  const cookieConfig = obterCookieDashboardAdmin();
  return request.cookies.get(cookieConfig.nome)?.value === cookieConfig.valorAutorizado;
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ modulo: string }> }
) {
  if (!validarAcessoAdmin(request)) {
    return NextResponse.json({ erro: "Acesso não autorizado." }, { status: 401 });
  }

  const { modulo } = await context.params;
  const body = await request.json();
  const values = (body.values ?? {}) as FormValues;
  const slugAtual = typeof body.slug === "string" ? body.slug : undefined;

  try {
    const resultado = await salvarRegistroDashboard(
      modulo as DashboardModuloId,
      values,
      slugAtual
    );

    return NextResponse.json({
      sucesso: true,
      resultado,
    });
  } catch (error) {
    return NextResponse.json(
      {
        erro:
          error instanceof Error
            ? error.message
            : "Não foi possível salvar este registro.",
      },
      { status: 400 }
    );
  }
}
