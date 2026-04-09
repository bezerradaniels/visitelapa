import { NextRequest, NextResponse } from "next/server";
import {
  cookieDashboardAutoriza,
  obterCookieDashboardAdmin,
} from "@/servicos/admin-auth";
import {
  atualizarStatusRegistro,
  excluirRegistroDashboard,
  pausarRegistroDashboard,
} from "@/servicos/dashboard-persistencia";
import { DashboardModuloId, PublicSubmissionAction } from "@/tipos/plataforma";

const STATUS_POR_ACAO: Record<string, string> = {
  aprovar: "publicado",
  solicitar_revisao: "revisao",
  rejeitar: "rejeitado",
  arquivar: "arquivado",
};

function validarAcessoAdmin(request: NextRequest) {
  const cookieConfig = obterCookieDashboardAdmin();
  return cookieDashboardAutoriza(request.cookies.get(cookieConfig.nome)?.value);
}

type RouteContext = { params: Promise<{ modulo: string; slug: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  if (!validarAcessoAdmin(request)) {
    return NextResponse.json({ erro: "Acesso não autorizado." }, { status: 401 });
  }

  const { modulo, slug } = await context.params;
  const body = await request.json();
  const action = typeof body.action === "string" ? body.action : "";
  const novoStatus = STATUS_POR_ACAO[action];

  if (!novoStatus) {
    return NextResponse.json({ erro: "Ação editorial inválida." }, { status: 400 });
  }

  try {
    await atualizarStatusRegistro(modulo as DashboardModuloId, slug, novoStatus);
    return NextResponse.json({ sucesso: true });
  } catch (error) {
    return NextResponse.json(
      {
        erro:
          error instanceof Error
            ? error.message
            : "Não foi possível concluir a ação editorial.",
      },
      { status: 400 }
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!validarAcessoAdmin(request)) {
    return NextResponse.json({ erro: "Acesso não autorizado." }, { status: 401 });
  }

  const { modulo, slug } = await context.params;
  const body = await request.json();

  if (body.action !== "pausar") {
    return NextResponse.json({ erro: "Ação inválida." }, { status: 400 });
  }

  try {
    await pausarRegistroDashboard(modulo as DashboardModuloId, slug);
    return NextResponse.json({ sucesso: true });
  } catch (error) {
    return NextResponse.json(
      { erro: error instanceof Error ? error.message : "Não foi possível pausar o registro." },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  if (!validarAcessoAdmin(request)) {
    return NextResponse.json({ erro: "Acesso não autorizado." }, { status: 401 });
  }

  const { modulo, slug } = await context.params;

  try {
    await excluirRegistroDashboard(modulo as DashboardModuloId, slug);
    return NextResponse.json({ sucesso: true });
  } catch (error) {
    return NextResponse.json(
      { erro: error instanceof Error ? error.message : "Não foi possível excluir o registro." },
      { status: 400 }
    );
  }
}
