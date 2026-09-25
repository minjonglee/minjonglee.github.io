# Validation record

September 26, 2026. Local static server; Microsoft Edge Chromium via Playwright.

## Layout and interaction

- Six substantive pages checked at 1440×900, 820×1180, 390×844, and 320×740 (24 page/viewport combinations). Desktop, tablet, and mobile screenshots of Home, Research, and About were visually reviewed.
- The homepage contains exactly five major sections. No checked page had horizontal overflow, a missing image, an image without alt text, or a JavaScript page error.
- Primary navigation has Research, Publications, Patents, About, and CV. On mobile, the menu opens and closes with Escape, then returns focus to its toggle.
- The homepage's three featured illustrations are explicitly labeled as conceptual. They are SVGs with fixed dimensions and load locally.
- Projects and collaborative programs appear on Research. Recognition and any supplied gallery photographs appear on About. Legacy page URLs redirect to the corresponding section; Contact is in the footer.
- Publication filters, print view, CV download, skip link, no-JavaScript content, and legacy links were checked in the previous pass and preserved by this change.
- `node scripts/check.mjs`: 10 HTML pages, 181 internal references, zero errors.

## Scope

- The published-paper, first-author-paper, and registered-patent counts are computed from `content.js` rather than typed into the homepage. Their source is the CV updated September 2, 2026.
- The downloadable PDF remains the public CV from the preceding pass. The three SVGs are conceptual diagrams, not measured data or reproduced figures.
- No external font, client framework, analytics, or runtime content fetch is used.

See `AUDIT.md` for evidence and unresolved content sources.
