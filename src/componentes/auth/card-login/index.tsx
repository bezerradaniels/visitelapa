"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  LockPasswordIcon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import Icone from "@/componentes/ui/icone";
import { assetsEstaticos } from "@/dados/assets";

export default function CardLogin() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(() => {
      void (async () => {
        try {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: email.trim(),
              senha,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            setErro(data.erro ?? "Não foi possível entrar no painel.");
            return;
          }

          setErro(null);
          router.push("/dashboard");
          router.refresh();
        } catch {
          setErro("Não foi possível conectar ao servidor de autenticação.");
        }
      })();
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
            E-mail
          </span>
          <div className="flex items-center gap-3 rounded-[32px] border border-slate-200 px-4 py-3">
            <Icone
              icon={Mail01Icon}
              size={18}
              className="text-slate-500"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seuemail@exemplo.com"
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
          disabled={isPending || !email.trim() || !senha}
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
