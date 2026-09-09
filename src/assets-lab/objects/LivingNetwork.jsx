import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, DoubleSide, Object3D } from 'three';
import { branchPaths, curve, leafGeometry, mergedTubes, rootPaths } from '../engine/geometry.js';
import { rootFragment, rootVertex } from '../engine/shaders.js';
import { DOMAIN_POSITIONS, GOLD, PROFILES, random } from '../engine/config.js';

export function LivingRoots({runtime,profile,growth=1,selected=-1,branches=false}) {
  const p=PROFILES[profile], material=useRef();
  const geo=useMemo(()=>mergedTubes(branches?branchPaths():rootPaths(),p.tubeSegments,p.radialSegments),[branches,p]);
  const uniforms=useMemo(()=>({uTime:{value:0},uGrowth:{value:growth},uSelected:{value:selected},uEnergy:{value:0},uColor:{value:new Color(GOLD)}}),[]);
  useEffect(()=>()=>geo.dispose(),[geo]);
  useFrame(()=>{const u=material.current?.uniforms;if(!u)return;u.uTime.value=runtime.current.time;u.uGrowth.value=growth;u.uSelected.value=selected;u.uEnergy.value=runtime.current.energy;});
  return <mesh geometry={geo}><shaderMaterial ref={material} vertexShader={rootVertex} fragmentShader={rootFragment} uniforms={uniforms}/></mesh>;
}
export function CanopyLeaves({runtime,profile,growth=1}) {
  const ref=useRef(), count=PROFILES[profile].leaves;
  const geometry=useMemo(leafGeometry,[]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  const items=useMemo(()=>{const rnd=random(24),paths=branchPaths();return Array.from({length:count},(_,i)=>{const branch=i%6,path=curve(paths[branch*3+(i%3)].points),t=.25+rnd()*.72,pos=path.getPoint(t),sign=branch<3?1:-1;return {p:pos.toArray(),r:[(rnd()-.5)*.7,rnd()*1.3,sign*(.55+rnd()*.7)],s:.09+rnd()*.13,phase:rnd()*6};});},[count]);
  const dummy=useMemo(()=>new Object3D(),[]);
  useFrame(()=>{if(!ref.current)return;items.forEach((item,i)=>{dummy.position.set(...item.p);dummy.rotation.set(item.r[0]+Math.sin(runtime.current.time*.7+item.phase)*.07,item.r[1],item.r[2]);dummy.scale.set(item.s*Math.max(.001,growth),item.s*1.5*Math.max(.001,growth),item.s);dummy.updateMatrix();ref.current.setMatrixAt(i,dummy.matrix);});ref.current.instanceMatrix.needsUpdate=true;});
  return <instancedMesh ref={ref} args={[null,null,count]} frustumCulled={false}><primitive object={geometry} attach="geometry"/><meshStandardMaterial color="#47755b" side={DoubleSide} metalness={.35} roughness={.48}/></instancedMesh>;
}
export default function LivingNetwork({runtime,profile,growth=1,selected=-1,canopy=true}) {
  return <group><LivingRoots runtime={runtime} profile={profile} growth={growth} selected={selected}/><LivingRoots runtime={runtime} profile={profile} growth={growth} selected={selected} branches/>{canopy&&<CanopyLeaves runtime={runtime} profile={profile} growth={Math.max(0,(growth-.3)/.7)}/>}</group>;
}
