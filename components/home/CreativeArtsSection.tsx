import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const CREATIVE_AREAS = [
  { title: "Music", description: "Sing, listen, play, and find the beat.", href: "/search?q=music", icon: "music-hand-drum", material: "cast-mr-rusty" },
  { title: "Art", description: "Make marks, mix colour, and create.", href: "/search?q=art", icon: "painting-easel", material: "cast-miss-puddles" },
  { title: "Drama", description: "Pretend, tell stories, and perform.", href: "/search?q=drama", icon: "acting-theatre-masks", material: "cast-miss-hayley" },
  { title: "Dancing", description: "Move, turn, travel, and dance together.", href: "/search?q=dance", icon: "dance-spiralling-scarves", material: "cast-penny" },
] as const;

export function CreativeArtsSection() {
  return (
    <section className="material-surface material-cardboard-paper mx-4 rounded-xl border-2 border-border p-5 shadow-sm sm:p-6" aria-labelledby="creative-arts-title">
      <header className="mx-auto mb-6 max-w-2xl text-center">
        <p className="font-hand text-xl">Make some noise. Make something new.</p>
        <h2 className="font-heading text-3xl sm:text-4xl" id="creative-arts-title">Creative Arts</h2>
        <p className="mt-2 text-muted-foreground">Music, art, drama, and dancing turn imagination into something children can share.</p>
      </header>
      <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {CREATIVE_AREAS.map((item) => (
          <Card className={`${item.material} character-surface material-surface material-felt h-full min-w-0 border-2 shadow-sm`} key={item.title}>
            <CardHeader className="flex flex-col items-center text-center">
              <span className={`brand-asset ${item.icon} icon-medium`} aria-hidden="true" />
              <CardTitle>{item.title}</CardTitle>
              <CardDescription className="w-full max-w-xs text-balance">{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1" />
            <CardFooter className="justify-center"><Link className="font-bold underline underline-offset-4" href={item.href}>Explore {item.title.toLowerCase()} <span aria-hidden="true">→</span></Link></CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
