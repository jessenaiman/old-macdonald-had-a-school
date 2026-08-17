import { HomePage } from "../components/home/HomePage";
import { metadata as homeMetadata } from "../content/pages/home.mdx";

export default function Home() {
  return <HomePage hero={homeMetadata} />;
}
