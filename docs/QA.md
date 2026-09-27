# Validation record

September 27, 2026. Local static server; Microsoft Edge Chromium via Playwright.

## Final site-wide pass

- Seven substantive pages checked at 1440×900, 820×1180, 390×844, and 320×740: 28 page/viewport combinations. Home, About, Research, Projects, Publications, Patents, and CV share one header, navigation, footer, type system, deep blue accent, and content width.
- No checked page had horizontal overflow, a missing image, an image without alt text, or a JavaScript page error. The supplied portrait is the only live photographic asset; no conceptual research graphics remain. Featured Work is text-led until cleared research figures are supplied.
- Primary navigation is Home, About, Research, Projects, Publications, Patents, CV. Mobile menu Escape handling returns focus to the toggle. Legacy `index.html#projects` resolves to the substantive Projects page. Legacy URL files remain as redirects for old links.
- The Publications page has selected works and a chronological full list. Flexible Electronics shows a zero-result message; Memory & Reliability shows five published records; All restores 20. Year headings hide when no filtered item remains. With JavaScript disabled, all seven navigation links remain accessible.
- `node scripts/check.mjs` validates ten HTML pages and 202 internal references with zero errors. Published-paper, first-author-paper, and registered-patent counts are computed from `content.js`.
- The downloadable public CV was generated from the September 2, 2026 publication and patent snapshot plus the user's September 27 education and role corrections. It omits the original phone number and detailed postal address. No external font, client framework, analytics, or runtime content fetch is used.

## Content boundaries

- The supplied CV is the source for listed papers, patents, periods, and awards. User-confirmed program roles and education are in the live UI. Integrated electronic systems and 3D integration are explicitly separated from completed research.
- Three actual paper figures and gallery photographs were not supplied with confirmed reuse rights. The site has no synthetic scientific visuals or visible empty-image placeholders.
- New publications, changed manuscript status, patent status, project roles, and contact profiles require source review before adding them.

See `AUDIT.md` for the source audit and `../README.md` for editing instructions.

## September 27 role and education correction

- Home now has five substantive sections in the requested order, with no numerical highlight strip.
- About and both public CV formats show Korea University, March 2023 – Present, GPA 4.06 / 4.50; and Soongsil University, March 2019 – February 2023, GPA 4.01 / 4.50, Magna Cum Laude. The expected February 2028 completion date is absent.
- Projects has independent, government-funded, industry–academic, and selected published research sections. The doctoral program alone uses Principal Investigator; the eight other funded programs use Participating Researcher.
- Research presents Integrated Electronic Systems as a long-term direction. Low-temperature electronics, heterogeneous/3D integration, and device–system co-design are prospective subdirections.
- Seven substantive pages were retested at four viewport sizes (28 combinations) with no overflow, missing images, image-alt omissions, or page errors. Navigation and mobile Escape focus behavior passed. `scripts/check.mjs` reported 199 valid internal references and zero errors.
- The five-page public CV PDF was regenerated, rendered to PNG, and visually inspected page by page. Text extraction confirms both corrected education entries and program roles.
