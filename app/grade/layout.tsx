export default function GradeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="grade-route-layout flex w-full max-w-none flex-1 flex-col p-0">{children}</div>;
}
