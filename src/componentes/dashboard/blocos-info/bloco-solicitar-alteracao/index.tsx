import SolicitarAlteracao from "@/componentes/ui/solicitar-alteracao";

type BlocoSolicitarAlteracaoProps = {
  tipo: string;
  titulo: string;
  url: string;
};

export default function BlocoSolicitarAlteracao(
  props: BlocoSolicitarAlteracaoProps
) {
  return <SolicitarAlteracao {...props} />;
}
