import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, DoubleSide, Vector2 } from 'three';
import { mergedTubes, seedGeometry } from '../engine/geometry.js';
import { shellFragment, shellVertex, uvVertex } from '../engine/shaders.js';
import { GOLD, TAU } from '../engine/config.js';

export function CoreGlow({scale=3,color=[1,.66,.24]}) {
  return <mesh scale={scale} renderOrder={3}><planeGeometry args={[1,1]}/><shaderMaterial transparent depthWrite={false} depthTest={false} blending={AdditiveBlending} vertexShader={uvVertex} fragmentShader={`varying vec2 vUv; void main(){float d=length(vUv-.5)*2.;float a=pow(max(0.,1.-d),4.);gl_FragColor=vec4(${color.map(n=>`${n.toFixed(2)}`).join(',')},a*.55);}`}/></mesh>;
}
export default function StarrSeed({runtime,profile,onActivate,opened=false,scale=1}) {
  const group=useRef(),shell=useRef(),core=useRef(),orbits=useRef(), material=useRef();
  const geometry=useMemo(()=>seedGeometry(profile==='lite'?24:44),[profile]);
  const ribs=useMemo(()=>mergedTubes(Array.from({length:6},(_,i)=>({radius:.012,points:Array.from({length:25},(_,j)=>{const t=j/24,a=i/6*TAU+t*.3,r=Math.sin(t*Math.PI)*(.76-Math.cos(t*Math.PI)*.16);return [Math.cos(a)*r,Math.cos(t*Math.PI)*1.23,Math.sin(a)*r];})})),30,4),[]);
  const uniforms=useMemo(()=>({uTime:{value:0},uEnergy:{value:0},uPointer:{value:new Vector2()}}),[]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);useEffect(()=>()=>ribs.dispose(),[ribs]);
  useFrame((state,delta)=>{
    const {time,pointer,energy}=runtime.current;
    if(material.current){const u=material.current.uniforms;u.uTime.value=time;u.uEnergy.value=energy;u.uPointer.value.set(pointer.x,pointer.y);}
    if(group.current){group.current.rotation.y=Math.sin(time*.2)*.16+pointer.x*.12;group.current.position.y=Math.sin(time*.75)*.055;}
    if(orbits.current){orbits.current.rotation.y=time*.1+pointer.x*.23;orbits.current.rotation.x=pointer.y*.15;}
    if(core.current){core.current.rotation.y=time*.25;core.current.rotation.z=time*.1;core.current.scale.setScalar(.29+Math.sin(time*1.2)*.012+energy*.05);}
    if(shell.current){const target=opened?1.2:1;shell.current.scale.lerp({x:target,y:target,z:target},Math.min(1,delta*4));}
  });
  return <group scale={scale}>
    <group ref={group} onClick={e=>{e.stopPropagation();onActivate?.();}}>
      <group ref={shell}>
        <mesh geometry={geometry}><shaderMaterial ref={material} uniforms={uniforms} vertexShader={shellVertex} fragmentShader={shellFragment} transparent depthWrite={false} side={DoubleSide}/></mesh>
        <mesh geometry={ribs}><meshStandardMaterial color={GOLD} metalness={.82} roughness={.25}/></mesh>
      </group>
      <mesh ref={core} scale={.29}><icosahedronGeometry args={[1,0]}/><meshStandardMaterial color="#fff0c7" emissive="#ffc057" emissiveIntensity={2.2} roughness={.2} metalness={.5}/></mesh>
      <mesh rotation={[0,0,Math.PI/4]} scale={[.19,.66,.19]}><octahedronGeometry args={[1,0]}/><meshBasicMaterial color="#ffdc92" transparent opacity={.65}/></mesh>
      <CoreGlow scale={2.8}/>
      <group ref={orbits}>
        {[0,1,2].map(i=><group key={i} rotation={[Math.PI/2+.3*i,.38+i*.9,.25*i]}>
          <mesh scale={[1,1+(i===1?.13:0),1]}><torusGeometry args={[1.32+i*.2,.009,4,profile==='lite'?64:112]}/><meshStandardMaterial color={i===1?'#8fa99a':GOLD} metalness={.75} roughness={.35}/></mesh>
          {[0,1,2].map(j=><mesh key={j} position={[Math.cos(j/3*TAU+i)*(1.32+i*.2),Math.sin(j/3*TAU+i)*(1.32+i*.2),0]} scale={j===0?.053:.025}><octahedronGeometry/><meshBasicMaterial color={j===0?'#f9df9e':'#94b29e'}/></mesh>)}
        </group>)}
      </group>
    </group>
  </group>;
}
