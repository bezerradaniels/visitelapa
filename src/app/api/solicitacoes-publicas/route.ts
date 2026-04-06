import { NextRequest, NextResponse } from "next/server";
import {
  obterCamposCadastroPublico,
  obterTipoCadastroPublico,
  validarCamposObrigatorios,
} from "@/servicos/cadastros";
import { aplicarFormatacoesCadastro } from "@/servicos/formulario-formatacao";
import { salvarSolicitacaoPublica } from "@/servicos/solicitacoes-publicas";
import { CadastroTipoId, FormValues } from "@/tipos/plataforma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tipo = typeof body.tipo === "string" ? body.tipo : "";

    if (!obterTipoCadastroPublico(tipo)) {
      return NextResponse.json(
        { erro: "Tipo de cadastro público inválido." },
        { status: 400 }
      );
    }

    const values = aplicarFormatacoesCadastro((body.values ?? {}) as FormValues);
    const campos = obterCamposCadastroPublico(tipo as CadastroTipoId);
    const errors = validarCamposObrigatorios(campos, values);

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          erro: "Preencha os campos obrigatórios antes de enviar.",
          errors,
        },
        { status: 400 }
      );
    }

    const resultado = await salvarSolicitacaoPublica(tipo as CadastroTipoId, values);

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
            : "Não foi possível registrar a solicitação pública.",
      },
      { status: 400 }
    );
  }
}
