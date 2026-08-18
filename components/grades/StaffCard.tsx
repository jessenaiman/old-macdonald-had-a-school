"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { CAST, type CastKey } from "@/data/brand/cast-registry";

type StaffCardProps = {
  /** Teacher key from cast registry */
  teacher: CastKey;
  /** Lesson/path title */
  title: string;
  /** Subject kicker */
  subject: string;
  /** Summary/description */
  summary: string;
  /** Call to action */
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: "default" | "outline" | "secondary";
  };
  /** Optional note/quote from teacher */
  note?: string;
  /** Size variant */
  size?: "default" | "sm";
  /** Whether this is the active selection */
  active?: boolean;
  /** Additional className */
  className?: string;
};

/**
 * StaffCard - A proper shadcn Card composition for teacher-facing content.
 * 
 * Uses three advanced capabilities:
 * 1. Container queries (@container) for internal responsive layout
 * 2. CSS color-mix() + relative colors for theme-aware teacher color floods
 * 3. data-* variants + @property for animated state transitions
 * 
 * Combines REAL TEXTURE ASSETS (felt, cardboard) with CSS color floods
 * using background-blend-mode: multiply — the way the design system intends.
 * Fixes the red-bleed issue by properly isolating teacher colors via CSS variables
 * and using the --card-spacing system.
 */
export function StaffCard({
  teacher,
  title,
  subject,
  summary,
  action,
  note,
  size = "default",
  active = false,
  className,
}: StaffCardProps) {
  // Teacher color as CSS variable for color-mix operations
  const teacherColor = `var(--cast-${teacher}-color)`;
  const teacherColorLight = `color-mix(in oklch, ${teacherColor} 15%, transparent)`;
  const teacherColorBorder = `color-mix(in oklch, ${teacherColor} 35%, var(--border))`;
  // Character's actual felt texture from brand-assets.css
  const teacherTexture = `var(--cast-${teacher}-texture)`;

  return (
    <Card
      data-slot="staff-card"
      data-teacher={teacher}
      data-size={size}
      data-active={active || undefined}
      size={size}
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        // Container query for internal layout
        "@container/staff-card",
        // Real felt texture + color flood via background-blend-mode (like .cast-surface)
        "bg-card",
        // Active state ring
        "data-[active=true]:ring-2 data-[active=true]:ring-[var(--teacher-color)]",
        className
      )}
      style={{
        "--teacher-color": teacherColor,
        "--teacher-color-light": teacherColorLight,
        "--teacher-color-border": teacherColorBorder,
        "--character-texture": teacherTexture,
        // Character surface: color + texture with multiply blend
        backgroundImage: `linear-gradient(${teacherColor}, ${teacherColor}), ${teacherTexture}`,
        backgroundBlendMode: "color, normal",
        backgroundRepeat: "repeat",
        backgroundSize: "auto, 180px",
      } as React.CSSProperties}
    >
      {/* Teacher color accent bar at top - uses color-mix for subtle flood */}
      <div
        data-active={active || undefined}
        className="absolute top-0 left-0 right-0 h-1 bg-[var(--teacher-color)] opacity-0 transition-opacity duration-300 data-[active=true]:opacity-100"
        aria-hidden="true"
      />

      <CardHeader className="relative z-10">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Badge
              variant="secondary"
              className="text-xs font-black uppercase tracking-widest"
              style={{
                backgroundColor: `color-mix(in oklch, ${teacherColor} 20%, var(--muted))`,
                borderColor: `color-mix(in oklch, ${teacherColor} 40%, var(--border))`,
                color: teacherColor,
              }}
            >
              {subject}
            </Badge>
            <CardTitle className="mt-2 font-heading text-2xl leading-tight">
              {title}
            </CardTitle>
          </div>
          {/* Teacher avatar with color-mix border */}
          <div className="relative shrink-0 size-16 rounded-full overflow-hidden border-2" style={{ borderColor: teacherColorBorder }}>
            <Image
              src={CAST[teacher].portrait}
              alt={CAST[teacher].name}
              fill
              className="object-cover"
              sizes="4rem"
            />
            {/* Color-mix glow ring on active */}
            <div
              data-active={active || undefined}
              className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 data-[active=true]:opacity-100"
              style={{
                boxShadow: `0 0 0 2px ${teacherColor}, 0 0 12px 4px color-mix(in oklch, ${teacherColor} 40%, transparent)`,
              }}
              aria-hidden="true"
            />
          </div>
        </div>
        <CardDescription className="mt-3 text-muted-foreground line-clamp-2">
          {summary}
        </CardDescription>
      </CardHeader>

      {note && (
        <Separator className="my-4" />
      )}

      {note && (
        <CardContent className="relative z-10">
          <blockquote className="font-hand text-xl font-semibold leading-tight text-[var(--teacher-color)] border-l-4 pl-4" style={{ borderColor: teacherColor }}>
            "{note}"
          </blockquote>
          <p className="mt-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
            {CAST[teacher].name} · teaching note
          </p>
        </CardContent>
      )}

      {action && (
        <CardFooter className="relative z-10">
          <Button
            asChild={!!action.href}
            variant={action.variant || "default"}
            size={size === "sm" ? "sm" : "default"}
            className="w-full"
            style={{
              // Active state uses teacher color for primary variant
              backgroundColor: action.variant === "default" && active
                ? `color-mix(in oklch, ${teacherColor} 85%, var(--primary))`
                : undefined,
              borderColor: action.variant === "outline" && active
                ? teacherColor
                : undefined,
            }}
            onClick={action.onClick}
          >
            {action.href ? (
              <Link href={action.href}>{action.label}</Link>
            ) : (
              action.label
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

/**
 * StaffCardGrid - Container query responsive grid for staff cards
 * Uses @container to adapt card layout based on available width
 */
export function StaffCardGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-4",
        // Container query responsive columns
        "@container/staff-grid",
        "grid-cols-1",
        "@sm:grid-cols-2",
        "@lg:grid-cols-3",
        "@xl:grid-cols-4",
        className
      )}
      style={{ containerType: "inline-size" } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

/**
 * TeacherHeroCard - Full-width hero card for grade page teacher welcome
 * Combines REAL TEXTURE ASSETS with CSS color-mix() floods using background-blend-mode
 */
export function TeacherHeroCard({
  teacher,
  headline,
  accentHeadline,
  summary,
  quote,
  action,
}: {
  teacher: CastKey;
  headline: string;
  accentHeadline: string;
  summary: string;
  quote: string;
  action?: { label: string; href: string };
}) {
  const teacherColor = `var(--cast-${teacher}-color)`;
  const teacherTexture = `var(--cast-${teacher}-texture)`;
  const teacherPortrait = CAST[teacher].portrait;

  return (
    <Card
      data-slot="teacher-hero"
      data-teacher={teacher}
      size="default"
      className={cn(
        "relative overflow-hidden",
        "@container/teacher-hero",
        "bg-card",
      )}
      style={{
        "--teacher-color": teacherColor,
        "--character-texture": teacherTexture,
        // Hero surface: gradient color flood + real felt texture with multiply blend
        backgroundImage: `
          linear-gradient(135deg, 
            color-mix(in oklch, ${teacherColor} 12%, transparent) 0%, 
            color-mix(in oklch, ${teacherColor} 6%, transparent) 50%, 
            transparent 100%
          ),
          ${teacherTexture}
        `,
        backgroundBlendMode: "color, normal",
        backgroundRepeat: "repeat",
        backgroundSize: "auto, 180px",
        borderColor: `color-mix(in oklch, ${teacherColor} 30%, var(--border))`,
      } as React.CSSProperties}
    >
      {/* Decorative teacher color accent shape */}
      <div
        className="absolute -top-20 -right-20 size-72 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ backgroundColor: teacherColor }}
        aria-hidden="true"
      />

      <CardHeader className="relative z-10 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
        <div className="min-w-0">
          <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            Teacher's welcome
          </span>
          <CardTitle className="mt-2 font-heading text-4xl leading-none sm:text-5xl lg:text-6xl max-w-3xl">
            {headline}{" "}
            <em className="block text-[var(--teacher-color)] not-italic font-medium">
              {accentHeadline}
            </em>
          </CardTitle>
          <CardDescription className="mt-4 max-w-2xl text-lg text-muted-foreground">
            {summary}
          </CardDescription>
          {action && (
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={action.href}>{action.label}</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Teacher portrait with color-mix frame */}
        <div className="relative shrink-0 size-48 sm:size-56 lg:size-64 rounded-2xl overflow-hidden border-4" style={{ borderColor: `color-mix(in oklch, ${teacherColor} 50%, var(--card))` }}>
          <Image
            src={teacherPortrait}
            alt={`${CAST[teacher].name}'s portrait`}
            fill
            className="object-cover"
            priority
            sizes="(min-width: 1024px) 16rem, (min-width: 768px) 14rem, 12rem"
          />
          {/* Color-mix glow on hover via container query */}
          <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 @container/teacher-hero:hover:opacity-100" style={{
            boxShadow: `inset 0 0 0 1px ${teacherColor}, inset 0 0 60px 20px color-mix(in oklch, ${teacherColor} 15%, transparent)`
          }} aria-hidden="true" />
        </div>
      </CardHeader>

      {quote && (
        <CardContent className="relative z-10 pt-6">
          <Separator className="mb-6" style={{ borderColor: `color-mix(in oklch, ${teacherColor} 30%, var(--border))` }} />
          <blockquote className="font-hand text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl text-[var(--teacher-color)] relative pl-6 border-l-4" style={{ borderColor: teacherColor }}>
            "{quote}"
          </blockquote>
        </CardContent>
      )}
    </Card>
  );
}