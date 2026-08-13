import { permanentRedirect } from "next/navigation";

export const metadata = { title: "Homepage alternative | Old MacDonald Had a School" };

export default function HomeAlternativePage() {
  permanentRedirect("/");
}
