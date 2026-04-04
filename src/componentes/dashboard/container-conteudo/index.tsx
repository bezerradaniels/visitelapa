import { ReactNode } from "react";

type ContainerConteudoProps = {
  children: ReactNode;
};

export default function ContainerConteudo({
  children,
}: ContainerConteudoProps) {
  return <div className="space-y-8 p-6 md:p-10">{children}</div>;
}
