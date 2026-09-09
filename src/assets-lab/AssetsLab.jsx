import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { CHAPTERS, DOMAINS, PROFILES, SYSTEMS, clamp } from './engine/config.js';
import { labRootPath } from './engine/paths.js';
import { useLabAudio } from './engine/useLabAudio.js';
import { ConstellationDivider, OrbitalLoader, PortalButton, PrimitiveGallery, RootProgress } from './ui/Primitives.jsx';
import StarCursor from './ui/StarCursor.jsx';
import './assets-lab.css';
const AssetScene=lazy(()=>import('./AssetScene.jsx'));
const rootPath=labRootPath(window.location.pathname);
const previewBase=`${rootPath}assets/lab/`;

function StillView({system,selected}) {
  const [missing,setMissing]=useState(false);
  const image=system==='ecosystem'?`domain-${DOMAINS[Math.max(0,selected)].id}.webp`:system==='journey'?'network.webp':`${system==='primitives'?'seed':system}.webp`;
  useEffect(()=>setMissing(false),[image]);
  return <div className="still-view">{!missing&&<img src={`${previewBase}${image}`} alt={`${SYSTEMS.find(s=>s.id===system)?.name} rendered preview`} onError={()=>setMissing(true)}/>}<span className="still-caption">{missing?'Still preview unavailable. Use the controls to explore the asset records.':'Still view · all controls remain available'}</span></div>;
}
export default function AssetsLab() {
  const [system,setSystem]=useState('seed'),[selected,setSelected]=useState(-1),[growth,setGrowth]=useState(.77),[progress,setProgress]=useState(.25),[opened,setOpened]=useState(false);
  const [quality,setQuality]=useState('auto'),[autoLite,setAutoLite]=useState(()=>matchMedia('(max-width: 760px), (pointer: coarse)').matches||(navigator.deviceMemory||8)<=4),[reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [playing,setPlaying]=useState(!reduced),[visible,setVisible]=useState(!document.hidden),[failed,setFailed]=useState(false),[stats,setStats]=useState(null),[details,setDetails]=useState(false),[tiltEnabled,setTiltEnabled]=useState(false),[notice,setNotice]=useState('');
  const runtime=useRef({time:0,pointer:{x:0,y:0},energy:0}),tilt=useRef({x:0,y:0}),stage=useRef(),audio=useLabAudio();
  const still=quality==='still'||failed;
  const profile=quality==='auto'?(autoLite?'lite':'full'):quality==='full'?'full':'lite';
  const current=SYSTEMS.find(s=>s.id===system),domain=DOMAINS[selected<0?0:selected],chapter=Math.round(progress*8);
  const choose=useCallback((id)=>{setSystem(id);setNotice('');setStats(null);if(id==='ecosystem')setSelected(i=>i<0?0:i);},[]);
  const pick=index=>{setSelected(index);if(system==='terrain'||system==='primitives')choose('ecosystem');audio.pluck(index);setNotice(`${DOMAINS[index].object} connected`);};
  const activate=()=>{setOpened(v=>!v);setGrowth(1);audio.pluck(0);setNotice(opened?'Seed returned to rest':'Six domains released. Choose one below.');};
  useEffect(()=>{document.title='StarrTree / Interactive Asset Lab';document.body.classList.add('assets-lab-page');return()=>document.body.classList.remove('assets-lab-page');},[]);
  useEffect(()=>{const handle=()=>setVisible(!document.hidden);document.addEventListener('visibilitychange',handle);const mq=matchMedia('(prefers-reduced-motion: reduce)');const change=()=>{setReduced(mq.matches);if(mq.matches)setPlaying(false);};mq.addEventListener('change',change);return()=>{document.removeEventListener('visibilitychange',handle);mq.removeEventListener('change',change);};},[]);
  useEffect(()=>{if(!tiltEnabled)return;let first=null;const handle=e=>{if(e.gamma==null||e.beta==null)return;if(!first)first={x:e.gamma,y:e.beta};tilt.current={x:clamp((e.gamma-first.x)/25,-1,1),y:clamp((e.beta-first.y)/25,-1,1)};};window.addEventListener('deviceorientation',handle);return()=>{window.removeEventListener('deviceorientation',handle);tilt.current={x:0,y:0};};},[tiltEnabled]);
  useEffect(()=>{const el=stage.current;if(!el||system!=='journey')return;const scroll=e=>{e.preventDefault();setProgress(p=>clamp(p+e.deltaY*.0003));};el.addEventListener('wheel',scroll,{passive:false});return()=>el.removeEventListener('wheel',scroll);},[system]);
  const enableTilt=async()=>{if(tiltEnabled){setTiltEnabled(false);return;}try{if(!window.DeviceOrientationEvent){setNotice('Tilt is unavailable here. Pointer and touch controls are ready.');return;}if(typeof DeviceOrientationEvent.requestPermission==='function'){if(await DeviceOrientationEvent.requestPermission()!=='granted'){setNotice('Tilt permission was declined. Touch controls are ready.');return;}}setTiltEnabled(true);setNotice('Tilt enabled. Hold your phone comfortably to set its center.');}catch{setNotice('Tilt is unavailable here. Use touch controls.');}};
  const autoDown=useCallback(()=>{setAutoLite(true);},[]);
  const onFailure=useCallback(()=>{setFailed(true);setNotice('3D is unavailable. The lab has switched to still view.');},[]);
  const togglePlay=()=>{setPlaying(v=>!v);};
  return <main className={`asset-lab ${playing&&!reduced?'is-animated':''}`} data-profile={still?'still':profile} data-system={system}>
    <StarCursor enabled={playing&&!reduced}/><header className="lab-header"><a className="lab-brand" href={rootPath} aria-label="StarrTree home"><span aria-hidden="true">✧</span> STARRTREE</a><span className="lab-edition">INTERACTIVE ASSET LAB <span>/ 001</span></span><div className="lab-header-actions"><button onClick={audio.enable} aria-pressed={audio.enabled} title="Play locally synthesized tones">{audio.enabled?'Sound on':'Sound off'}<span aria-hidden="true">{audio.enabled?' ≋':' ≈'}</span></button><label className="quality-select"><span className="sr-only">Render quality</span><select aria-label="Render quality" value={quality} onChange={e=>{setQuality(e.target.value);setFailed(false);}}><option value="auto">Auto quality</option><option value="full">Full quality</option><option value="lite">Lite / mobile</option><option value="still">Still view</option></select></label></div></header>
    <div className="lab-workspace">
      <aside className="lab-catalog"><div><span className="meta-label">THE COLLECTION</span><h1>A living<br/><em>asset universe.</em></h1></div><nav aria-label="Asset systems">{SYSTEMS.map(s=><button key={s.id} className={`system-link ${s.id===system?'active':''}`} aria-pressed={s.id===system} onClick={()=>choose(s.id)}><span>{s.number}</span><span>{s.name}</span><span className="system-star" aria-hidden="true">✧</span></button>)}</nav><div className="catalog-foot"><ConstellationDivider/><p>Celestial in origin.<br/>Terrestrial by nature.</p><span className="meta-label">MAX STARR / STARRTREE</span></div></aside>
      <section className="lab-stage" ref={stage} aria-label="Interactive asset preview">
        <div className="specimen-heading"><span className="meta-label">SPECIMEN {current.number} / {system==='ecosystem'?domain.name.toUpperCase():'STARRTREE'}</span><h2>{system==='ecosystem'?domain.object:current.name}</h2><p>{current.caption}</p></div>
        <div className="lab-canvas">{still?<StillView system={system} selected={selected}/>:<Suspense fallback={<div className="scene-loading"><OrbitalLoader/><span>Growing your universe</span></div>}><AssetScene runtime={runtime} system={system} profile={profile} playing={playing} visible={visible} growth={growth} progress={progress} selected={selected} opened={opened} tilt={tilt} audio={audio} onSelect={pick} onActivate={activate} onStats={setStats} onAutoLite={quality==='auto'?autoDown:()=>{}} onFailure={onFailure} fallback={<StillView system={system} selected={selected}/>}/></Suspense>}</div>
        {system==='primitives'&&<PrimitiveGallery onPulse={()=>audio.pluck(1)}/>}
        <div className="stage-foot"><span className="stage-hint">{current.hint}</span><div className="stage-buttons"><button onClick={togglePlay} aria-pressed={!playing} aria-label={playing?'Pause motion':'Resume motion'}>{playing?'Ⅱ':'▷'}</button><button onClick={enableTilt} aria-pressed={tiltEnabled}>Tilt {tiltEnabled?'on':'off'}</button></div></div>
      </section>
      <aside className="lab-inspector"><span className="meta-label">BEHAVIOR STUDY</span><h3>{system==='ecosystem'?domain.name:'Light that grows.'}</h3><p>{system==='ecosystem'?domain.concept:system==='terrain'?'A suspended landscape. The same network becomes a tree, its roots disappearing into mineral bedrock.':system==='network'?'Every branch is a path. Selecting a domain carries light from the roots to the work it represents.':system==='journey'?'One continuous transformation, from an almost invisible spark to an interconnected cosmos.':'An inner light held by a translucent shell. A sixfold orbit. Energy moving downward into roots.'}</p>
        <ConstellationDivider/>
        <RootProgress value={growth} onChange={setGrowth}/>
        {system==='seed'&&<PortalButton onClick={activate}>{opened?'Close the seed':'Activate the seed'}</PortalButton>}
        <div className="domain-picker"><span className="meta-label">FOLLOW A BRANCH</span>{DOMAINS.map((d,i)=><button key={d.id} onClick={()=>{pick(i);if(system==='seed')setOpened(true);}} onMouseEnter={()=>{if(system==='network')setSelected(i);}} onFocus={()=>{if(system==='network')setSelected(i);}} className={selected===i?'selected':''} aria-pressed={selected===i}><span className="branch-node" style={{'--node-color':d.color}}/><span>{d.name}</span><span aria-hidden="true">↗</span></button>)}</div>
        <button className="record-toggle" aria-expanded={details} onClick={()=>setDetails(!details)}>Asset record <span>{details?'−':'+'}</span></button>
        {details&&<dl className="asset-record"><dt>Technology</dt><dd>{current.tech}</dd><dt>Symbolism</dt><dd>{system==='ecosystem'?domain.symbolism:'Many forms of creation grow from one living source.'}</dd><dt>Website use</dt><dd>{system==='ecosystem'?domain.use:system==='seed'?'Opening, navigation gateway, transitions.':system==='network'?'Navigation, progress, section transitions.':'Project containers and cinematic transitions.'}</dd><dt>Source</dt><dd><code>{current.source}</code></dd><dt>Mobile</dt><dd>Reduced geometry, capped resolution, still fallback.</dd></dl>}
      </aside>
    </div>
    <footer className="lab-footer"><div className="journey-topline"><span className="meta-label">THE LIFECYCLE</span><span className="journey-instruction">{system==='journey'?`${String(chapter+1).padStart(2,'0')} / ${CHAPTERS[chapter]}`:'Choose a chapter to enter the journey'}</span><button className="reset-button" onClick={()=>{setProgress(0);choose('journey');}}>↺ Restart</button></div><div className="chapter-track" role="group" aria-label="Journey chapters">{CHAPTERS.map((c,i)=><button key={c} onClick={()=>{choose('journey');setProgress(i/8);}} className={system==='journey'&&chapter===i?'current':''} aria-pressed={system==='journey'&&chapter===i}><span className="chapter-point"/><span>{c}</span></button>)}</div><input className="journey-scrubber" aria-label="Journey progress" type="range" min="0" max="1000" value={Math.round(progress*1000)} onChange={e=>{if(system!=='journey')choose('journey');setProgress(Number(e.target.value)/1000);}}/><div className="lab-status"><span role="status">{notice||'Move slowly. Notice what responds.'}</span><span className="performance-readout" aria-label="Live rendering statistics" data-testid="render-stats">{still?'STILL VIEW':`${profile.toUpperCase()} · ${stats?`${playing?`${stats.fps} FPS`:'PAUSED'} · ${stats.calls} DRAWS · ${(stats.triangles/1000).toFixed(1)}K TRIANGLES`:'WARMING UP'}`}</span></div></footer>
  </main>;
}
