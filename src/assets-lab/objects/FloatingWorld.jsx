import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { DoubleSide } from 'three';
import { terrainGeometry } from '../engine/geometry.js';
import { uvVertex, waterFragment } from '../engine/shaders.js';
import LivingNetwork from './LivingNetwork.jsx';
import { GOLD } from '../engine/config.js';

export default function FloatingWorld({runtime,profile,growth=1,tree=true,scale=1}) {
  const ref=useRef(),material=useRef(), water=useMemo(()=>({uTime:{value:0}}),[]);
  const geo=useMemo(()=>terrainGeometry(profile==='lite'?1:2),[profile]);
  useEffect(()=>()=>geo.dispose(),[geo]);
  useFrame(()=>{if(material.current)material.current.uniforms.uTime.value=runtime.current.time;ref.current.rotation.y=Math.sin(runtime.current.time*.12)*.06;});
  return <group ref={ref} scale={scale}>
    <mesh geometry={geo}><meshStandardMaterial vertexColors roughness={.87} metalness={.2} flatShading/></mesh>
    <mesh position={[-.3,.23,.04]} rotation={[-Math.PI/2,0,-.3]} scale={[1.1,.62,1]}><circleGeometry args={[.65,40]}/><meshStandardMaterial color="#477c6a" metalness={.8} roughness={.18}/></mesh>
    <group position={[-.68,-1.04,.84]} rotation={[0,-.2,0]}><mesh><planeGeometry args={[.3,2.55,8,20]}/><shaderMaterial ref={material} uniforms={water} vertexShader={uvVertex} fragmentShader={waterFragment} side={DoubleSide} transparent depthWrite={false}/></mesh></group>
    {[[.9,.3,.1,.38],[-1.12,.25,.03,.2],[.57,.26,.7,.16]].map(([x,y,z,s],i)=><mesh key={i} position={[x,y+s/2,z]} rotation={[.1,0,-.18+i*.2]} scale={[s*.45,s,s*.45]}><octahedronGeometry/><meshStandardMaterial color={i===0?'#a9cbb5':GOLD} metalness={.55} roughness={.19}/></mesh>)}
    {tree&&<group position={[.13,.85,-.12]} scale={.4}><LivingNetwork runtime={runtime} profile={profile} growth={growth}/></group>}
    <group position={[.83,.22,-.4]}><mesh position={[0,.27,0]}><boxGeometry args={[.06,.55,.06]}/><meshStandardMaterial color={GOLD}/></mesh><mesh position={[.34,.27,0]}><boxGeometry args={[.06,.55,.06]}/><meshStandardMaterial color={GOLD}/></mesh><mesh position={[.17,.54,0]}><boxGeometry args={[.4,.05,.06]}/><meshStandardMaterial color={GOLD}/></mesh></group>
  </group>;
}
