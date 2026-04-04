import { configuracaoPortal } from "@/dados/portal";

export function obterConfiguracaoPortal() {
  return configuracaoPortal;
}

export function criarLinkWhatsappPortal(mensagem: string) {
  return `https://wa.me/${configuracaoPortal.whatsappNumero}?text=${encodeURIComponent(
    mensagem
  )}`;
}

export function criarMensagemSolicitacaoAlteracao(params: {
  tipo: string;
  titulo: string;
  url: string;
}) {
  return [
    `Olá, equipe ${configuracaoPortal.nome}!`,
    "",
    "Quero solicitar uma alteração nesta página:",
    `Tipo: ${params.tipo}`,
    `Título: ${params.titulo}`,
    `Link: ${params.url}`,
    "",
    "Descrevo abaixo as alterações desejadas:",
  ].join("\n");
}

export function obterUsernamesNegociosProibidos() {
  return [...configuracaoPortal.usernamesNegociosProibidos] as string[];
}
