import { SiteShell } from "../../components/SiteShell";
import { EarlyYearsHub } from "../../components/EarlyYearsHub";
import { EARLY_YEARS } from "../../lib/early-years";

export default function PreschoolPage() {
  return (
    <SiteShell active="preschool">
      <EarlyYearsHub
        band="preschool"
        title="Preschool"
        tagline="The same songs Daycare uses, with more choice and a little more to notice — pick one, walk through the four steps together."
        lead={{ patch: "miss-maisy", name: "Miss Maisy" }}
        tier="detailed"
        topics={EARLY_YEARS.preschool}
      />
    </SiteShell>
  );
}
