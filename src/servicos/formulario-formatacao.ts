import { FormValue, FormValues } from "@/tipos/plataforma";

function somenteDigitos(valor: string) {
  return valor.replace(/\D/g, "");
}

export function formatarTelefoneBrasil(valor: string) {
  const digitos = somenteDigitos(valor).slice(0, 11);

  if (!digitos) {
    return "";
  }

  if (digitos.length <= 2) {
    return `(${digitos}`;
  }

  if (digitos.length <= 7) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  }

  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

export function normalizarInstagramUsername(valor: string) {
  const textoBase = valor.trim();

  if (!textoBase) {
    return "";
  }

  const semQuery = textoBase.replace(/[?#].*$/, "").replace(/\/+$/, "");
  const matchInstagram = semQuery.match(/instagram\.com\/([^/?#]+)/i);

  let username = matchInstagram?.[1] ?? semQuery;

  if (!matchInstagram && username.includes("/")) {
    const segmentos = username.split("/").filter(Boolean);
    username = segmentos[segmentos.length - 1] ?? username;
  }

  return username.replace(/^@+/, "").replace(/[^a-zA-Z0-9._]/g, "").toLowerCase();
}

export function parseMoedaBrl(valor: string | number) {
  const texto = typeof valor === "number" ? String(valor) : valor.trim();

  if (!texto) {
    return 0;
  }

  const normalizado = texto.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const numero = Number(normalizado);

  return Number.isFinite(numero) ? numero : 0;
}

export function formatarMoedaBrl(valor: string) {
  const digitos = somenteDigitos(valor);

  if (!digitos) {
    return "";
  }

  return formatarMoedaBrlPorNumero(Number(digitos) / 100);
}

export function formatarMoedaBrlPorNumero(valor: number) {
  if (!Number.isFinite(valor)) {
    return "";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(valor);
}

export function calcularValorParcelaFormatado(
  totalParcelado: FormValue | undefined,
  parcelas: FormValue | undefined
) {
  const valorTotal = parseMoedaBrl(typeof totalParcelado === "string" ? totalParcelado : "");
  const quantidadeParcelas =
    typeof parcelas === "number"
      ? parcelas
      : Number(somenteDigitos(typeof parcelas === "string" ? parcelas : ""));

  if (!valorTotal || !quantidadeParcelas) {
    return "";
  }

  return formatarMoedaBrlPorNumero(valorTotal / quantidadeParcelas);
}

export function montarLocalidade(cidade?: FormValue, estado?: FormValue) {
  const cidadeTexto = typeof cidade === "string" ? cidade.trim() : "";
  const estadoTexto = typeof estado === "string" ? estado.trim() : "";

  return [cidadeTexto, estadoTexto].filter(Boolean).join(" - ");
}

export function aplicarFormatacoesCadastro(values: FormValues) {
  const nextValues: FormValues = { ...values };

  const camposTelefone = ["whatsapp", "whatsappResponsavel"];

  for (const campo of camposTelefone) {
    const valor = nextValues[campo];
    if (typeof valor === "string") {
      nextValues[campo] = formatarTelefoneBrasil(valor);
    }
  }

  if (typeof nextValues.instagram === "string") {
    nextValues.instagram = normalizarInstagramUsername(nextValues.instagram);
  }

  if (typeof nextValues.valorParcelado === "string" || typeof nextValues.parcelas === "string") {
    nextValues.valorFinalParcelado = calcularValorParcelaFormatado(
      nextValues.valorParcelado,
      nextValues.parcelas
    );
  }

  if ("origemCidade" in nextValues || "origemEstado" in nextValues) {
    nextValues.origem = montarLocalidade(nextValues.origemCidade, nextValues.origemEstado);
  }

  if ("destinoCidade" in nextValues || "destinoEstado" in nextValues) {
    nextValues.destino = montarLocalidade(nextValues.destinoCidade, nextValues.destinoEstado);
  }

  return nextValues;
}
