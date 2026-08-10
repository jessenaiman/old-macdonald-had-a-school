import { Suspense } from "react";
import { SiteShell } from "../../components/SiteShell";
import { getAllLessons } from "../../lib/content";
import TopicsClient from "./TopicsClient";

export default async function TopicsPage() {
  const allLessons = await getAllLessons();
  const lessons = allLessons.map((l) => l.metadata);

  return (
    <SiteShell active="topics">
      <Suspense>
        <TopicsClient lessons={lessons} />
      </Suspense>
    </SiteShell>
  );
}
