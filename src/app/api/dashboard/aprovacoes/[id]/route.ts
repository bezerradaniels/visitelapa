import { NextRequest, NextResponse } from "next/server";
import { obterCookieDashboardAdmin } from "@/servicos/admin-auth";
import { executarAcaoSolicitacaoPublica } from "@/servicos/solicitacoes-publicas";
import { FormValues, PublicSubmissionAction } from "@/tipos/plataforma";

const ACOES_VALIDAS = new Set<PublicSubmissionAction>([
  "salvar",
  "aprovar",
  "solicitar_revisao",
  "rejeitar",
  "arquivar",
]);

function validarAcessoAdmin(request: NextRequest) {
  const cookieConfig = obterCookieDashboardAdmin();
  return request.cookies.get(cookieConfig.nome)?.value === cookieConfig.valorAutorizado;
}

function extrairValores(body: unknown) {
  if (!body || typeof body !== "object") {
    return undefined;
  }

  const values = (body as { values?: unknown }).values;

  if (!values || typeof values !== "object" || Array.isArray(values)) {
    return undefined;
  }

  return values as FormValues;
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!validarAcessoAdmin(request)) {
    return NextResponse.json({ erro: "Acesso não autorizado." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();
  const action = typeof body.action === "string" ? body.action : "";

  if (!ACOES_VALIDAS.has(action as PublicSubmissionAction)) {
    return NextResponse.json({ erro: "Ação de aprovação inválida." }, { status: 400 });
  }

  try {
    const resultado = await executarAcaoSolicitacaoPublica({
      id,
      action: action as PublicSubmissionAction,
      values: extrairValores(body),
    });

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
            : "Não foi possível concluir a ação desta solicitação.",
      },
      { status: 400 }
    );
  }
}
