# Old MacDonald palette and typography

This is the readable companion to the live `/branding` Foundations tab. The runtime authority is `app/globals.css`; this document names how to use those existing tokens.

## UI palette

| Role | CSS token | Light value | Use it for |
| --- | --- | --- | --- |
| Navy | `--navy` | `#0B1A33` | primary ink, navigation, high-emphasis action surfaces |
| Blue | `--blue` | `#3F78A4` | supporting school-blue surfaces |
| Sky | `--sky` | `#B9D3E6` | low-emphasis cool accents |
| Gold | `--gold` | `#E1B84B` | sparing highlight and active-state detail |
| Red | `--red` | `#C33F3F` | alert or energetic accent, not default copy |
| Coral | `--coral` | `#D45D6D` | warm supporting accent |
| Pink | `--pink` | `#D98291` | supporting accent, not the Grade 1 theme |
| Plum | `--plum` | `#8D7AA8` | supporting accent |
| Orange | `--orange` | `#D97A2B` | small labels and warm emphasis |
| Paper | `--card` | `#FDF8EC` | readable card surface |
| Ink | `--brand-ink` | `#173552` | stable body and heading ink on light material |
| Copy | `--brand-copy` | `#574D40` | secondary readable body copy |

Use the semantic token or its Tailwind utility. Do not introduce a new hex in a page component.

## Character colour boundary

Character colours are not grade themes. A `cast-*` class supplies a local `--character-*` context only for that character's note, portrait panel, scene, or activity. Canonical staff and student values and visible examples live in `content/pages/branding/cast.mdx` and at `/branding#cast`.

## Typography roles

| Job | Class or token | Use |
| --- | --- | --- |
| Display | `font-heading` | page headings, card titles, navigation destinations |
| Handwritten emphasis | `font-hand` | short teacher voices and expressive emphasis only |
| Reading and UI | `font-body` | paragraphs, labels, controls, and instructional copy |
| Display recipe | `font-heading text-5xl leading-[.9] text-foreground sm:text-6xl` | prominent page heading |
| Hand recipe | `font-hand text-4xl leading-[1.1] text-primary sm:text-5xl` | short emphasis or a teacher note |
| Body recipe | `font-body text-base leading-7 text-muted-foreground` | readable explanation |

The typography specimen in `/branding` uses the same selectors. Copy a role from there or this table, not a font inferred from a screenshot.

## Control rule

Use a shadcn primitive for behaviour. A brand class supplies material or a named asset, never a replacement control:

```tsx
<Button className="brand-button brand-button--felt">Build this lesson</Button>
```

See [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) for attachment, layout, and responsive rules.
