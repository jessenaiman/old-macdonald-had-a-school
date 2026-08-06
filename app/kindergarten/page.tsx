import { SiteShell } from "../../components/SiteShell";
import { EarlyYearsHub } from "../../components/EarlyYearsHub";
import { EARLY_YEARS } from "../../lib/early-years";

export default function KindergartenPage() {
  return (
    <SiteShell active="kindergarten">
      <EarlyYearsHub
        band="kindergarten"
        title="Kindergarten"
        tagline="The bridge between song-and-trail and a full lesson: picture-led, with a printable the child can actually mark."
        lead={{ patch: "mr-rusty", name: "Mr Rusty" }}
        tier="bridge"
        topics={EARLY_YEARS.kindergarten}
      />
    </SiteShell>
  );
}
