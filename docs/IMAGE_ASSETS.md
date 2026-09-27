# Research image assets

The six `assets/concept-*.jpg` images were generated with the built-in imagegen tool on September 27, 2026, then encoded as quality-92 JPEGs for the website while preserving their 1448×1086 resolution. The user-supplied composite image was a **visual reference** for scientific subject matter and a restrained blue/white palette. It was not used as evidence. These assets are conceptual illustrations, **not experimental microscopy, measurement data, device schematics, or figures from the cited papers**. The pages label them accordingly.

| Asset | Current use | Prompt subject |
|---|---|---|
| `concept-device-layers.jpg` | Home hero | Layered emerging electronic device with electrode, functional layer, thin interface, substrate, and restrained blue charge motifs |
| `concept-molecular-interface.jpg` | Research: interfaces; featured paper on molecular contacts | Ordered molecular self-assembled interface between a thin contact and organic/hybrid semiconductor |
| `concept-memory-switching.jpg` | Research: memory; featured paper on synaptic response | Layered memristive device with subtle ion pathways and defect sites |
| `concept-trap-engineered-memory.jpg` | Featured paper on trap reduction | Optoelectronic memristor stack with an ultra-thin intermediate layer, incident light, and subtle charge/defect motifs |
| `concept-optoelectronic-stack.jpg` | Research: optoelectronics | Hybrid optoelectronic thin-film stack receiving soft incident light |
| `concept-flexible-circuit.jpg` | Research: flexible electronics | Curved flexible circuit with thin conductive traces and layered materials |

## Generation prompt set

All six prompts requested a high-resolution 4:3 editorial scientific concept illustration for an academic electrical-engineering website. They used the supplied collage **only as a visual reference** and asked for a quiet scientific-magazine style, pale neutral background, near-black/slate materials, restrained cobalt-blue accent, fine material texture, and generous negative space. Each prompt specified the subject in the table above. They explicitly prohibited copied text or layout, typography, labels, logos, scale bars, rulers, axes, charts, annotation, montage, borders, neon effects, and claims of experimental or published origin.

## Replacing an illustration with verified research imagery

1. Add the image to `assets/` after checking publication/reuse rights.
2. In `content.js`, update the relevant `image`, `imageAlt`, and `imageCaption`. The same asset may be used in more than one section. Use a caption that accurately describes the actual source; remove “Concept illustration” when it no longer applies.
3. Run `node scripts/build.mjs` and `node scripts/check.mjs`.

The Activities gallery is reserved for authentic event photographs with verified captions and remains empty.
