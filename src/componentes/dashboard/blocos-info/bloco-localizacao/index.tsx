import { Location01Icon } from "@hugeicons/core-free-icons";
import BlocoListaInformacoes from "../bloco-lista-informacoes";

type BlocoLocalizacaoProps = {
  local: string;
  label?: string;
};

export default function BlocoLocalizacao({
  local,
  label = "Localização",
}: BlocoLocalizacaoProps) {
  return (
    <BlocoListaInformacoes
      titulo="Localização"
      itens={[
        {
          label,
          value: local,
          icon: Location01Icon,
        },
      ]}
    />
  );
}
