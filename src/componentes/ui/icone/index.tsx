import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";

type IconeProps = {
  icon: IconSvgElement;
  size?: number;
  className?: string;
  strokeWidth?: number;
};

export default function Icone({
  icon,
  size = 20,
  className,
  strokeWidth = 1.8,
}: IconeProps) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      color="currentColor"
    />
  );
}
