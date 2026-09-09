import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, BufferAttribute, BufferGeometry } from 'three';
import { clamp, DOMAIN_POSITIONS, smooth, TAU } from '../engine/config.js';
import EcosystemObject from './EcosystemObjects.jsx';

export function EmergingDomain({runtime,index,onSelect,active,scale=.24}) {
  const ref=useRef(),start=useRef(runtime.current.time);
  useFrame(()=>{const t=runtime.current.motion===false?1:smooth(0,1.5,runtime.current.time-start.current-index*.055);const p=DOMAIN_POSITIONS[index];ref.current.position.set(p[0]*t,p[1]*t,p[2]*t);ref.current.scale.setScalar(Math.max(.001,t));});
  return <group ref={ref}><EcosystemObject runtime={runtime} index={index} active={active} onSelect={onSelect} scale={scale}/></group>;
}
export default function EnergyRelease({runtime,profile}) {
  const ref=useRef(),start=useRef(runtime.current.time),count=profile==='lite'?24:72;
  const geometry=useMemo(()=>{const g=new BufferGeometry();g.setAttribute('position',new BufferAttribute(new Float32Array(count*3),3));return g;},[count]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  useFrame(()=>{const elapsed=runtime.current.time-start.current;ref.current.visible=elapsed<3&&runtime.current.motion!==false;if(!ref.current.visible)return;const p=geometry.attributes.position;for(let i=0;i<count;i++){const t=clamp((elapsed-i/count*.4)/1.8),to=DOMAIN_POSITIONS[i%6],swirl=Math.sin(t*Math.PI)*.4;const a=i/count*TAU+t*7;p.setXYZ(i,to[0]*t+Math.cos(a)*swirl,to[1]*t+Math.sin(a)*swirl,to[2]*t+swirl);}p.needsUpdate=true;ref.current.material.opacity=1-smooth(1.7,3,elapsed);});
  return <points ref={ref} geometry={geometry} frustumCulled={false}><pointsMaterial color="#f5d695" size={.045} transparent blending={AdditiveBlending} depthWrite={false}/></points>;
}
