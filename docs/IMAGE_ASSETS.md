# Research image assets

The Home hero uses `assets/concept-device-layers.jpg`, a concept illustration generated in September 2026 from a user-provided visual reference. It is not experimental microscopy, measured data, or a figure from a paper. The other older `assets/concept-*.jpg` files remain in the repository for reference but are no longer reused across Featured Work and Research.

## Paper-specific and research schematics

`node scripts/generate-schematics.mjs` creates eight local, code-native SVGs under `assets/schematics/`. They share a restrained editorial style and label themselves **Conceptual schematic · no experimental data**. Each image field remains independently replaceable in Pages CMS.

| Asset | Use | Scientific basis |
|---|---|---|
| `featured-chiral-synapse.svg` | Accepted chiral-perovskite synapse paper | Helicity and analog conductance states are stated in the paper title; the image does not assert a device stack or measured response. |
| `featured-hydrogen-synapse.svg` | Hydrogen-bond artificial synapse paper | PVA–CsPbI₃ interface and FTO / hybrid / PMMA / Ag stack described by the published paper. |
| `featured-opto-memory.svg` | Low-power optoelectronic memristor paper | TiO₂ interlayer, trap control, optical input, and memory are described in the published abstract. |
| `research-interfaces.svg` | Core interface physics | Abstracted contacts, defects, ions, and transport paths. |
| `research-memory.svg` | Core memory and reliability | Abstracted state formation and resolvable analog levels; no performance curve. |
| `research-optoelectronics.svg` | Optoelectronics foundation | Light input, charge-selective interface, and carrier extraction. |
| `research-flexible.svg` | Flexible electronics foundation | Bending and continuity of an interconnect. |
| `research-integration.svg` | Future direction | Dotted progression from device to array to system, explicitly prospective. |

The published-paper concepts were cross-checked against the [Advanced Materials paper](https://advanced.onlinelibrary.wiley.com/doi/10.1002/adma.202511728) and [Advanced Functional Materials paper](https://advanced.onlinelibrary.wiley.com/doi/10.1002/adfm.202421080). The accepted chiral paper has no verified public abstract in this repository, so its schematic stays at the level of its confirmed title.

## Activity photographs

The laboratory notices include award photographs, but their reuse rights are not documented in this repository. They were not copied or hotlinked. The two media entries use the local, paper-specific conceptual schematics as thumbnails; the award entries remain text-led until the owner uploads originals or cleared copies through Pages CMS, with accurate alternative text and captions.

## Replacing a schematic

In Pages CMS, open **About → Profile** for the Home hero, **Research → Research Areas** for a topic image, or **Publications → Papers** for a Featured Work image. Upload a cleared image, add meaningful alt text, and describe the image accurately in the caption. Remove the conceptual label only when the replacement is a genuine research figure. For local edits, run `node scripts/build.mjs` and `node scripts/check.mjs`.
