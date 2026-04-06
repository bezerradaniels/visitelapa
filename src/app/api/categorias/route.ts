import { NextRequest, NextResponse } from "next/server";
import { listarOpcoesCategoriasCadastro } from "@/servicos/categorias-cadastro";
import { moduloEhTipoCadastro } from "@/servicos/cadastros";

export async function GET(request: NextRequest) {
  const tipo = request.nextUrl.searchParams.get("tipo") ?? "";

  if (!moduloEhTipoCadastro(tipo)) {
    return NextResponse.json(
      { erro: "Tipo de cadastro inválido." },
      { status: 400 }
    );
  }

  const options = await listarOpcoesCategoriasCadastro(tipo);

  return NextResponse.json({ options });
}
