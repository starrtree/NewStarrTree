# StarrTree Interactive Asset Lab

First working prototype batch for **NewStarrTree**, isolated at `/assets-lab/`. The existing opening scene is retained. The lab route loads independently and does not request the missing AxStarr model.

## Open it

```sh
npm ci
npm run dev
```

Open the local address printed by Vite, followed by `/assets-lab/`. On GitHub Pages the build emits a real `/NewStarrTree/assets-lab/` entrypoint, so direct links and refresh work without server rewrites. `#/assets-lab` is also supported on hosts with no route configuration.

## What to try

1. Activate StarrSeed. The shell expands, energy travels outward, and six selectable domain objects emerge.
2. Open Living network. Hover or focus a branch in the right panel, then change Growth. The selected branch carries a brighter traveling signal.
3. Inspect Six living objects. Every domain has its own geometry and motion, rather than an icon inside a sphere. Enable Sound to hear synthesized tones; Music responds to the actual analyser output.
4. Open Floating worlds. The network becomes a tree rooted in faceted terrain, with a mineral pool, falling water, crystals and a small architectural gateway.
5. Try Celestial interface. Portal, progress path, orbit loader, tooltip and living card are actual controls. The star cursor is additive and disables on touch and reduced motion.
6. Use the nine lifecycle chapters or scroll over the Journey canvas. Scrubbing works on touch and keyboard. Pause motion, select Lite, or switch to Still view at any time.
7. Enable Tilt on a compatible phone. Orientation is opt-in, calibrated relative to the first reading, clamped, and removed when disabled. The permission and physical motion still need testing on an iPhone.

## Architecture

- `src/assets-lab/AssetsLab.jsx`: route state, semantic controls, device preferences and inspection panel.
- `src/assets-lab/AssetScene.jsx`: one canvas, environment layers, camera, lifecycle composition and live renderer counters.
- `objects/`: reusable source geometry, growth and energy effects, domain objects and instanced components.
- `engine/`: deterministic curves, mesh generation, GLSL, shared quality budgets and local Web Audio.
- `ui/`: semantic celestial primitives; canvas interaction always has corresponding HTML controls.
- `public/assets/lab/`: lightweight still fallbacks rendered from the actual source geometry.
- `docs/assets-lab/asset-catalog.json`: asset names, concepts, symbolism, technologies, interactions, use, cost and source paths.
- `docs/assets-lab/capcut-storyboard.md`: optional cinematic plates and exact realtime/video boundary.
- `docs/assets-lab/verification.json`: reproducible scene checks and geometry counts.
- `docs/assets-lab/previews/`: source review sheet and renderer provenance.

Shared exports live at `src/assets-lab/index.js`. A caller supplies a stable `runtime` ref with `time`, `motion`, `pointer: {x,y}` and `energy`, updated once per animation frame. Objects accept a `profile` of `full` or `lite`; growth and selection are ordinary controlled React props. UI primitives require the lab CSS, which is scoped under `.asset-lab`.

```jsx
import { StarrSeed, LivingNetwork } from './assets-lab';

// Within an existing React Three Fiber canvas:
<StarrSeed runtime={runtime} profile="lite" onActivate={openNavigation} />
<LivingNetwork runtime={runtime} profile="lite" growth={progress} selected={domainIndex} />
```

Prototype status is explicit: none of these assets has been marked visually approved for the production homepage. The repository does not include a standalone approved logo or `AxStarr.glb`. The first batch follows the supplied Spatial Blueprint's radiant glass/gold core and the StarrTree Blueprint's botanical branching and interconnected identity. It does not substitute a newly invented logo for approved artwork.

## Technology decisions

| Need | Implemented approach | Why |
| --- | --- | --- |
| Light seed and refraction-like shell | Procedural geometry + custom Fresnel/vein shader | Responds to pointer and energy without an HDR download or screen-space transmission pass. This is a stylized shell, not physically accurate refraction. |
| Roots, branches, progress | Merged tubes with branch/growth attributes + animated shader | A whole network shares a draw, and one selected path can be lit independently. |
| Category objects | R3F geometry + instancing | Each has its own behavior; repeated pieces share geometry. |
| Terrain and canopy | Faceted geometry + instanced curved leaves | Reproducible and independently reusable; no external model dependency. |
| Water, dust and trails | Small custom shaders / point buffers | Continuous motion with few draws. |
| Accessible interaction | HTML controls, simple SVG connectors, CSS effects | Keyboard, touch, focus, range values and still mode remain usable. |
| Cinematic macro detail | Optional generated video plates described separately | Useful for microstructure and distant atmosphere, not navigation or text. |
| GLB, Meshopt, KTX2, Spline, sprite sheets | Not required by this procedural batch | Add when a specific imported asset benefits. No placeholder or heavy unused loader is shipped. |

## Performance envelope

| Resource | Full | Lite / mobile |
| --- | ---: | ---: |
| Triangle ceiling per scene | 90,000 | 35,000 |
| Estimated draw-call ceiling, environment included | 110 | 80 |
| Device pixel ratio cap | 1.5 | 1.0 |
| Ambient particles | 420 | 110 |
| Release particles, transient | 72 | 24 |
| Canopy leaves, instanced | 110 | 48 |
| Root curve segments / radial sides | 46 / 6 | 25 / 4 |
| External texture downloads | 0 | 0 |
| Future texture cap | 2048² | 1024² |
| Future video plate cap | 1080p, 30 fps, one decoder | 720p, 30 fps, one decoder |
| Future video transfer target | ≤ 8 MB per short plate | ≤ 3 MB per short plate |
| Planning GPU resource envelope | ≤ 64 MiB | ≤ 32 MiB |

The memory envelope is a design target, not a measured total: browser, driver, framebuffer and decoder allocations vary. `verification.json` records actual source-geometry buffer bytes. The live readout uses `gl.info` for triangles and draws; it does not claim to measure total GPU memory. No blur postprocessor, shadow maps, HDR map, transmission render target, or video decoder runs in the first batch.

Auto starts Lite on small/coarse-pointer or low-memory devices and downgrades Full after five sustained low-FPS samples following warmup. It never oscillates between profiles. Explicit Full is available for comparison. Rendering switches to demand mode while paused, reduced motion initially disables playback, and background tabs stop continuous rendering. Created geometry is disposed on unmount. WebGL failure or context loss switches to still previews while preserving HTML navigation.

## Verification and honest limits

```sh
npm run lab:verify
npm run build
```

The R3F test renderer mounts actual components, advances their callbacks, fires selection events, verifies changing growth uniforms, checks finite coordinates and enforces the budgets. It is not a browser or GPU benchmark.

```sh
npm run lab:export
python -m pip install moderngl numpy Pillow
npm run lab:previews
```

The optional preview script uses native EGL on exported Three geometry. It compiles the custom GLSL after a GLSL 330 syntax conversion; standard materials use reference lighting. Those images are source studies and still fallbacks, **not browser screenshots**.

In this Work session, the cloud browser URL security policy blocked the preview. No live browser, audible playback, orientation permission, FPS stability, responsive screenshot or physical iPhone crash test is claimed. The code and shaders were tested through the scene renderer and native rendering instead.

Before homepage integration, open the branch build on desktop and a physical iPhone 13 Pro Max. Verify seed activation, six branch selections, growth and chapter scrubbing, muted-by-default audio and sound response, pause, reduced motion, tilt allow/deny, portrait/landscape layout, background/resume and still mode. Spend five minutes moving between all systems; record the live counters and any context loss. Confirm branch geometry remains readable and the design is approved. This remaining device gate matters more than another decorative asset.
