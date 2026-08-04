import { bustPath } from "../lib/char-icon";

export { bustPath } from "../lib/char-icon";

type CharacterBadgeProps = {
  charKey: string;
  color: string;
  name: string;
  size?: number;
  className?: string;
  shape?: "circle" | "square";
};

export function CharacterBadge({
  charKey,
  color,
  name,
  size = 48,
  className,
  shape = "circle",
}: CharacterBadgeProps) {
  const src = bustPath(charKey);

  return (
    <span
      className={`char-badge char-badge--${shape}${src ? "" : " char-badge--empty"}${className ? ` ${className}` : ""}`}
      style={{ width: size, height: size, backgroundColor: color }}
      aria-label={src ? undefined : name}
    >
      {src ? <img src={src} alt={name} /> : null}
    </span>
  );
}
