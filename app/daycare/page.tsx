import { DaycarePlanningBoard } from "../../components/builder/DaycarePlanningBoard";
import { SiteShell } from "../../components/SiteShell";

export default function DaycarePage() {
  return (
    <SiteShell active="daycare">
      <DaycarePlanningBoard />
    </SiteShell>
  );
}
