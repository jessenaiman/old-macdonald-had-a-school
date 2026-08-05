import { SiteShell } from "../../components/SiteShell";
import { CastGuidePage } from "../../components/CastGuidePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cast Guide | Old MacDonald Had a School",
  description: "Meet the staff and students who give Old MacDonald's Farm School its teaching voice.",
};

export default function CastRoute() {
  return (
    <SiteShell active="cast-guide">
      <CastGuidePage />
    </SiteShell>
  );
}
