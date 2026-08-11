import { EarlyYearsHub } from "../../../components/EarlyYearsHub";
import { GradePageShell } from "../../../components/grades/GradePageShell";
import { EARLY_YEARS } from "../../../lib/early-years";

export default function PreSchoolPage() {
  return (
    <GradePageShell active="pre-school">
      <EarlyYearsHub
        grade="pre-school"
        title="Pre-School"
        tagline="The same songs Daycare uses, with more choice and a little more to notice — pick one, walk through the four steps together."
        lead={{ patch: "miss-maisy", name: "Miss Maisy" }}
        tier="detailed"
        topics={EARLY_YEARS["pre-school"]}
      />
    </GradePageShell>
  );
}
