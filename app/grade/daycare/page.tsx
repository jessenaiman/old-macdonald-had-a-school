import { EarlyYearsHub } from "../../../components/EarlyYearsHub";
import { SiteShell } from "../../../components/SiteShell";
import { EARLY_YEARS } from "../../../lib/early-years";

export default function DaycarePage() {
  return (
    <SiteShell active="daycare">
      <EarlyYearsHub
        grade="daycare"
        title="Daycare"
        tagline="Short, familiar routines that help little learners feel safe, join in, and explore through sound and movement."
        lead={{ patch: "miss-puddles", name: "Miss Puddles" }}
        tier="list"
        topics={EARLY_YEARS.daycare}
      />
    </SiteShell>
  );
}
