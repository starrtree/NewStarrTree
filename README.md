# NewStarrTree

**[Open the interactive StarrTree Asset Lab →](https://starrtree.github.io/NewStarrTree/assets-lab/)**

Explore the seed, grow its roots, switch between the six creative worlds, and scrub the cinematic journey. Use **Lite** or **Still** on a slower device. No installation required.

[![StarrTree Asset Lab — click to open the interactive experience](docs/assets-lab/previews/starrtree-source-study.jpg)](https://starrtree.github.io/NewStarrTree/assets-lab/)

The image above is a source-rendered preview sheet; click it to open the working lab. GitHub displays the source and preview here; the live interactions run on the linked website.

This first batch establishes interaction behavior. The next visual pass will combine art-directed PNG/WebP layers with selected Meshy GLB or Spline objects. See the [visual asset pipeline](docs/assets-lab/VISUAL-PIPELINE.md).

A performance-first cinematic rebuild of the StarrTree personal brand experience.

## Current prototype

The opening sequence now includes:

- a black cosmic void
- a compact white-gold star ignition
- a floodlight-style bloom
- `AxStarr.glb` scaling outward from the star
- automatic model normalization so different exports fit the frame
- subtle majestic hovering and body drift
- slow automatic camera orbit
- manual drag-to-orbit and scroll/pinch zoom
- mobile rendering limits and reduced-motion support

## Model location

Place the current model at:

```text
public/assets/models/AxStarr.glb
```

The deployment workflow also copies a root-level `AxStarr.glb` into that production path if needed.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Next animation milestone

When a rigged model is available, replace or update `AxStarr.glb` and add a named arm-opening animation clip. The existing birth, hover, camera, lighting, and interaction systems can remain in place.

## Interactive Asset Lab

The new `/assets-lab/` route contains the StarrSeed, a living navigation network, six interactive domain objects, floating terrain, celestial UI primitives and a nine-chapter cinematic prototype. See [the lab guide](docs/assets-lab/README.md), [asset catalog](docs/assets-lab/asset-catalog.json), and [source review sheet](docs/assets-lab/previews/starrtree-source-study.jpg).

```sh
npm run lab:verify
npm run build
```

The lab is independent of the opening model. Its still fallbacks and source geometry are included. Live browser controls and image previews have been checked. GPU rendering and physical iPhone validation remain pending; see the lab guide for the evidence and limitations.
