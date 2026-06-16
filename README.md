# NewStarrTree

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
