# Min Jong Lee — academic website

Public site: <https://minjonglee.github.io/> · Repository: <https://github.com/minjonglee/minjonglee.github.io>

This is a static HTML, CSS, and JavaScript site. The editable source is JSON in `content/`. Pages CMS uses `.pages.yml`; a Node.js build turns the JSON into public pages. No npm install or web framework is required.

## Pages and navigation

| Main menu | Page | Contents |
|---|---|---|
| About | `about.html` | Portrait and biography, followed by aligned education, experience, honors and scholarships lists |
| Research | `research.html` | Research overview; **Projects** tab opens `projects.html` |
| Publications | `publications.html` | **Papers**, **Patents**, and **Conferences** tabs open their own pages |
| Activities | `activities.html` | News & Media and Gallery |
| CV | `cv.html` | Public web CV and PDF download |

The homepage is `index.html`. Existing `.html` URLs remain in place; `contact.html` and `recognition.html` redirect old links. The site logo links home. The footer contains contact details.

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

### Add a paper

Open **Publications → Papers → New**. Enter a unique lowercase **Stable URL ID** such as `new-memory-paper`, Title, Authors in publication order, Journal, Year, Publication status, and author role. Enter only verified Volume, Issue, Pages, Article number, publication dates, and DOI values. `†` and `*` can remain in the Authors field. A DOI alone creates a `https://doi.org/` link. Use **Feature on homepage** only for a representative paper.

The public Papers list and web/PDF CV show only **Accepted, In Press, ASAP, Early View, Online Published, and Published** records. **Manuscript, Submitted, Under Review, and In Revision** records stay editable in CMS but do not appear publicly. The existing hidden manuscript is preserved. The current public list has 22 verified records: 6 first-author and 16 co-authored. The metadata line combines Journal, Year, and available bibliographic fields without changing how they are stored.

### Add other records

- **Publications → Patents:** Enter the original title, inventors, status, primary country, applicable jurisdictions, application or registration number, and relevant date. Select **Registered** or **Application** for the public status filter. Keep the existing Stable URL ID so links continue to work. Patent `10-2024-0060762` uses the detailed Korean MIM capacitor title confirmed by the site owner.
- **Publications → Conferences:** Add only presentations with verified conference, title, presenters, year, and any confirmed date, location, and presentation type. The page currently shows an honest empty state because no complete conference record has been supplied.
- **Research → Projects:** Choose **New** and enter a stable URL ID, original project title, program, funding agency, personal role, start date (`YYYY-MM`), and status. An end date is optional. The public page automatically places **Ongoing** and **Completed** records in separate lists and sorts them by start or end date; changing only the status moves the record. English/short titles, a period display override, description, related research/publications, and external URL are optional. Existing program period, sponsor, case study, image, and related fields remain editable. Official project dates are not a claim of personal involvement throughout the whole program; use **My participation period** when it is known.
- **About → Education / Experience / Awards & Scholarships:** Update career and recognition records here. The About page uses these collections directly. Honors form one newest-first list; each item retains its own year and CMS order, without year subheadings.
- **Activities → News & Media / Gallery:** Add dated and sourced news or authorized photographs. These collections are currently empty. The Activities page also draws the two featured, verified awards from **About → Awards & Scholarships**; no news article or event photograph is inferred. Add image alternative text, a date, and a caption for each gallery photograph.

For any collection, **Show on website** hides a record without deleting it. **Display order** sorts records where a date or year does not determine order. Images and the CV PDF upload to `assets/`. Keep image ownership and alt text accurate. Research concept images are labeled as such rather than presented as experimental evidence; see `docs/IMAGE_ASSETS.md`.

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

The web CV (`cv.html`) updates with every build. The PDF is a committed file at `assets/min-jong-lee-cv.pdf` and does **not** regenerate in GitHub Actions. After changing CV facts, either upload a revised PDF through **About → Profile → CV PDF file** or, on Windows with ReportLab and Korean capable fonts installed, run `python scripts/build_cv.py` and commit the new PDF. Confirm its contents before publishing.

## Deployment and files

On a push to `main`, `.github/workflows/pages.yml` builds, checks, stages, and deploys the site using GitHub Actions. In repository **Settings → Pages**, the source should be **GitHub Actions**. CMS saves to `main` also trigger this workflow. [GitHub Pages deployment guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

- `content/`: editable site data; each collection record is its own JSON file.
- `scripts/content.mjs`, `scripts/pages.mjs`, `scripts/components.mjs`: content loading and templates.
- `scripts/build.mjs`, `scripts/check.mjs`, `scripts/test-*.mjs`, `scripts/stage-site.mjs`: generation and validation.
- `scripts/generate-cms-config.mjs`, `.pages.yml`: Pages CMS schema.
- `styles.css`, `script.js`: responsive design and interactive filters.
- `content.js`: read-only backup of the older data model; the current build does not use it.

The original data and verified DOI links were preserved during the navigation and content migration. Unknown DOI values, conference presentations, news articles, and event photographs were not inferred.
