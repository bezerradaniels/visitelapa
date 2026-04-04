import { Calendar03Icon, Clock01Icon } from "@hugeicons/core-free-icons";
import BlocoListaInformacoes from "../bloco-lista-informacoes";

type BlocoPeriodoProps = {
  titulo?: string;
  principalLabel: string;
  principalValor: string;
  secundarioLabel?: string;
  secundarioValor?: string;
};

export default function BlocoPeriodo({
  titulo = "Período",
  principalLabel,
  principalValor,
  secundarioLabel,
  secundarioValor,
}: BlocoPeriodoProps) {
  return (
    <BlocoListaInformacoes
      titulo={titulo}
      itens={[
        {
          label: principalLabel,
          value: principalValor,
          icon: Calendar03Icon,
        },
        ...(secundarioLabel && secundarioValor
          ? [
              {
                label: secundarioLabel,
                value: secundarioValor,
                icon: Clock01Icon,
              },
            ]
          : []),
      ]}
    />
  );
}
