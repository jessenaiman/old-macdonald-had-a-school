import { EarlyYearsHub } from "../../../components/EarlyYearsHub";
import { EARLY_YEARS } from "../../../lib/early-years";

export default function KindergartenPage() {
  return <EarlyYearsHub
        grade="kindergarten"
        title="Kindergarten"
        tagline="Choose a goal, gather what helps, and shape the lesson around the learners who will meet it."
        lead={{ patch: "mr-rusty", name: "Mr Rusty" }}
        tier="bridge"
        topics={EARLY_YEARS.kindergarten}
      />;
}
