import { SiteShell } from "../../components/SiteShell";
import { CastGuidePage } from "../../components/CastGuidePage";

export default function CastRoute() {
  return (
    <SiteShell active="cast-guide">
      <CastGuidePage />
    </SiteShell>
  );
}
