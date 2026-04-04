import { NextResponse } from "next/server";
import { obterCookieDashboardAdmin } from "@/servicos/admin-auth";

export async function GET(request: Request) {
  const cookieConfig = obterCookieDashboardAdmin();
  const loginUrl = new URL("/login", request.url);
  const response = NextResponse.redirect(loginUrl);

  response.cookies.set(cookieConfig.nome, "", {
    path: "/",
    maxAge: 0,
  });

  return response;
}
