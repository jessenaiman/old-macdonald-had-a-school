/**
 * Deliberate pass-through layout for the first public release.
 * Keep this App Router segment boundary for future grade-wide providers or UI,
 * but do not add a presentational wrapper. Grade identity belongs to the shared
 * grade configuration and semantic theme tokens until real shared structure exists.
 * @see https://nextjs.org/docs/app/getting-started/layouts-and-pages#nesting-layouts
 */
export default function GradeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
