# Min Jong Lee — academic website

Public site: <https://minjonglee.github.io/> · Repository: <https://github.com/minjonglee/minjonglee.github.io>

This is a static HTML, CSS, and JavaScript site. The editable source is JSON in `content/`. Pages CMS uses `.pages.yml`; a Node.js build turns the JSON into public pages. No npm install or web framework is required.

## Pages and navigation

| Main menu | Page | Contents |
|---|---|---|
| About | `about.html` | Portrait, biography, education, and honors; distinct experience appears when added |
| Research | `research.html` | Core interface and memory work, connected foundations, future direction; **Projects** tab opens `projects.html` |
| Publications | `publications.html` | **Papers** and **Patents**; **Conferences** appears when a verified record exists |
| Activities | `activities.html` | Date-sorted awards, research highlights, and media archive; Gallery appears when a cleared photograph is added |
| CV | `cv.html` | Public web CV and PDF download |

The homepage is `index.html`. Existing `.html` URLs remain in place; `contact.html` and `recognition.html` redirect old links. While Conferences has no records, `conferences.html` redirects to Papers and is omitted from the tabs and sitemap. The site logo links home. The footer contains contact details.

## Edit with Pages CMS

1. Sign in at <https://app.pagescms.org/> with the GitHub account that can edit `minjonglee/minjonglee.github.io`.
2. Select this repository and the `main` branch. If the repository is missing, grant the Pages CMS GitHub App access to it in GitHub settings.
3. Open an editor below, edit a record or choose **New**, and **Save**. Pages CMS commits the JSON change to GitHub.
4. Check **Actions → Build and deploy GitHub Pages**. Once it succeeds, refresh the public site; deployment can take several minutes.

| CMS group | Editors and purpose | Source |
|---|---|---|
| Site Settings | Navigation & footer, Home page, CV page text | `content/site.json`, `content/pages/` |
| About | Profile, Education, Experience, Awards & Scholarships, About page text | `content/profile.json`, `content/education/`, `content/experience/`, `content/awards/` |
| Research | Research Areas, Projects, Research case studies, page text, Research topics | `content/research/`, `content/projects/`, `content/research-cases/`, `content/topics/` |
| Publications | Papers, Patents, Conferences, and each page’s text | `content/publications/`, `content/patents/`, `content/conferences/` |
| Activities | News & Media, Gallery, Activities page text | `content/news/`, `content/gallery/` |

The generated `.pages.yml` preserves the existing record fields. Regenerate it after changing the JSON schema with `node scripts/generate-cms-config.mjs` and commit the result.

Homepage research rows come from **Research → Research Areas** records marked **Feature on homepage**: `core` (interface physics), `platform` (memory), and `future` (explicit long-term direction). A `foundation` record appears as a smaller connected research note. Featured papers come from the Papers selection; featured awards and News & Media records appear under homepage Activities. To change these selections, edit the records in CMS rather than the generated HTML.

The Home page editor has visibility switches for Research, Featured Work, and Activities. The Research page editor can hide the core research progression; each Research Area has its own **Show on website** switch. The Projects page editor can hide case studies. A single case study expands within its related project; two or more appear in a separate section. Sections with no featured papers, activities, gallery photographs, or conference presentations are omitted automatically.

### Replace images in Pages CMS

Upload to the relevant image field, fill in its alternative text, and optionally set a caption and **Image crop focus**. The focus menu supports center, top, bottom, left, and right. Images keep the aspect ratio shown below across screen sizes; Research Area images use `object-fit: contain` so a later wide figure stays fully visible inside the 4:3 frame. Missing images leave a text-led layout without a placeholder. Existing concept illustrations remain labeled as illustrations until you replace them.

| Image | CMS editor and fields | Recommended source size |
|---|---|---|
| Home hero | **About → Profile**: Home hero image, alternative text, caption, crop focus | 1600 × 1200 px (4:3) |
| Research page hero | **Research → Research page text → Hero**: image, alt, caption, crop focus | 1600 × 900 px (16:9) |
| Memory, interfaces, optoelectronics, flexible, integration, or new area | **Research → Research Areas**: image, alt, caption, crop focus | 1200 × 750 px (8:5) |
| Featured Work | **Publications → Papers**: image, image alt, image caption, crop focus; set **Feature on homepage** and Homepage order | 1200 × 750 px (8:5) |
| Project | **Research → Projects**: image, image alt, image caption, crop focus | 1600 × 900 px (16:9) |
| Activity and Gallery | **Activities → News & Media**: thumbnail, alt, cover/contain fit, crop focus, detail images and captions; **Gallery**: image, alt, caption, crop focus, date, category, URL | 1600 × 1000 px (activity); 1200 × 900 px (gallery) |

The Home hero retains one labeled concept image. Featured Work and Research use eight distinct, CMS-editable scientific editorial artworks in `assets/artwork/`. They are labeled as conceptual and do not contain measurement plots or invented experimental results. Source photographs and press graphics used by Activities are local files under `assets/images/activities/`. See `docs/IMAGE_ASSETS.md` for the asset list and provenance, and `docs/ARTWORK_PROMPTS.md` for the artwork prompts.

### Add a paper

Open **Publications → Papers → New**. Enter a unique lowercase **Stable URL ID** such as `new-memory-paper`, Title, Authors in publication order, Journal, Year, Publication status, and author role. **Sort date** starts with today's date and controls the newest-first order in both CMS and the public list. For an older paper, change it to a date in the paper's **Year**; the build checks that the years match. Sort date is an internal ordering key, not a claim about the actual publication date. Enter only verified Volume, Issue, Pages, Article number, publication dates, and DOI values. `†` and `*` can remain in the Authors field. A DOI alone creates a `https://doi.org/` link. Use **Feature on homepage** only for a representative paper.

The public Papers list and web/PDF CV show only **Accepted, In Press, ASAP, Early View, Online Published, and Published** records. **Manuscript, Submitted, Under Review, and In Revision** records can stay editable in CMS but do not appear publicly. The current public list has 22 verified records: 6 first-author and 16 co-authored. The metadata line combines Journal, Year, and available bibliographic fields without changing how they are stored.

### Add other records

- **Publications → Patents:** Enter the original title, inventors, status, primary country, applicable jurisdictions, application or registration number, and relevant legal date. **Sort date** starts with today and controls the list position; set it to the appropriate filing or registration date when adding an older patent. Assign the same **Patent family ID** and optional family title only when separate filings are confirmed to cover one invention. The public page groups those filings, while **Registered**, **Application**, and search filter the individual filings. Unverified jurisdictions are described separately without inventing a filing number. Keep the Stable URL ID for existing links. Patent `10-2024-0060762` uses the detailed Korean MIM capacitor title confirmed by the site owner.
- **Publications → Conferences:** Add only presentations with verified conference, title, presenters, year, and any confirmed date, location, and presentation type. **Sort date** controls the newest-first list independently of the displayed conference date. Set it to the conference date when known; for an older record without a confirmed date, choose an internal ordering date. The tab and page become available automatically with the first record.
- **Research → Projects:** Choose **New** and enter a stable URL ID, original project title, program, funding agency, personal role, start date (`YYYY-MM`), and status. An end date is optional. The public page places **Ongoing** and **Completed** records in separate lists and sorts them by start or end date; changing only the status moves the record. An English title, if supplied, appears first; the official Korean title remains below it. **My contribution** is an optional technical-role field and appears only when filled with verified work. Short title, period display override, description, related research/publications, image, and external URL are optional. Leave Description and Summary empty if they only restate the title. Official project dates are not a claim of personal involvement throughout the whole program; use **My participation period** when it is known.
- **About → Education / Experience / Awards & Scholarships:** Update career and recognition records here. The current researcher position is already in the profile and education, so its duplicate Experience entry is retained in CMS but hidden on About. New distinct experience entries appear automatically. Honors form one newest-first list with English titles and English organization first; the official Korean title remains below. The Korean organization field is preserved separately.
- **Activities → News & Media / Gallery:** This collection powers the chronological activity archive; its CMS list sorts by Date descending. Choose a **Category** such as Award, Media, or Research highlight. Enter a title, real date, short description, and optional detail text. Add a local **Activity image** and any number of **Detail images** with alt text and captions. Choose **Contain** for a certificate or full research figure; choose **Cover** for a photograph. Readers can open detail images in a lightbox. For media coverage, add each **Outlet name** and article URL under **Media coverage links**; the card shows only a link count, and readers can expand it to see every outlet link. **Source page** is an editor-only provenance field and never appears publicly. Use **Related award ID** when an activity also exists under Awards & Scholarships so the archive does not duplicate it. **Show on website** hides an entry without deleting it. The Gallery section appears only when a photograph is supplied.

The four source-based Activities records include two awards and two research coverage posts. Their 13 and 12 individual coverage links were transcribed from the laboratory notices. The Samsung and engineering researcher award cards use local copies of the source photographs; the media cards use local copies of images from the linked Korea University and University News Network reports. The exact filenames and source provenance are in `docs/IMAGE_ASSETS.md`.

For any collection, **Show on website** hides a record without deleting it. Papers, Patents, and Conferences use **Sort date** newest-first; Activities use their Date. Adding one does not require renumbering existing records. Older `order` values may remain in JSON for provenance but no longer control these lists. Other collections still use **Display order** where appropriate. Images and the CV PDF upload to `assets/`. Keep image ownership and alt text accurate; see `docs/IMAGE_ASSETS.md`.

## Build and check locally

Install Node.js 22 or later, then run in this repository:

```powershell
node scripts/generate-cms-config.mjs
node scripts/build.mjs
node scripts/check.mjs
node scripts/test-cms.mjs
node scripts/test-publications.mjs
node scripts/test-site-structure.mjs
node scripts/stage-site.mjs
```

To preview, run `node scripts/serve.mjs` and open <http://127.0.0.1:8765/>. Stop with `Ctrl+C`. The build regenerates the root HTML; edit JSON and templates, not generated HTML. `.site/` contains only deployment files.

The web CV (`cv.html`) updates with every build. The PDF at `assets/min-jong-lee-cv.pdf` is an unchanged copy of the owner's `MJL_CV_20261001.pdf` and does **not** regenerate in GitHub Actions. After changing CV facts, upload a revised PDF through **About → Profile → CV PDF file** and keep the web CV content in sync. The optional `scripts/build_cv.py` creates a generated alternative; do not run it over the owner's PDF unless that replacement is intended.

## Deployment and files

On a push to `main`, `.github/workflows/pages.yml` builds, checks, stages, and deploys the site using GitHub Actions. In repository **Settings → Pages**, the source should be **GitHub Actions**. CMS saves to `main` also trigger this workflow. [GitHub Pages deployment guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

- `content/`: editable site data; each collection record is its own JSON file.
- `scripts/content.mjs`, `scripts/pages.mjs`, `scripts/components.mjs`: content loading and templates.
- `scripts/build.mjs`, `scripts/check.mjs`, `scripts/test-*.mjs`, `scripts/stage-site.mjs`: generation and validation.
- `scripts/generate-cms-config.mjs`, `.pages.yml`: Pages CMS schema.
- `styles.css`, `script.js`: responsive design and interactive filters.
- `content.js`: read-only backup of the older data model; the current build does not use it.

The original data and verified DOI links were preserved during the navigation and content migration. Unknown DOI values, conference presentations, news articles, and event photographs were not inferred.
