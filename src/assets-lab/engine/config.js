export const GOLD = '#e6bd77';
export const JADE = '#689d83';
export const TAU = Math.PI * 2;
export const clamp = (x, min = 0, max = 1) => Math.max(min, Math.min(max, x));
export const smooth = (a, b, x) => { const v = clamp((x - a) / (b - a)); return v * v * (3 - 2 * v); };
export function random(seed = 17) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
export const PROFILES = {
  full: { label: 'Full', dpr: 1.5, particles: 420, tubeSegments: 46, radialSegments: 6, leaves: 110, maxTriangles: 90000, maxDrawCalls: 110, targetFPS: 50 },
  lite: { label: 'Lite', dpr: 1, particles: 110, tubeSegments: 25, radialSegments: 4, leaves: 48, maxTriangles: 35000, maxDrawCalls: 80, targetFPS: 30 },
};
export const CHAPTERS = ['Void', 'Light', 'Seed', 'Germination', 'Tree', 'Branches', 'Worlds', 'Human creation', 'Cosmos'];
export const DOMAIN_POSITIONS = [[-3.2,1.8,0.1],[-2.8,-0.25,0.6],[-1.8,3.3,-0.7],[1.8,3.3,-0.7],[3.2,1.8,0.1],[2.8,-0.25,0.6]];
export const DOMAINS = [
  {id:'music',name:'Music',object:'Resonance Bloom',color:'#ddb37a',concept:'An orbital instrument. Brass petals surround a resonant heart.',symbolism:'Expression propagates through the whole tree.',interaction:'Pluck the bloom. Its rings breathe with a synthesized chord.',use:'Album gateway, track selection, audio player.'},
  {id:'ai',name:'AI',object:'Neural Geode',color:'#92cbbb',concept:'An open crystal with a branching lattice inside.',symbolism:'Intelligence grows through connected ideas.',interaction:'Select it to illuminate its neural pathways.',use:'AI services, experiments, automation projects.'},
  {id:'film',name:'Design / Film',object:'Light Loom',color:'#d5a99e',concept:'Folded apertures weaving a ribbon of light.',symbolism:'A frame turns light into a human story.',interaction:'Its nested apertures counter-rotate as you move.',use:'Film reels, design case studies, visual portfolios.'},
  {id:'engineering',name:'Engineering',object:'Tectonic Engine',color:'#b1bfc6',concept:'An inhabitable machine rising from faceted bedrock.',symbolism:'Structure gives imagination a physical form.',interaction:'Activate it to separate the engine into an exploded assembly.',use:'Built work, systems diagrams, engineering projects.'},
  {id:'education',name:'Education',object:'Discovery Helix',color:'#b5c894',concept:'Seeds ascending a double helix toward a new light.',symbolism:'Learning makes another level of growth possible.',interaction:'Energy climbs between the paired seed strands.',use:'Workshops, curriculum, student creations.'},
  {id:'community',name:'Community',object:'Mycelium Commons',color:'#cca3c4',concept:'Independent luminous pods joined by a living mycelium.',symbolism:'Individual lights strengthen a shared network.',interaction:'Pods gather when selected and transmit a shared pulse.',use:'Collaborations, TIMELESS, community projects.'},
];
export const SYSTEMS = [
  {id:'seed',name:'StarrSeed',number:'01',caption:'Origin of the system',hint:'Move to bend the orbits. Activate to release the six domains.',tech:'Procedural mesh · Fresnel shader',source:'src/assets-lab/objects/StarrSeed.jsx'},
  {id:'network',name:'Living network',number:'02',caption:'From roots to constellations',hint:'Choose a domain. Follow the energy through its branch.',tech:'Batched tube geometry · growth shader',source:'src/assets-lab/objects/LivingNetwork.jsx'},
  {id:'ecosystem',name:'Six living objects',number:'03',caption:'Different expressions. One source.',hint:'Select a domain to inspect its behavior.',tech:'Procedural R3F objects · Web Audio',source:'src/assets-lab/objects/EcosystemObjects.jsx'},
  {id:'terrain',name:'Floating worlds',number:'04',caption:'A place for ideas to take root',hint:'Move around the landform. Adjust growth to reveal its tree.',tech:'Faceted geometry · instanced leaves · waterfall shader',source:'src/assets-lab/objects/FloatingWorld.jsx'},
  {id:'primitives',name:'Celestial interface',number:'05',caption:'Light becomes a language',hint:'Try the portal, hover states, and root progress control.',tech:'Semantic HTML · SVG paths · CSS motion',source:'src/assets-lab/ui/Primitives.jsx'},
  {id:'journey',name:'Cinematic journey',number:'06',caption:'Void to cosmos',hint:'Scroll over the scene or scrub the chapters below.',tech:'Scroll-linked realtime scene state',source:'src/assets-lab/AssetScene.jsx'},
];
