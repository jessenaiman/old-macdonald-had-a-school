import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const groups = [
  {
    title: "Site surfaces",
    href: "#typography",
    tokens: [
      ["Page", "--background"], ["Ink", "--foreground"], ["Card", "--card"],
      ["Primary", "--primary"], ["Accent", "--accent"], ["Border", "--border"],
    ],
  },
  {
    title: "Curriculum",
    href: "#icons",
    tokens: [
      ["Red", "--curriculum-red"], ["Yellow", "--curriculum-yellow"], ["Blue", "--curriculum-blue"],
      ["Orange", "--curriculum-orange"], ["Green", "--curriculum-green"], ["Purple", "--curriculum-purple"],
    ],
  },
  {
    title: "Staff identity",
    href: "#cast",
    tokens: [
      ["Old MacDonald", "--cast-old-macdonald-color", "#8B5E34", "cast-old-macdonald"],
      ["Miss Puddles", "--cast-miss-puddles-color", "#E8A227", "cast-miss-puddles"],
      ["Mr Rusty", "--cast-mr-rusty-color", "#2C6C9B", "cast-mr-rusty"],
      ["Miss Hayley", "--cast-miss-hayley-color", "#C9527A", "cast-miss-hayley"],
      ["Mr Sam", "--cast-mr-sam-color", "#1F6B6B", "cast-mr-sam"],
      ["Mr Maisy", "--cast-mr-maisy-color", "#B5272C", "cast-mr-maisy"],
      ["Mr Puddles", "--cast-mr-puddles-color", "#4F5FA0", "cast-mr-puddles"],
      ["Miss Maisy", "--cast-miss-maisy-color", "#55705A", "cast-miss-maisy"],
    ],
  },
] as const

export function PaletteReference() {
  return (
    <Card className="gap-4 py-5">
      <CardHeader className="px-5">
        <CardTitle className="font-heading text-2xl">Live palette</CardTitle>
        <p className="m-0 text-sm leading-6 text-muted-foreground">These swatches render the same semantic variables used by the page. Switch theme to expose conflicts immediately.</p>
      </CardHeader>
      <CardContent className="grid gap-5 px-5">
        {groups.map((group) => (
          <section key={group.title}>
            <Link className="text-sm font-black underline underline-offset-4" href={group.href}>{group.title}</Link>
            <ul className="mt-2 grid list-none gap-2 p-0">
              {group.tokens.map(([label, token, reference, semanticClass]) => (
                <li className="grid grid-cols-[2rem_minmax(0,1fr)] items-center gap-2 text-sm" key={token}>
                  <span className="size-8 rounded-md border border-border shadow-sm" style={{ backgroundColor: `var(${token})` }} aria-hidden="true" />
                  <span className="min-w-0">
                    <strong className="block leading-tight">{label}</strong>
                    <code className="block truncate text-xs text-muted-foreground">{token}</code>
                    {reference && semanticClass ? <code className={`${semanticClass} character-surface mt-1 inline-block rounded px-2 py-1 text-xs font-black`}>{reference}</code> : null}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </CardContent>
    </Card>
  )
}
