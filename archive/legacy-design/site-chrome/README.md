# Archived site-chrome layer

This directory records the retired app-specific `site-chrome` vocabulary. It is not an active stylesheet and must not be imported.

The active App Router structure remains documented Next.js structure: `app/layout.tsx` owns the root layout and renders shared UI components; `app/globals.css` is the global stylesheet; component-local styles use CSS Modules.

Migration record:

- `components/SiteChrome.module.css` was retired and its active component rules now live in `components/NavigationAndFooter.module.css`.
- `--site-chrome-*` tokens were replaced by `--shell-*` tokens in the theme layer.
- `bg-site-chrome` and related utility names were replaced by the corresponding `shell` theme utilities.
- The old structural-denim naming was removed; the approved shell surface is resolved through the existing asset registry and theme variables.

Do not add new imports or utility names under `site-chrome`. This record exists only to explain the cleanup and prevent the retired vocabulary from returning.
