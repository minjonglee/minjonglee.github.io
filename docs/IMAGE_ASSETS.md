# Image assets and provenance

The Home hero remains `assets/concept-device-layers.jpg`. It is conceptual artwork. The eight Featured Work and Research images below were generated specifically for this site with the built-in image-generation tool, visually reviewed, and exported as 1586 × 992 JPEGs at quality 88. They are editorial interpretations, not microscopy, device photographs, or measured results. The generation prompts are recorded in [ARTWORK_PROMPTS.md](ARTWORK_PROMPTS.md).

| Local file under `assets/artwork/` | Website use |
|---|---|
| `featured-chiral-synapse.jpg` | Home Featured Work: chiral perovskite synapse |
| `featured-hydrogen-synapse.jpg` | Home Featured Work: hydrogen-bond artificial synapse |
| `featured-opto-memory.jpg` | Home Featured Work: intermediate-layer optoelectronic memristor |
| `research-interfaces.jpg` | Research: interfaces, defects, ions, and transport |
| `research-memory.jpg` | Research: memory and reliability |
| `research-optoelectronics.jpg` | Research: optoelectronics and hybrid devices |
| `research-flexible.jpg` | Research: flexible and stretchable electronics |
| `research-integration.jpg` | Research: prospective device-to-system integration |

The published-paper concepts were cross-checked against the [Advanced Materials paper](https://advanced.onlinelibrary.wiley.com/doi/10.1002/adma.202511728) and [Advanced Functional Materials paper](https://advanced.onlinelibrary.wiley.com/doi/10.1002/adfm.202421080). The chiral paper artwork stays at the level of its confirmed title and does not assert a device stack. Artwork contains no internal labels or fabricated measurement plots.

## Activities: source photographs and press graphics

These are local copies of the full-size images exposed by the source pages, rather than hotlinks. The laboratory source-page URLs remain in the CMS records as editor-only provenance and are never shown on the public Activities page.

| Local file under `assets/images/activities/` | Website use | Source |
|---|---|---|
| `samsung-award-presentation.jpg` | Samsung award card thumbnail and detail gallery | Laboratory notice recorded in `content/news/samsung-paper-award.json` |
| `samsung-award-ceremony.jpg` | Samsung award detail gallery | Same laboratory notice |
| `samsung-award-certificate.png` | Samsung award detail gallery | Same laboratory notice |
| `next-generation-engineering-award.jpg` | Engineering researcher award card and detail gallery | Laboratory notice recorded in `content/news/next-generation-engineering-award.json` |
| `hydrogen-synapse-press-figure.jpg` | Hydrogen-bond coverage card and detail gallery | [Korea University news report](https://www.korea.ac.kr/ko/552/subview.do?enc=Zm5jdDF8QEB8JTJGa3VzdG9yeSUyRmtvJTJGYXJ0Y2xWaWV3LmRvJTNGYXJ0Y2xTZXElM0QyODA3NyUyNg%3D%3D) |
| `hydrogen-synapse-researchers.jpg` | Hydrogen-bond coverage detail gallery | Same Korea University report |
| `optoelectronic-memristor-press-02.jpg` | Memristor coverage card and detail gallery | [University News Network report](https://news.unn.net/news/articleView.html?idxno=574678) |
| `optoelectronic-memristor-press-01.jpg` | Memristor coverage detail gallery | Same University News Network report |

The two laboratory media notices did not include research photos in their HTML. Their linked university and news reports supplied the research graphics and portraits used above. The next-generation award certificate records October 24, 2025; the original laboratory post was first published August 29 and updated November 10. The activity uses the certificate's award date.

## Editing in Pages CMS

- **Publications → Papers:** Featured Work image, alternative text, caption, crop focus.
- **Research → Research Areas:** each research image, alternative text, caption, crop focus.
- **Activities → News & Media:** card thumbnail, alternative text, `Cover`/`Contain` fit, crop focus, and any number of detail gallery images with alternative text and captions.
- **About → Profile:** Home hero image and alternative text.

After local edits, run `node scripts/generate-cms-config.mjs`, `node scripts/build.mjs`, and `node scripts/check.mjs`.
