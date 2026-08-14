import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type BrandIdentityCardProps = {
  label?: string;
  title: string;
  identityClass?: string;
  children: ReactNode;
  href?: string;
  badge?: ReactNode;
  media?: ReactNode;
  attachment?: ReactNode;
  footer?: ReactNode;
  variant?: "character" | "student" | "subject";
};

export function BrandIdentityCard({ label, title, identityClass, children, href, badge, media, attachment, footer, variant = "character" }: BrandIdentityCardProps) {
  const contents = <>
    <div className="relative grid min-h-44 justify-items-center items-end overflow-hidden border-b border-dashed border-[color-mix(in_srgb,var(--character-foreground,var(--card-foreground))_58%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--card)_15%,transparent),transparent_72%)] group-data-[card-variant=character]:min-h-28 group-data-[card-variant=character]:self-stretch group-data-[card-variant=character]:border-r-[0.45rem] group-data-[card-variant=character]:border-b-0 group-data-[card-variant=character]:border-r-[var(--character-color)] group-data-[card-variant=character]:bg-[image:var(--character-texture)] group-data-[card-variant=student]:min-h-24 group-data-[card-variant=student]:self-stretch group-data-[card-variant=student]:border-r-[0.45rem] group-data-[card-variant=student]:border-b-0 group-data-[card-variant=student]:border-r-[var(--character-color)] group-data-[card-variant=student]:bg-[image:var(--character-texture)] group-data-[card-variant=subject]:min-h-32 group-data-[card-variant=subject]:border-b-0 group-data-[card-variant=subject]:bg-transparent">
      {label ? <Badge className="absolute top-3 left-3 z-2 max-w-[calc(100%-1.4rem)] backdrop-blur-sm group-data-[card-variant=character]:hidden group-data-[card-variant=student]:hidden" variant="outline">{label}</Badge> : null}
      {badge}
      {media}
    </div>
    <div className="grid min-w-0 content-start gap-2 p-4 group-data-[card-variant=student]:px-4 group-data-[card-variant=student]:py-3 group-data-[card-variant=subject]:min-h-42 group-data-[card-variant=subject]:pt-1 group-data-[card-variant=subject]:text-center">
      <h3 className="m-0 font-display text-[1.65rem] leading-[.95] text-balance group-data-[card-variant=character]:text-[var(--character-color)] group-data-[card-variant=character]:text-[1.45rem] group-data-[card-variant=student]:text-[var(--character-color)] group-data-[card-variant=student]:text-[1.3rem] group-data-[card-variant=subject]:text-[var(--character-color)] group-data-[card-variant=subject]:text-[1.55rem]">{title}</h3>
      {children}
    </div>
    {footer ? <div className="mt-auto flex min-h-11 items-center gap-2 border-t border-dashed border-[color-mix(in_srgb,var(--character-foreground,var(--card-foreground))_52%,transparent)] px-3 py-2 group-data-[card-variant=subject]:border-t-0 group-data-[card-variant=subject]:bg-[image:var(--character-texture)]">{footer}</div> : null}
  </>;

  const bodyClass = "grid h-full min-w-0 overflow-hidden rounded-[inherit] group-data-[card-variant=character]:grid-cols-[5.5rem_minmax(0,1fr)] group-data-[card-variant=character]:items-center group-data-[card-variant=student]:grid-cols-[5.5rem_minmax(0,1fr)] group-data-[card-variant=student]:items-center";
  return <Card className={cn("group relative min-w-0 gap-0 overflow-visible border-[color-mix(in_srgb,var(--character-color,var(--card))_72%,var(--foreground))] bg-[var(--character-color,var(--card))] py-0 text-[var(--character-foreground,var(--card-foreground))] shadow-[0_0.35rem_0_color-mix(in_srgb,var(--character-color,var(--card))_55%,var(--foreground)),0_0.75rem_1.25rem_color-mix(in_srgb,var(--foreground)_16%,transparent)] transition-[transform,box-shadow] duration-180 motion-reduce:transition-none has-[a]:hover:-translate-y-1 has-[a]:hover:-rotate-[0.25deg] has-[a]:focus-within:-translate-y-1 has-[a]:focus-within:-rotate-[0.25deg] motion-reduce:has-[a]:hover:translate-y-0 motion-reduce:has-[a]:hover:rotate-0", variant === "subject" && "bg-card bg-[image:var(--home-paper-texture)] text-card-foreground", identityClass)} data-brand-identity-card data-card-variant={variant}>
    {attachment}
    {href ? <Link className={`${bodyClass} focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-4`} href={href}>{contents}</Link> : <div className={bodyClass}>{contents}</div>}
  </Card>;
}
