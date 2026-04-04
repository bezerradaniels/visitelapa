import { Ticket01Icon } from "@hugeicons/core-free-icons";
import BlocoListaInformacoes from "../bloco-lista-informacoes";

type BlocoValoresProps = {
  titulo?: string;
  gratuito?: boolean;
  itens: Array<{
    label: string;
    value: string;
  }>;
};

export default function BlocoValores({
  titulo = "Valores",
  gratuito,
  itens,
}: BlocoValoresProps) {
  return (
    <BlocoListaInformacoes
      titulo={titulo}
      itens={
        gratuito
          ? [
              {
                label: "Acesso",
                value: "Evento gratuito",
                icon: Ticket01Icon,
              },
            ]
          : itens.map((item) => ({
              ...item,
              icon: Ticket01Icon,
            }))
      }
    />
  );
}
