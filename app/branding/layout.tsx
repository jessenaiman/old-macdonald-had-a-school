export default function BrandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full min-w-0 max-w-screen-2xl px-3 pb-12 sm:px-6 lg:px-8 [&_p]:text-base [&_p]:leading-7 [&_pre]:my-5 [&_pre]:min-w-0 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-border [&_pre]:p-5 [&_pre]:text-sm [&_pre]:text-card-foreground [&_pre]:shadow-md [&_pre]:[background-image:var(--brand-paper-texture)] [&_pre]:[background-size:260px] [&_table]:my-5 [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:rounded-xl [&_table]:border [&_table]:border-border [&_table]:bg-card [&_table]:text-sm [&_table]:shadow-sm [&_td]:min-w-40 [&_td]:border-b [&_td]:border-border [&_td]:p-3 [&_th]:min-w-40 [&_th]:border-b [&_th]:border-border [&_th]:p-3 [&_th]:text-left">
      {children}
    </div>
  )
}
