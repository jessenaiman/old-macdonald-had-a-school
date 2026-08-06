import { SiteShell } from "../../components/SiteShell";
import { EarlyYearsHub } from "../../components/EarlyYearsHub";
import { EARLY_YEARS } from "../../lib/early-years";

export default function DaycarePage() {
  return (
    <SiteShell active="daycare">
      <EarlyYearsHub
        band="daycare"
        title="Daycare"
        tagline="A new song for today, every time you return. Pick one, sing it together — that's the whole lesson."
        lead={{ patch: "miss-puddles", name: "Miss Puddles" }}
        tier="list"
        topics={EARLY_YEARS.daycare}
      />
    </SiteShell>
  );
}
