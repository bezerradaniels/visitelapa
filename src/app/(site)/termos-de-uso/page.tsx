import type { Metadata } from "next";
import Container from "@/componentes/ui/container";

export const metadata: Metadata = {
  title: "Termos de Uso | Visite Lapa",
  description: "Termos de uso aplicáveis ao envio de conteúdos e uso do portal Visite Lapa.",
};

export default function Page() {
  return (
    <div className="bg-page py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
            Legal
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
            Termos de uso
          </h1>
          <div className="mt-8 space-y-6 text-base leading-8 text-slate-600">
            <p>
              Ao enviar um cadastro ao Visite Lapa, você declara que as informações
              fornecidas são verdadeiras, atualizadas e de sua responsabilidade.
            </p>
            <p>
              Todo material enviado pode passar por revisão editorial antes de eventual
              publicação, edição, aprovação ou recusa pela equipe do portal.
            </p>
            <p>
              Você também confirma que possui autorização para compartilhar textos,
              imagens, marcas e dados de contato associados ao conteúdo enviado.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
