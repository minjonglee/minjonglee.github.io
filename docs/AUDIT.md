# Repository audit and redesign decisions

Audit performed before implementation, September 25, 2026.

## Original site

- Seven HTML pages, one CSS file, one browser script, and `content.js`; no package manager, framework, build pipeline, image assets, or downloadable CV.
- Read every original HTML page, CSS/JS, README, favicon, robots, and sitemap. Compared content against the original DOCX and inspected desktop/mobile screenshots.
- Useful elements retained: separate page navigation, CV publication/patent/project/award records, the ML identity, restrained warm accent, serif/sans pairing, section numbering, thin rules, skip link, focus states, responsive menu with Escape, reduced-motion support, Scholar link, and relative links suitable for GitHub Pages.
- Original visual language relied on a dark gradient hero, luminous CSS chip, orbit graphics, colored cards, and a large red contact area. These competed with the research narrative.
- Original `script.js` created all lists at runtime, defaulted to author-role filtering, and recreated truncated lists with “show more” buttons. Authors were omitted. In-revision work was mixed into the publication list despite introductory text describing it as separate.
- Homepage repeated much of every interior page. Projects were embedded within Patents; Contact occupied a separate page; navigation/footer markup was duplicated across HTML files. Some page titles were incomplete (“Get in”, “Published”, “Awards &”).
- Small-screen research descriptions reached 11px. The tablet layout hid one featured item. The redesigned layout keeps the same research records at all screen sizes.

## Implementation

- Retained HTML/CSS/JS and existing `.html` URLs. No client framework or production package dependencies.
- `content.js` remains the editable content source. Tiny Node scripts expand shared components into committed static HTML; a visitor never needs Node, JavaScript, or a build service to read the content.
- Replaced the old ornamental CSS and runtime list rendering rather than layering new overrides on them. Browser JS only handles navigation, topic filters, legacy anchors, print, and the current year.
- Added `projects.html`, `activities.html`, and `cv.html`; legacy `recognition.html` and `contact.html` remain accessible through redirect pages with fallback links.
- Research organized into three pillars and a connected optoelectronics foundation. “Established”, “Current”, and “Emerging / future” text describes the strength of evidence. Circuit/system topics use dashed rules in the cross-scale framework.
- About and footer carry contact links. A public PDF CV omits the original phone number and detailed postal address.
- Headers use two system font stacks, warm paper, dark text, and thin dividers. The later site-wide pass changed the accent to deep blue and removed conceptual research SVGs.

## Evidence and deliberate limitations

- Main source: user-provided `MJL_CV_20260901.docx`, whose internal last-update line is September 2, 2026; supplemented by the user's research brief.
- 21 publication records preserved: 20 published/early-view entries and one manuscript in revision. Author names are restored from the CV. No co-first/corresponding badge is inferred for Min Jong Lee.
- Seven DOI records matched by title and author against Crossref metadata. All three papers currently featured on the homepage have DOI links. The other 13 published papers use explicitly labeled Scholar searches. Rate-limited metadata queries were not treated as verification.
- Eight patent records retained with original status and identifiers. US application numbers are labeled US only; China/Taiwan mentions remain notes because separate local numbers are unavailable.
- Research/project summaries are grounded in CV titles and the supplied brief; they do not add quantitative claims. “Related patent” links are topic associations, not a claim of legal family linkage or technology licensing.
- AEEL and Prof. Shim are linked to the provided laboratory website. No affiliation with MIT, Stanford, SK hynix, or another prospective institution/company is implied.
- The user-provided portrait is applied on Home and About. No paper figures or event photographs were supplied; the final homepage uses text-led featured work and no experimental charts.
- ORCID/LinkedIn remain null until exact profile URLs are supplied. Conference/talk/visit details remain unfilled. No pre-2023 education history is inferred.
- Publication status, project dates, and patent status remain the CV snapshot; this redesign is not a live registry or comprehensive bibliography update.

See `QA.md` for validation, and `../README.md` for editing and deployment.

## September 26 site refinement

- Compared the live GitHub Pages HTML with the repository before editing; the substantive pages matched. The homepage now has six major sections: hero, verified highlights, research framework, three featured outputs, three current research previews, and About. Full lists remain on their own pages.
- Home, About, Research, Projects, Publications, Patents, and CV form the primary navigation. Projects is a substantive page again, with independent, industry, interdisciplinary, and collaborative records. Recognition and the gallery remain on About; Contact remains in the footer. Three legacy URLs still redirect.
- Research now distinguishes a common scientific question, three device platforms, and integrated/3D systems as a future direction. Flexible-device work is identified as CV-listed collaboration. The Publications flexible filter intentionally has no published result in the supplied CV.
- Verified program titles, periods, and sponsors are retained. Only the doctoral research support project has a verified principal-investigator role; other individual program roles were initially marked for internal verification and are now omitted from the live pages. Paper-linked case studies retain roles and outputs supported by publication records.
- Three conceptual illustrations were used during the September 26 stage. The final pass removed them; cleared actual figures can be added later.

## September 27 editorial pass

- The live site and local repository matched before editing. The requested seven-link navigation, six-section home, and dedicated Projects page were already present, so this pass did not add sections or reset the architecture.
- Tightened the research introduction and separated published memory/optoelectronic work from CV-listed flexible-device collaborations. About's biography and vision now use the editable profile data instead of duplicate hard-coded prose.
- Regenerated the public CV PDF with the same broad research-identity summary as the web CV. Publication, patent, project, and award records remain based on the September 2, 2026 source CV.

## September 27 final site-wide pass

- Standardized the seven-link navigation, footer, deep blue accent, page-title treatment, and editorial rows across all substantive pages.
- Removed unverified role labels, empty gallery prompts, and three conceptual science SVGs from the live site. The portrait is the only supplied photograph. Featured work is text-led until reusable real research figures are available.
- Rewrote About around the electronic-device and interface-physics identity; shortened Research to scientific questions, three device platforms, and a clearly marked future direction. Project records remain on Projects, selected and full chronological papers on Publications, and award records on About.
- Grouped published papers by year and retained only verified first-author markers. Kept registered and application patent states separate, with technical area as quiet metadata.

## September 27 role and education correction

- The user supplied two corrected education entries, including periods, degrees, GPAs, and undergraduate honor. These supersede the earlier expected completion date and the original audit's assumption that no pre-2023 education could be shown.
- The user confirmed participation as a researcher in the listed government-funded and industry–academic R&D programs. The doctoral research support project remains the sole program labeled Principal Investigator.
- Home now moves directly from the hero to Research, Featured Work, Current Research, and About. The numerical highlight strip was removed.
- Projects separates independent ownership, government R&D participation, industry–academic R&D participation, and paper-linked published research. Integrated electronic systems is presented as a long-term direction, with 3D integration one possible path.
- The public HTML CV and downloadable PDF were regenerated from the corrected data. Publication and patent records still derive from the September 2, 2026 CV snapshot; the education and role corrections came directly from the user's September 27 request.

## September 27 final academic-polish pass

- Kept the existing site concept. Home, About, and Research now use the same Core Science and Long-term Direction vocabulary; the five-stage About journey uses the user's requested scientific subtopics.
- Projects program rows were shortened to verified titles, sponsor, full-month period, confirmed role, and a concise description grounded in each title. The official Korean doctoral-project title remains on the Independent Research section; full Korean program titles remain in the public CV.
- Simplified the published-research entries by removing a methods line that repeated the scientific approach. About awards separate award names from awarding bodies for easier scanning.
