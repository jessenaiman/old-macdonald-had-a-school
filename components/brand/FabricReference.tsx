import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CAST, type CastKey } from "@/lib/cast"

const staff: readonly CastKey[] = [
  "old-macdonald", "miss-puddles", "mr-rusty", "miss-hayley",
  "mr-sam", "mr-maisy", "mr-puddles", "miss-maisy",
]

const students: readonly CastKey[] = [
  "hopper", "whiskers", "scout", "penny", "maisy", "puddles", "sam", "rusty",
]

const families = [
  { name: "Felt", varieties: 16, registration: "All identities registered", use: "Character-owned patches and locally identified cloth objects", className: "cast-old-macdonald material-felt" },
  { name: "Woven fabric", varieties: 16, registration: "One neutral recipe registered", use: "Attached neutral cloth; remaining identity tiles require semantic registration", className: "material-woven-fabric" },
  { name: "Construction paper", varieties: 16, registration: "One example registered", use: "Cut-paper identity accents; not interchangeable with readable note paper", className: "material-construction-paper" },
  { name: "Thread overlays", varieties: 16, registration: "1 of 16 source overlays registered for production", use: "Stitching detail paired with an owned textile; never a standalone surface", className: "cast-old-macdonald material-felt material-thread-overlay", layered: true },
  { name: "Leather", varieties: 8, registration: "Staff and blue leather recipes registered", use: "Durable material surfaces selected by an approved asset recipe; never a generic application layer", className: "material-leather" },
  { name: "Cardboard", varieties: 4, registration: "Ivory and warm kraft registered", use: "Neutral readable or structural paper objects", className: "material-cardboard-paper" },
] as const

const specimenClass = "relative min-h-28 overflow-hidden rounded-md border border-current/20 shadow-[inset_0_0_0_1px_color-mix(in_srgb,currentColor_12%,transparent)]"

function FabricCards({ characters }: { characters: readonly CastKey[] }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {characters.map((character) => {
      const identity = CAST[character]
      return <Card key={character}>
        <CardHeader><CardTitle>{identity.name}</CardTitle><CardDescription>Identity-owned felt</CardDescription></CardHeader>
        <CardContent className="grid gap-3">
          <div className={`cast-${character} material-surface material-felt ${specimenClass}`} aria-label={`${identity.name} felt specimen`} />
          <code className="block break-all">cast-{character} material-surface material-felt</code>
        </CardContent>
      </Card>
    })}
  </div>
}

export function FabricReference() {
  return <>
    <div className="mt-7 grid gap-4 md:grid-cols-2">
      <Card><CardHeader><CardTitle>Identity felt</CardTitle><CardDescription>Soft, stitched, and locally owned</CardDescription></CardHeader><CardContent className="grid gap-3"><div className={`cast-old-macdonald material-surface material-felt ${specimenClass}`} aria-label="Old MacDonald felt specimen" /><p className="m-0 font-body text-base font-semibold leading-[1.7]">Production consumer: the shared TeacherNote and existing identity patches. The paper Card remains the readable block.</p><code>cast-old-macdonald material-surface material-felt</code></CardContent></Card>
      <Card><CardHeader><CardTitle>Supporting woven cloth</CardTitle><CardDescription>An attached neutral classroom textile</CardDescription></CardHeader><CardContent className="grid gap-3"><div className={`material-surface material-woven-fabric ${specimenClass}`} aria-label="Woven fabric specimen" /><p className="m-0 font-body text-base font-semibold leading-[1.7]">Registered inventory sample. No production control currently owns this treatment.</p></CardContent></Card>
    </div>
    <Tabs defaultValue="families" className="mt-8">
      <TabsList aria-label="Material reference views" className="h-auto w-full flex-wrap justify-start"><TabsTrigger value="families">Family decisions</TabsTrigger><TabsTrigger value="staff">Staff felt</TabsTrigger><TabsTrigger value="students">Student felt</TabsTrigger></TabsList>
      <TabsContent value="families"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{families.map((family) => <Card className="material-surface material-cardboard-paper" key={family.name}><CardHeader className="border-b"><CardTitle>{family.name}</CardTitle><CardDescription>{family.varieties} source varieties</CardDescription></CardHeader><CardContent className="grid gap-4"><div className={`material-surface ${specimenClass} ${family.className}`} aria-label={`${family.name} material specimen`} />{"layered" in family && family.layered ? <div className="grid grid-cols-2 gap-2 text-sm"><span className="rounded-md border border-border bg-card p-2"><strong className="block">Base</strong>Owned felt</span><span className="rounded-md border border-border bg-card p-2"><strong className="block">Overlay</strong>Thread detail</span></div> : null}<p className="m-0 font-body text-base font-semibold leading-[1.7]">{family.use}</p><p className="m-0"><strong>Production registry:</strong> {family.registration}</p></CardContent></Card>)}</div></TabsContent>
      <TabsContent value="staff"><section aria-labelledby="staff-fabric-title"><h3 className="font-heading text-[clamp(1.875rem,4vw,3rem)] font-normal leading-none text-balance" id="staff-fabric-title">Staff identity felt</h3><p className="max-w-3xl font-body text-base font-semibold leading-[1.7]">Eight staff varieties. Use one only when the attached object is owned by or directly describes that character.</p><FabricCards characters={staff} /></section></TabsContent>
      <TabsContent value="students"><section aria-labelledby="student-fabric-title"><h3 className="font-heading text-[clamp(1.875rem,4vw,3rem)] font-normal leading-none text-balance" id="student-fabric-title">Student identity felt</h3><p className="max-w-3xl font-body text-base font-semibold leading-[1.7]">Eight student varieties. These identify a student locally; they are not subject, grade, navigation, or generic control colors.</p><FabricCards characters={students} /></section></TabsContent>
    </Tabs>
  </>
}
