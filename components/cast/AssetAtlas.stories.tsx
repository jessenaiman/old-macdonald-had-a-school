import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const assets = [
  ["Cardboard paper", "material-cardboard-paper", "Readable planning and lesson surfaces"],
  ["Old MacDonald felt", "cast-old-macdonald material-felt", "Character-owned patches and notes"],
  ["Woven fabric", "material-woven-fabric", "Warm cloth fields"],
  ["Construction paper", "material-construction-paper", "Cut-paper accents"],
  ["Cork", "material-cork", "Working walls and pinboards"],
  ["Leather", "material-leather", "Navigation and durable chrome"],
] as const;

function AssetAtlas() {
  return <main className="min-h-screen bg-background p-6 text-foreground sm:p-10"><header className="mx-auto max-w-6xl"><p className="text-sm font-extrabold uppercase tracking-[.12em] text-muted-foreground">Old MacDonald asset atlas</p><h1 className="mt-3 font-heading text-5xl leading-none">Repeatable materials</h1><p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">These are named global classes, not copied CSS. Use the `material-surface` class with one approved material class. The image tiles come from the application’s real public asset directory.</p></header><section className="mx-auto mt-8 grid max-w-6xl gap-5 md:grid-cols-2 xl:grid-cols-3">{assets.map(([name, className, use]) => <article className={`material-surface ${className} min-h-72 rounded-xl border border-border p-6 shadow-sm`} key={className}><div className="flex h-full flex-col justify-end rounded-lg bg-background/72 p-4"><h2 className="font-heading text-3xl leading-none">{name}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{use}</p><code className="mt-4 block overflow-auto rounded bg-muted px-3 py-2 text-xs">material-surface {className}</code></div></article>)}</section></main>;
}

const meta = {
  title: "Branding/Asset Atlas",
  component: AssetAtlas,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["ai-generated"],
} satisfies Meta<typeof AssetAtlas>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RepeatableMaterials: Story = {};
