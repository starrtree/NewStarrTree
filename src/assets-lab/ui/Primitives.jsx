import { useState } from 'react';
export function PortalButton({children,onClick,className='',...props}) {return <button className={`portal-button ${className}`} onClick={onClick} {...props}><span className="portal-spark" aria-hidden="true">✧</span><span>{children}</span><span aria-hidden="true">↗</span></button>;}
export function RootProgress({value,onChange,label='Growth'}) {return <label className="root-progress"><span>{label}<output>{Math.round(value*100)}%</output></span><input aria-label={label} type="range" min="0" max="100" value={Math.round(value*100)} onChange={e=>onChange(Number(e.target.value)/100)} style={{'--growth':`${value*100}%`}}/></label>;}
export function OrbitalLoader(){return <span className="orbital-loader" aria-label="Loading"><i/><i/><b>✦</b></span>;}
export function ConstellationDivider(){return <svg className="constellation-divider" viewBox="0 0 220 22" aria-hidden="true"><path d="M0 12H57L72 5L94 16L113 4L140 12H220"/><circle cx="72" cy="5" r="2"/><circle cx="113" cy="4" r="2"/></svg>;}
export function CelestialTooltip({text,children}){return <span className="celestial-tooltip" tabIndex={0}>{children}<span role="tooltip">{text}</span></span>;}
export function PrimitiveGallery({onPulse}) {
  const [progress,setProgress]=useState(.62),[entered,setEntered]=useState(false);
  return <div className="primitive-gallery">
    <div className="primitive-sample"><span className="meta-label">01 / A PORTAL</span><PortalButton onClick={()=>{setEntered(!entered);onPulse();}}>{entered?'Return to origin':'Enter the system'}</PortalButton><span className="sample-status" role="status">{entered?'Connection opened':'Touch to connect'}</span></div>
    <div className="primitive-sample"><span className="meta-label">02 / AN ORBIT</span><OrbitalLoader/><span className="sample-status">Waiting with intention</span></div>
    <div className="primitive-sample"><span className="meta-label">03 / A GROWING PATH</span><RootProgress value={progress} onChange={setProgress} label="Root progress"/><ConstellationDivider/></div>
    <div className="primitive-sample constellation-card"><span className="meta-label">04 / A LIVING CARD</span><CelestialTooltip text="Every project connects to a branch."><span className="card-node">✧</span><span>One idea.<br/><em>Many connections.</em></span></CelestialTooltip></div>
  </div>;
}

export function EnergyDivider({active=false}) {return <span className={`energy-divider ${active?'active':''}`} aria-hidden="true"/>;}
