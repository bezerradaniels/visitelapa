import BuscaIAForm from "./busca-ia-form";

const SUGESTOES = [
  "Hotéis perto do santuário",
  "Eventos desta semana",
  "Restaurantes bem avaliados",
  "O que fazer em 1 dia",
];

export default function Hero() {
  return (
    <section className="relative min-h-[40vh] py-20 overflow-hidden px-4 bg-white">
      {/* Background aurora effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-sky-200/40 blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-fuchsia-200/30 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-teal-200/30 blur-[100px] pointer-events-none" />

      <div className="relative mx-auto flex min-h-[40vh] py-20 max-w-4xl flex-col items-center justify-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-medium text-slate-700 bg-slate-100 shadow-sm border border-slate-200">
          Portal de Bom Jesus da Lapa
        </span>

        <h1 className="mt-8 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Descubra Bom Jesus da Lapa de um jeito mais inteligente
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-600 md:text-xl leading-relaxed">
          Encontre hotéis, eventos, restaurantes, negócios e informações locais com
          ajuda de inteligência artificial.
        </p>

        <BuscaIAForm sugestoes={SUGESTOES} />
      </div>
    </section>
  );
}
