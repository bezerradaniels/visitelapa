import Container from "@/componentes/ui/container";
import FormularioContato from "@/componentes/contato/formulario-contato";
import InformacoesContato from "@/componentes/contato/informacoes-contato";

export default function ContatoPagina() {
  return (
    <div className="bg-page py-16 md:py-24">
      <Container>
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
            Contato
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            Um canal direto com o portal
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-600 md:text-lg">
            Esta página organiza o fluxo inicial de contatos do projeto e já
            prepara a futura integração com persistência, triagem e resposta no dashboard.
          </p>
        </div>

        <div className="mt-12 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <FormularioContato />
          <InformacoesContato />
        </div>
      </Container>
    </div>
  );
}
