import { EarlyYearsHub } from "../../../components/EarlyYearsHub";
import { SiteShell } from "../../../components/SiteShell";
import { EARLY_YEARS } from "../../../lib/early-years";

export default function PreSchoolPage() {
  return (
    <SiteShell active="pre-school">
      <EarlyYearsHub
        grade="pre-school"
        title="Pre-School"
        tagline="The same songs Daycare uses, with more choice and a little more to notice — pick one, walk through the four steps together."
        lead={{ patch: "miss-maisy", name: "Miss Maisy" }}
        tier="detailed"
        topics={EARLY_YEARS["pre-school"]}
      />
    </SiteShell>
  );
}
