import Icone from "@/componentes/ui/icone";
import { Search01Icon } from "@hugeicons/core-free-icons";

type Props = {
  valor: string;
  onChange: (valor: string) => void;
  placeholder?: string;
};

export default function CampoBusca({ valor, onChange, placeholder = "Buscar..." }: Props) {
  return (
    <div className="relative w-full max-w-md">
      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
        <Icone icon={Search01Icon} size={16} className="text-gray-400" />
      </div>
      <input
        type="text"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
      />
    </div>
  );
}
