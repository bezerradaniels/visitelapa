import FormularioAdmin from "@/componentes/dashboard/formulario-admin";
import { FormFieldDefinition } from "@/tipos/plataforma";

const CAMPOS_CONTATO: FormFieldDefinition[] = [
  {
    kind: "text",
    name: "nome",
    label: "Nome",
    section: "Dados principais",
    placeholder: "Seu nome completo",
    required: true,
  },
  {
    kind: "text",
    name: "email",
    label: "Email",
    section: "Dados principais",
    placeholder: "voce@email.com",
    required: true,
  },
  {
    kind: "text",
    name: "whatsapp",
    label: "WhatsApp",
    section: "Dados principais",
    placeholder: "(77) 99999-9999",
    required: true,
  },
  {
    kind: "text",
    name: "assunto",
    label: "Assunto",
    section: "Mensagem",
    placeholder: "Sobre o que você quer falar?",
    required: true,
  },
  {
    kind: "textarea",
    name: "mensagem",
    label: "Mensagem",
    section: "Mensagem",
    placeholder: "Escreva sua mensagem com o máximo de contexto possível.",
    rows: 6,
    required: true,
  },
];

export default function FormularioContato() {
  return (
    <FormularioAdmin
      fields={CAMPOS_CONTATO}
      submitLabel="Enviar mensagem"
      successTitle="Mensagem registrada"
      successDescription="O contato foi preparado no fluxo do projeto e já segue o padrão que depois será persistido no banco."
      variant="publico"
    />
  );
}
