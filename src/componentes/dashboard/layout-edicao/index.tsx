import { ReactNode } from "react";

type LayoutEdicaoProps = {
  children: ReactNode;
  aside: ReactNode;
};

export default function LayoutEdicao({ children, aside }: LayoutEdicaoProps) {
  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-w-0">{children}</div>
      <aside className="space-y-6">{aside}</aside>
    </div>
  );
}
