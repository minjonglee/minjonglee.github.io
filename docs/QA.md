# Validation record

September 26, 2026. Local static server; Microsoft Edge Chromium via Playwright.

## Layout and visual review

- Eight substantive pages checked at 1440×1000, 820×1180, 390×844, and 320×750 (32 page/viewport combinations).
- Full-page and viewport screenshots captured at desktop, tablet, and mobile sizes. Each page visually reviewed at the top, middle, and bottom; home hero and final CV PDF reviewed separately at readable resolution.
- No horizontal document overflow, duplicate IDs, absent H1s, missing image alt attributes, or JavaScript page errors in these checks.
- No research record is intentionally removed on a narrow viewport. The editorial research orientation becomes a readable two-column sequence on mobile (one column at 320px); the full cross-scale research framework remains available.
- All five PDF pages rendered through Poppler and visually inspected. A section heading initially stranded at the end of a page was fixed before final export. No clipping or missing Korean characters observed.

## Navigation and interaction

- Shared primary navigation opens separate HTML pages.
- Mobile menu opens, closes with Escape, and returns focus to its toggle. Tab enters the first navigation link. Visible focus outline verified.
- Skip-to-content link is first in keyboard order and moves focus to `main`.
- Publication filters return 20 / 5 / 14 / 1 / 17 papers for All / Memory / Interfaces / Oxide / Optoelectronics. The active button and live count announcement agree.
- The in-revision manuscript remains separate from published work.
- Print mode restores all 20 published papers even after filtering.
- With JavaScript disabled, all published records and navigation remain visible.
- Legacy Contact and Recognition pages redirect correctly. The old Patents `#projects` anchor also resolves to the new Projects page.
- CV link tested as a real browser download; `min-jong-lee-cv.pdf` returned successfully.
- `node scripts/check.mjs`: 10 HTML pages; 203 internal link/resource/anchor references; zero errors.

## Accessibility basics and metadata

- One H1 per page, semantic main/nav/header/footer, descriptive page titles, language declaration, canonical URLs, descriptions, Open Graph fields, and valid Person JSON-LD.
- Programmatic rendered-text contrast sampling found no failures against 4.5:1 for normal text or 3:1 for large text across the eight pages. This is a basic check, not a claim of complete WCAG certification.
- No unnamed links/buttons found in the DOM check.
- Future images require meaningful alt text; fixed dimensions reserve layout space. Nonessential motion is disabled under `prefers-reduced-motion`.

## Loading behavior

- Initial pages request only local CSS and JavaScript, the favicon, and the provided portrait on Home/About. No external fonts, analytics, client framework, or client-side content fetch.
- Largest HTML document is approximately 31KB uncompressed; CSS approximately 29KB; browser JS approximately 3KB. Home HTML is approximately 20KB. Downloadable CV is approximately 88KB, social preview approximately 44KB; neither is fetched as a home-page visual asset.
- No real-user latency/Core Web Vitals claim is made from a local run. Research figure performance should be checked if images are later added.

## Remaining content constraints

See `AUDIT.md`. The portrait is applied. Research figures, activity photos, ORCID/LinkedIn, and event details remain unfilled. The original CV remains the status snapshot. Seven DOI matches were verified; other publication links are labeled Scholar searches. No external publisher availability or full accessibility certification is guaranteed by the local checks.
