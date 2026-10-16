# Project guidance

This repository is an unofficial Slidev theme for Beijing Institute of Technology.

## Scope

- Use the original supplied PPT as the visual reference. Keep BIT green `#006C39`, accent `#A13F3D`, restrained white space and university marks in their original proportions.
- Theme code is MIT. Extracted artwork is excluded from that grant; preserve `NOTICE.md` and original attribution to 韩宇 (2019).
- Never commit the source PPT, embedded fonts, credentials, private research data, `node_modules`, build output or temporary validation files.
- User-facing documentation and starter slides are primarily Simplified Chinese.

## Implementation

- Layouts live in `layouts/`, shared Vue components in `components/`, CSS in `styles/`.
- Import bundled artwork as relative modules. Do not use root-relative URLs for theme assets; consumers may deploy under a subpath.
- Per-slide options override `themeConfig`. Preserve explicit `false` values.
- Use the public Slidev context API, no imports from its internal module paths.
- Keep text, equations, tables and data components editable. Do not flatten slides into backgrounds.
- Do not introduce online font or image dependencies. Preserve Chinese font fallbacks.
- Root `slides.md` is the editable starter; `example.md` demonstrates every layout and option.
- Verify meaningful rendering changes in a browser and inspect all affected layouts at 1280 × 720.

## Verification

Use Node.js >=22.18 and run `npm ci`, `npm run build`, `npm run build:starter`, `npx playwright install chromium`, `npm test` as appropriate. Inspect PDF export when altering layout boundaries. Keep preview images in `docs/preview/` in sync with major visual changes.

Do not invent research results or citations. Placeholder content belongs in brackets and demonstration data must be clearly labeled.
