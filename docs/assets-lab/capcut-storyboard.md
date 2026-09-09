# StarrTree cinematic plate plan

The site remains functional without any video. All nine chapters already have a realtime representation. Generated footage is an optional atmosphere or macro-detail layer; navigation, the seed, selectable objects, text, roots and scroll state stay realtime.

## Journey mapping

| Chapter | Normalized progress | Current realtime behavior | Optional video contribution |
| --- | ---: | --- | --- |
| Void | 0.000 | Seed nearly invisible; sparse depth layers | Black optical field with restrained grain |
| Light | 0.125 | Core appears and scale increases | Microscopic light ignition behind the core |
| Seed | 0.250 | Full seed and orbital shell | None; keep it fully interactive |
| Germination | 0.375 | Roots reveal via growth uniform | Macro intercut of light moving through a root |
| Tree | 0.500 | Trunk, branches and attached leaves grow | None; geometry needs to stay continuous |
| Branches | 0.625 | Six domain objects become visible | None; selection is live |
| Worlds | 0.750 | Rooted terrain appears beneath the system | Distant cloud sea or far terrain plate |
| Human creation | 0.875 | Living structure and architectural gateway remain in view | Hands making work / Max's approved footage; no fabricated likeness |
| Cosmos | 1.000 | Camera withdraws from the combined ecosystem | Far field celestial scale and soft atmospheric depth |

The chapter control is state-driven, not tied to a video duration. The present Human creation chapter is an abstract architectural placeholder, not an animated human. A verified Max/approved model or approved real footage is the next asset needed there.

## Plate A: the first light

**6 seconds, 16:9, 24 or 30 fps.** Also make a separately composed 9:16 version if this plate is selected. Lock the seed's future position at the center. Start and end with at least 12 quiet frames for blending.

```text
A nearly black optical void with a deep forest-green undertone, one infinitesimal warm-white point at the exact center, extreme cinematic macro photography, the point slowly gathers a delicate champagne-gold diffraction corona, a restrained sixfold optical signature appears around the light, hair-thin caustics drift across an invisible curved membrane, profound scale and patient stillness, realistic lens falloff, soft shadows, elegant high-contrast film lighting, the brightest light remains small and contained, a slow controlled push forward that ends before the seed itself becomes visible, photoreal mineral and optical behavior, premium art installation rather than a fantasy game, all action inside the central thirty percent, large clean black negative space, no text, no letters, no logos, no interface, no frames, no explosive flare covering the image, no neon blue or purple, no music or voice
```

Composite behind the realtime seed. Keep opacity low and fade out by Seed. Do not try to use generated geometry as the clickable object.

## Plate B: energy beneath the surface

**8 seconds, 16:9.** One continuous macro tracking shot, no jump cuts.

```text
Extreme macro tracking shot along a living root made of dark polished organic mineral, microscopic golden capillaries running inside translucent amber and clear quartz, delicate botanical tissue fused with precise crystalline structure, a single warm-white energy pulse travels down the root then divides into three thinner capillaries, tiny green fibers grow in the wake of the pulse, tactile realistic materials with shallow depth of field, motion feels like slow sap and electricity at once, dark forest-green and charcoal environment, champagne-gold illumination with cool emerald reflections, camera follows the pulse in one smooth continuous move, the final half-second drifts into soft black so a realtime scene can emerge, mysterious and elegant, no plant growing into letters, no text, no logos, no user interface, no people, no generic galaxy backdrop, no cartoon vegetation
```

Use only as a short transition intercut or an optional background detail. The realtime root's actual reveal and selected destination must remain authoritative.

## Plate C: floating terrestrial atmosphere

**8 seconds, 16:9, seamless ambient loop where possible.** The near foreground and the center remain clear for realtime worlds.

```text
A distant suspended archipelago above a vast dim cloud sea, cinematic atmospheric landscape, small dark basalt landforms in the far left and far right background, delicate trees silhouetted against sparse warm celestial light, faint silver-green waterfalls disappearing into low clouds, one distant dark planetary body with a thin champagne-gold limb, a restrained palette of near-black forest green, mineral charcoal and pale gold, camera almost locked with only imperceptible forward drift, clouds move slowly left to right, light and framing stable at both ends for a soft loop, immense depth with the central forty percent intentionally empty and dark, sophisticated photoreal environmental plate, no floating foreground object, no bright central sun, no glowing icon circles, no text, no logos, no interface, no cuts, no characters
```

Composite behind the realtime foreground terrain. This is where video can provide richness without spending mobile geometry on distant clouds and waterfalls.

## Plate D: the human connection

**6 seconds, editorial shot using supplied/approved real footage only.** Replace the subject description with approved source footage; do not fabricate Max's face or hands.

```text
Transform the provided real creative-work footage into a quiet cinematic transition, preserve the actual person's identity, hands, objects and action, emphasize the moment a human idea becomes real, warm focused light on the working surface with a near-black forest-green background, subtle champagne highlights on tools and materials, shallow depth of field, slow physical camera movement, the composition should leave the middle upper area clean for a realtime overlay, natural skin and realistic anatomy, no invented faces, no additional people, no text, no logos, no interface, no magical symbols on skin, no artificial hand gestures
```

This plate needs an approved source clip before generation. Music, engineering, teaching and filmmaking should eventually use Max's actual work.

## Delivery and playback rules

- Render a clean plate, never a webpage screenshot. Text and interactive controls are separate HTML/R3F layers.
- Export H.264 MP4 for Safari compatibility; supply a poster derived from that exact video. Keep optional WebM as an enhancement.
- Target one active decoder, no more than 720p on mobile and 1080p on desktop. Use `muted`, `playsInline`, a poster and `preload="none"`; load near its chapter only.
- Pause out-of-view and background footage. Reduced motion shows the poster. A failed download leaves the realtime scene usable.
- Avoid seeking on every wheel event. If continuous seeking is art-directed later, encode sufficiently frequent keyframes and coalesce scroll updates; test actual iPhone seek behavior before shipping.
- For a first release, use chapter fades and slow ambient loops. Reserve precise scroll synchronization for realtime geometry.
- No paid video generation, uploaded personal media or external video dependency was used in this batch.
