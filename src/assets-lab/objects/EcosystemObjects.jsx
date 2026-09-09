import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, Object3D } from 'three';
import { DOMAINS, GOLD, TAU } from '../engine/config.js';
import InstancedPieces from './InstancedPieces.jsx';
import { mergedTubes } from '../engine/geometry.js';

const Metal=({color=GOLD,...props})=><meshStandardMaterial color={color} metalness={.75} roughness={.28} {...props}/>;
function ResonanceBloom({runtime,active}) {
  const rings=useRef();
  useFrame(()=>{if(!rings.current)return;rings.current.children.forEach((r,i)=>{r.rotation.x=.4+i*.65+Math.sin(runtime.current.time*.5+i)*.12;r.rotation.y=runtime.current.time*(i%2?-.18:.16);r.scale.setScalar(1+runtime.current.energy*.22+(active?Math.sin(runtime.current.time*1.8+i)*.035:0));});});
  return <group><mesh scale={[.19,.7,.19]}><octahedronGeometry/><Metal color="#fee3a7" emissive="#ae7b2e" emissiveIntensity={.3}/></mesh><group ref={rings}>{[0,1,2,3].map(i=><group key={i}><mesh><torusGeometry args={[.44+i*.15,.02,5,64]}/><Metal/></mesh><InstancedPieces items={Array.from({length:8},(_,j)=>({position:[Math.cos(j/8*TAU)*(.44+i*.15),Math.sin(j/8*TAU)*(.44+i*.15),0],rotation:[0,0,j/8*TAU],scale:[.065,.12,.035],color:i%2?'#668775':GOLD}))}/></group>)}</group></group>;
}
function NeuralGeode({runtime,active}) {
  const crystals=useRef();
  useFrame(()=>{crystals.current.rotation.y=runtime.current.time*.12;crystals.current.position.y=Math.sin(runtime.current.time)*.035+(active?.07:0);});
  return <group><mesh><icosahedronGeometry args={[.46,0]}/><meshStandardMaterial color="#88cab6" metalness={.45} roughness={.16} transparent opacity={.52} wireframe/></mesh><group ref={crystals}><InstancedPieces items={Array.from({length:7},(_,i)=>{const a=i/7*TAU;return {position:[-Math.sin(a)*.34,Math.cos(a)*.34,0],rotation:[.4,0,a],scale:[.14,.5+i%2*.2,.14],color:i%2?'#83bda8':'#dce7c3'};})}/></group><mesh><icosahedronGeometry args={[.19,1]}/><meshBasicMaterial color="#d8ffea"/></mesh></group>;
}
function LightLoom({runtime}) {
  const ref=useRef();useFrame(()=>{ref.current.children.forEach((m,i)=>{m.rotation.z=i*.24+runtime.current.time*(i%2?.12:-.1)+runtime.current.pointer.x*.1;});});
  return <group ref={ref}>{Array.from({length:5},(_,i)=><group key={i} position={[0,0,(i-2)*.14]}><mesh rotation={[0,0,Math.PI/4]}><torusGeometry args={[.8-i*.12,.035,4,4]}/><Metal color={i%2?'#d0aca0':GOLD}/></mesh><mesh scale={[.015,.72-i*.1,.015]} rotation={[0,0,i*.6]}><cylinderGeometry args={[1,1,1,4]}/><meshBasicMaterial color="#d9e6c5"/></mesh></group>)}</group>;
}
function TectonicEngine({runtime,active}) {
  const ref=useRef();useFrame((_,delta)=>{ref.current.children.forEach((m,i)=>{m.position.y+=(i*.26+(active?i*.18:0)-m.position.y)*Math.min(1,delta*4);m.rotation.y=runtime.current.time*(i%2?-.11:.09);});});
  return <group position={[0,-.55,0]}><mesh position={[0,-.17,0]} scale={[.7,.38,.65]}><icosahedronGeometry args={[1,0]}/><Metal color="#344f49"/></mesh><group ref={ref}>{[0,1,2].map(i=><group key={i} position={[0,i*.26,0]}><mesh rotation={[Math.PI/2,0,0]}><torusGeometry args={[.65-i*.12,.045,4,6]}/><Metal color="#bdc7c0"/></mesh><InstancedPieces geometry="box" items={Array.from({length:6},(_,j)=>({position:[Math.cos(j/6*TAU)*(.58-i*.12),.18,Math.sin(j/6*TAU)*(.58-i*.12)],scale:[.07,.32,.07]}))}/></group>)}</group><mesh position={[0,.55,0]} scale={[.09,.8,.09]}><octahedronGeometry/><meshBasicMaterial color="#dfc68f"/></mesh></group>;
}
function DiscoveryHelix({runtime,active}) {
  const ref=useRef();const geometry=useMemo(()=>mergedTubes([0,Math.PI].map(phase=>({radius:.023,points:Array.from({length:45},(_,j)=>{const t=j/44;return [Math.cos(t*TAU*1.3+phase)*.44,t*1.6-.8,Math.sin(t*TAU*1.3+phase)*.44];})})),64,5),[]);useEffect(()=>()=>geometry.dispose(),[geometry]);
  useFrame(()=>{ref.current.rotation.y=runtime.current.time*(active?.38:.13);});
  return <group ref={ref}><mesh geometry={geometry}><Metal/></mesh><InstancedPieces color="#9cb98b" items={Array.from({length:14},(_,i)=>{const t=i/13;return {position:[Math.cos(t*TAU*1.3)*.44,t*1.6-.8,Math.sin(t*TAU*1.3)*.44],rotation:[0,0,t*TAU],scale:[.12,.18,.07]};})}/><mesh position={[0,.93,0]}><icosahedronGeometry args={[.15,0]}/><meshBasicMaterial color="#eff0c4"/></mesh></group>;
}
function MyceliumCommons({runtime,active}) {
  const ref=useRef();useFrame(()=>{ref.current.rotation.y=runtime.current.time*.12;ref.current.children.forEach((m,i)=>{const r=active?.48:.68,a=i/7*TAU;m.position.set(Math.cos(a)*r,Math.sin(a)*r,Math.sin(runtime.current.time+i)*.15);});});
  const geo=useMemo(()=>mergedTubes(Array.from({length:7},(_,i)=>({radius:.015,points:[[Math.cos(i/7*TAU)*.64,Math.sin(i/7*TAU)*.64,0],[0,.05,.16],[Math.cos((i+3)/7*TAU)*.64,Math.sin((i+3)/7*TAU)*.64,0]]})),20,4),[]);useEffect(()=>()=>geo.dispose(),[geo]);
  return <group><mesh geometry={geo}><Metal color="#9d879c"/></mesh><group ref={ref}>{Array.from({length:7},(_,i)=><mesh key={i} scale={[.16,.23,.16]}><dodecahedronGeometry args={[1,0]}/><Metal color={i%2?'#a397ac':'#edd9ae'} emissive="#573952" emissiveIntensity={active?.6:.1}/></mesh>)}</group><mesh><sphereGeometry args={[.1,12,8]}/><meshBasicMaterial color="#f7d3dd"/></mesh></group>;
}
const OBJECTS=[ResonanceBloom,NeuralGeode,LightLoom,TectonicEngine,DiscoveryHelix,MyceliumCommons];
export default function EcosystemObject({index=0,runtime,active=false,onSelect,scale=1,position=[0,0,0]}) {
  const ref=useRef(),ObjectComponent=OBJECTS[index];
  useFrame(()=>{ref.current.position.y=position[1]+Math.sin(runtime.current.time*.6+index)*.045;});
  return <group ref={ref} position={position} scale={scale} onClick={e=>{e.stopPropagation();onSelect?.(index);}}><ObjectComponent runtime={runtime} active={active}/></group>;
}
