"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  LockPasswordIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import Icone from "@/componentes/ui/icone";
import {
  obterCookieDashboardAdmin,
  validarCredenciaisDashboardTemporarias,
} from "@/servicos/admin-auth";
import { assetsEstaticos } from "@/dados/assets";

export default function CardLogin() {
  const router = useRouter();

  const cookieConfig = obterCookieDashboardAdmin();
  const [isPending, startTransition] = useTransition();
  const [identificador, setIdentificador] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validarCredenciaisDashboardTemporarias(identificador, senha)) {
      setErro("Usuário ou senha inválidos para o acesso temporário.");
      return;
    }

    startTransition(() => {
      document.cookie = `${cookieConfig.nome}=${cookieConfig.valorAutorizado}; path=/; max-age=${cookieConfig.duracaoSegundos}; SameSite=Lax`;
      setErro(null);
      router.push("/dashboard");
    });
  }

  return (
    <div className="w-full max-w-md rounded-4xl border border-slate-200 bg-white p-8">
      <Image
        src={assetsEstaticos.logos.simbolo}
        alt="Visite Lapa"
        width={240}
        height={64}
        className="mx-auto block w-48 mb-6"
      />

      {erro ? (
        <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          {erro}
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className=" space-y-5"
      >
        <label className="flex flex-col gap-3">
          <span className="text-sm font-semibold text-main">
            Login
          </span>
          <div className="flex items-center gap-3 rounded-[32px] border border-slate-200 px-4 py-3">
            <Icone
              icon={UserIcon}
              size={18}
              className="text-slate-500"
            />
            <input
              type="text"
              required
              value={identificador}
              onChange={(event) => setIdentificador(event.target.value)}
              placeholder="admin ou admin@visitelapa.com.br"
              className="w-full bg-transparent text-sm text-main outline-none placeholder:text-slate-400"
            />
          </div>
        </label>

        <label className="flex flex-col gap-3">
          <span className="text-sm font-semibold text-main">Senha</span>
          <div className="flex items-center gap-3 rounded-[32px] border border-slate-200 px-4 py-3">
            <Icone
              icon={LockPasswordIcon}
              size={18}
              className="text-slate-500"
            />
            <input
              type="password"
              required
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              placeholder="Digite sua senha"
              className="w-full bg-transparent text-sm text-main outline-none placeholder:text-slate-400"
            />
          </div>
        </label>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-[32px] bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Entrando..." : "Entrar"}
        </button>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-main text-opacity-70 transition hover:text-opacity-100"
          >
            Voltar para o portal
          </Link>
        </div>
      </form>

    </div>
  );
}
