# StarrTree visual asset pipeline

The current procedural specimens are interaction prototypes. Keep their reusable behaviors while replacing selected visual surfaces with more carefully art-directed assets. Visual approval comes before expanding the collection.

## Choose the medium by what the object must do

| Use | Preferred source | Interaction |
| --- | --- | --- |
| StarrSeed and other objects viewed from multiple angles | Approved concept image → Meshy → optimized GLB | Real rotation, lighting, separate core/shell/roots, animated opening |
| Floating-world establishing views, distant terrain, clouds, foreground leaves | Separate transparent PNG masters → responsive WebP exports | Parallax, depth, masking, pointer movement |
| Navigation roots, constellations, selection effects | Existing procedural curves, SVG and shaders | Grow toward the active destination; react to progress and selection |
| A scene composed and animated in Spline | Published Spline scene via its React runtime | Website events drive named objects and scene variables |
| Large cinematic environment transitions | Optional video plates described in the CapCut storyboard | Crossfade beneath live UI; pause outside the viewport |

## First art-direction target: StarrSeed

Create one exceptional seed before generating the six domain objects. Its silhouette should read as both a botanical seed and an astronomical instrument: an asymmetric split mineral husk, an ivory-gold light core suspended inside, fine living root filaments, and one incomplete orbital arc. Use dark mineral green, warm metal, restrained luminous detail, and realistic material response. Avoid a generic glowing sphere with identical rings.

### Concept-image brief

> One isolated StarrTree seed sculpture, botanical seed pod fused with a rare mineral and a celestial instrument. Asymmetric tapered translucent smoky-quartz husk, two distinct shell lobes with a narrow fissure, suspended ivory-gold inner kernel, very fine golden root veins integrated into the shell, one incomplete thin brushed-gold orbital structure. Dark evergreen mineral inclusions, realistic physically plausible glass and metal, premium macro product lighting, mysterious and elegant. Three-quarter view; complete silhouette within frame; simple neutral background that separates every edge; ample margin. No text, logo lettering, watermark, interface, ground plane, multiple objects, extra moons, floating debris or baked lens flare. Preserve solid structural edges for image-to-3D conversion.

Use the existing StarrTree logo and approved project references alongside this brief. A concept image must be reviewed for silhouette and materials before treating it as an approved production asset. Generate atmosphere, bloom and loose particles separately so they remain controllable in the website.

### Meshy handoff

1. Use the approved isolated image for Image to 3D. Inspect the back and underside; a single image does not specify unseen geometry.
2. Export a textured **GLB**. Meshy recommends GLB for web use and embeds textures in the file. [Meshy export formats](https://docs.meshy.ai/en/webapp/guides/platform/export-formats)
3. Prepare separate named meshes `shell_left`, `shell_right`, `core`, `orbit` and `roots` when the seed must open. Image-to-3D does not guarantee usable separate parts or animation; separate/retopologize them in a 3D editor if necessary.
4. Make a low-detail mobile variant and a still fallback from the approved visual. Review the optimized model against the source image before replacing the lab specimen.
5. Keep web effects such as glow, energy flow and particle release in the runtime, so the same model can respond to navigation and scroll.

Proposed per-hero delivery targets: GLB ≤3 MB, ≤20k rendered triangles on desktop / ≤8k on mobile, ≤4 materials, 1024px mobile textures, 2048px desktop textures only when needed. These are acceptance targets, not measured costs of a model that has not yet been supplied. Stay within the whole-scene budgets in `engine/config.js`; do not add these on top of an already full budget.

Suggested future source paths: `public/assets/lab/models/starrseed.glb`, `starrseed-mobile.glb`, and `public/assets/lab/art/starrseed.webp`. These model files and an import adapter are not part of the current prototype.

## Connection options

**Meshy:** an official MCP server exists: `@meshy-ai/meshy-mcp-server`. It can generate models, inspect task progress and retrieve outputs. It needs a Meshy API key configured securely in a supporting MCP client. No Meshy connector is installed in this Work session, and no API calls have been made. A Meshy web subscription should not be assumed to include API usage; check the account before starting paid generation. Exporting the GLB manually is enough for repository integration. [Official Meshy MCP documentation](https://docs.meshy.ai/en/api/ai)

**Spline:** its official Code API and React runtime support exported scenes, object events and variables controlled from a website. A published Spline scene URL can be embedded without agent access to the editor. No official Spline MCP has been verified for this session; the verified route is Spline export → React runtime. [Spline Code API](https://docs.spline.design/exporting-your-scene/web/code-api-for-web) · [Exporting code](https://docs.spline.design/exporting-your-scene/web/exporting-as-code)

Never put private provider keys in frontend code or a public repository. Any future API generation runs belong in a trusted backend or configured MCP client.

## Approval gate for each replacement

Review the visual at desktop and phone size, full silhouette, material quality and motion; then measure compressed transfer size, rendered triangles, draw calls and texture memory. Confirm a stable mobile fallback, keyboard-accessible navigation and reduced motion. Preserve the source image and editable model/scene so later variants remain consistent.
