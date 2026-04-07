import { NextResponse } from "next/server";
import { obterCookieDashboardAdmin } from "@/servicos/admin-auth";

export async function GET() {
  const cookieConfig = obterCookieDashboardAdmin();
  const response = new NextResponse(null, {
    status: 307,
    headers: {
      Location: "/login",
    },
  });

  response.cookies.set(cookieConfig.nome, "", {
    path: "/",
    maxAge: 0,
  });

  return response;
}
