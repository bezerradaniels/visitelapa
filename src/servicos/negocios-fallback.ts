const PALETAS_PASTEL = [
  {
    base: "#F9E7EC",
    altA: "#E3ECFF",
    altB: "#FDEFD7",
    altC: "#DDF4EF",
    texto: "#2B4763",
    linha: "#54708A",
  },
  {
    base: "#F7EDD9",
    altA: "#E3F1E8",
    altB: "#E9E6FF",
    altC: "#F9DDE5",
    texto: "#304B57",
    linha: "#5B7681",
  },
  {
    base: "#E7EFFB",
    altA: "#F9E4D7",
    altB: "#E5F6F0",
    altC: "#EFE3FB",
    texto: "#2C425C",
    linha: "#597188",
  },
  {
    base: "#F3E8FB",
    altA: "#DDEEFE",
    altB: "#FCE7D7",
    altC: "#E6F6E8",
    texto: "#3A4462",
    linha: "#67718E",
  },
] as const;

function criarHash(valor: string) {
  return Array.from(valor).reduce((acc, caractere) => acc + caractere.charCodeAt(0), 0);
}

function selecionarPaleta(valor: string) {
  return PALETAS_PASTEL[criarHash(valor) % PALETAS_PASTEL.length];
}

function escaparTextoSvg(valor: string) {
  return valor
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function paraDataUriSvg(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function obterIniciaisNegocio(titulo: string) {
  const partes = titulo
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (partes.length === 0) {
    return "NG";
  }

  if (partes.length === 1) {
    return partes[0].slice(0, 2).toUpperCase();
  }

  return `${partes[0][0] ?? ""}${partes[1][0] ?? ""}`.toUpperCase();
}

export function criarLogoFallbackNegocio(titulo: string) {
  const iniciais = escaparTextoSvg(obterIniciaisNegocio(titulo));
  const paleta = selecionarPaleta(titulo);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320" fill="none">
      <rect width="320" height="320" rx="64" fill="${paleta.base}"/>
      <rect x="-36" y="14" width="116" height="392" rx="58" transform="rotate(-18 -36 14)" fill="${paleta.altA}"/>
      <rect x="64" y="-16" width="116" height="392" rx="58" transform="rotate(-18 64 -16)" fill="${paleta.altB}"/>
      <rect x="164" y="10" width="116" height="392" rx="58" transform="rotate(-18 164 10)" fill="${paleta.altC}"/>
      <rect x="264" y="-20" width="116" height="392" rx="58" transform="rotate(-18 264 -20)" fill="${paleta.altA}"/>
      <circle cx="160" cy="160" r="106" fill="white" fill-opacity="0.22"/>
      <text x="160" y="184" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="94" font-weight="700" letter-spacing="4" fill="${paleta.texto}">
        ${iniciais}
      </text>
    </svg>
  `.trim();

  return paraDataUriSvg(svg);
}

export function criarCapaFallbackNegocio(titulo: string) {
  const paleta = selecionarPaleta(titulo);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" fill="none">
      <rect width="1600" height="900" fill="${paleta.base}"/>
      <circle cx="1360" cy="124" r="244" fill="${paleta.altA}" fill-opacity="0.95"/>
      <circle cx="240" cy="770" r="288" fill="${paleta.altB}" fill-opacity="0.95"/>
      <path d="M0 690C166 594 326 560 482 588C644 618 764 716 932 720C1116 726 1284 610 1600 502V900H0V690Z" fill="${paleta.altC}"/>
      <path d="M0 748C146 674 278 646 430 664C624 688 786 804 968 814C1168 824 1348 708 1600 572V900H0V748Z" fill="${paleta.altA}" fill-opacity="0.86"/>
      <g opacity="0.92">
        <rect x="454" y="258" width="692" height="396" rx="54" fill="white" fill-opacity="0.3"/>
        <path d="M518 304C518 258 555 221 601 221H999C1045 221 1082 258 1082 304V322H518V304Z" fill="white" fill-opacity="0.4"/>
        <path d="M490 338H1110" stroke="${paleta.linha}" stroke-width="18" stroke-linecap="round" stroke-opacity="0.55"/>
        <rect x="578" y="432" width="156" height="176" rx="30" fill="white" fill-opacity="0.34"/>
        <rect x="790" y="414" width="246" height="84" rx="26" fill="white" fill-opacity="0.34"/>
        <rect x="790" y="530" width="246" height="78" rx="26" fill="white" fill-opacity="0.26"/>
        <path d="M556 322L610 268H990L1044 322" stroke="${paleta.linha}" stroke-width="18" stroke-linejoin="round" stroke-opacity="0.72"/>
        <path d="M646 322V624" stroke="${paleta.linha}" stroke-width="14" stroke-linecap="round" stroke-opacity="0.58"/>
        <path d="M868 446H970" stroke="${paleta.linha}" stroke-width="12" stroke-linecap="round" stroke-opacity="0.6"/>
        <path d="M838 562H976" stroke="${paleta.linha}" stroke-width="12" stroke-linecap="round" stroke-opacity="0.52"/>
      </g>
    </svg>
  `.trim();

  return paraDataUriSvg(svg);
}

export function criarLogoFallbackRestaurante(titulo: string) {
  return criarLogoFallbackNegocio(titulo);
}

export function criarCapaFallbackRestaurante(titulo: string) {
  return criarCapaFallbackNegocio(titulo);
}
