# Validation record

September 26, 2026. Local static server; Microsoft Edge Chromium via Playwright.

## Layout and interaction

- Seven substantive pages checked at 1440×900, 820×1180, 390×844, and 320×740 (28 page/viewport combinations). Desktop, tablet, and mobile screenshots of Home, Research, Projects, About, and Publications were visually reviewed.
- The homepage contains six major sections. No checked page had horizontal overflow, a missing image, an image without alt text, or a JavaScript page error.
- Primary navigation has Home, About, Research, Projects, Publications, Patents, and CV. On mobile, the menu opens and closes with Escape, then returns focus to its toggle.
- The homepage's three featured illustrations are explicitly labeled as conceptual. They are SVGs with fixed dimensions and load locally.
- Projects and collaborative programs appear on their own page. Recognition and the optional gallery appear on About. Legacy page URLs redirect to the corresponding section; Contact is in the footer.
- Publication filters were exercised: Flexible Electronics shows a clear zero-result message; Memory & Reliability shows 5 records; All restores 20. The legacy `index.html#projects` link resolves to `projects.html`. With JavaScript disabled, all seven navigation links remain visible and there is no mobile overflow.
- `node scripts/check.mjs`: 10 HTML pages, 210 internal references, zero errors.

## Scope

- The published-paper, first-author-paper, and registered-patent counts are computed from `content.js` rather than typed into the homepage. Their source is the CV updated September 2, 2026.
- The downloadable PDF was regenerated with the same research-identity wording as the web CV. All five A4 pages were rendered and visually checked. The three SVGs are conceptual diagrams, not measured data or reproduced figures.
- No external font, client framework, analytics, or runtime content fetch is used.

See `AUDIT.md` for evidence and unresolved content sources.

## September 27 editorial pass

- Confirmed the live versions of all seven substantive pages matched the repository before editing.
- Clarified the home hero's verified memory/optoelectronic work versus CV-listed flexible-electronics collaborations and made the academic position explicit.
- Removed repeated current/future paragraphs from the Research page's core-science introduction. About biography and research vision now read from editable `profile.bio` and `profile.vision` fields.
- Rechecked 28 page/viewport combinations at 1440, 820, 390, and 320 px: no horizontal overflow, missing images, missing alt text, or page errors. Mobile menu and focus return passed. `scripts/check.mjs` found 210 internal references and zero errors.
