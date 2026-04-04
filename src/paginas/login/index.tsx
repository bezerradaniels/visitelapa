import CardLogin from "@/componentes/auth/card-login";

export default function LoginPagina() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-page px-4 py-12">
      <div className="w-full max-w-sm">
        <CardLogin />
      </div>
    </div>
  );
}
