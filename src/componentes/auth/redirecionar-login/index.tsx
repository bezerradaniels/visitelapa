"use client";

import { useEffect } from "react";

export default function RedirecionarLogin() {
  useEffect(() => {
    window.location.replace("/login");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-center text-sm text-slate-600">
      Redirecionando para o login...
    </div>
  );
}
