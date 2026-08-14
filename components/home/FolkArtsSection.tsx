import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FOLK_ARTS_LINKS = [
  { title: "Folk Songs & Rhymes", href: "/songs?type=Folk", icon: "music-hand-drum", material: "cast-mr-maisy" },
  { title: "Folk Stories", href: "/search?q=folk%20stories", icon: "acting-pocket-puppets", material: "cast-miss-maisy" },
  { title: "Folk Instruments", href: "/search?q=folk%20instruments", icon: "music-fiddle", material: "cast-mr-rusty" },
  { title: "Folk Dancing", href: "/search?q=folk%20dancing", icon: "dance-turning-footprints", material: "cast-mr-puddles" },
] as const;

export function FolkArtsSection() {
  return (
    <section className="material-surface material-cardboard-paper relative mx-4 rounded-xl border border-border p-4 pt-6" aria-labelledby="folk-arts-title">
      <span className="brand-asset fastener-masking-tape absolute -top-5 left-1/2 z-10 -translate-x-1/2" aria-hidden="true" />
      <h2 className="mb-4 font-hand text-3xl" id="folk-arts-title">Music and Folk Arts Education</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {FOLK_ARTS_LINKS.map((item) => (
          <Card className={`${item.material} material-surface material-felt py-0`} key={item.title}>
            <CardContent className="p-0"><Link className="flex min-h-24 items-center gap-3 p-4" href={item.href}><span className={`brand-asset ${item.icon} icon-medium`} aria-hidden="true" /><CardHeader className="p-0"><CardTitle>{item.title}</CardTitle></CardHeader></Link></CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
