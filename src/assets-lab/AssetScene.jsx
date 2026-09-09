import { Component, Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdditiveBlending, Color, Vector3 } from 'three';
import { DOMAINS, DOMAIN_POSITIONS, PROFILES, smooth } from './engine/config.js';
import { particleGeometry } from './engine/geometry.js';
import { dustFragment, dustVertex, uvVertex } from './engine/shaders.js';
import StarrSeed, { CoreGlow } from './objects/StarrSeed.jsx';
import LivingNetwork, { LivingRoots } from './objects/LivingNetwork.jsx';
import EcosystemObject from './objects/EcosystemObjects.jsx';
import FloatingWorld from './objects/FloatingWorld.jsx';
import EnergyRelease, { EmergingDomain } from './objects/EnergyRelease.jsx';

class CanvasBoundary extends Component {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  componentDidCatch(error){console.warn('[Assets Lab] Switching to still view:',error.message);this.props.onFailure();}
  render(){return this.state.failed?null:this.props.children;}
}
function Environment({runtime,profile}) {
  const ref=useRef(),fg=useRef(),material=useRef();
  const geometry=useMemo(()=>particleGeometry(PROFILES[profile].particles),[profile]);
  const uniforms=useMemo(()=>({uTime:{value:0},uDpr:{value:PROFILES[profile].dpr}}),[profile]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  useFrame(()=>{if(material.current)material.current.uniforms.uTime.value=runtime.current.time;ref.current.rotation.y=runtime.current.pointer.x*.018;ref.current.rotation.x=runtime.current.pointer.y*.012;fg.current.position.x=runtime.current.pointer.x*-.2;fg.current.position.y=runtime.current.pointer.y*-.13;});
  return <>
    <group ref={ref}><points geometry={geometry}><shaderMaterial ref={material} uniforms={uniforms} vertexShader={dustVertex} fragmentShader={dustFragment} transparent depthWrite={false} blending={AdditiveBlending}/></points></group>
    <mesh position={[0,0,-14]}><planeGeometry args={[48,32]}/><shaderMaterial vertexShader={uvVertex} fragmentShader={`varying vec2 vUv;void main(){vec2 p=vUv-.5;float a=exp(-length(p*vec2(3.,2.))*5.);float w=sin(p.x*10.+p.y*9.)*.5+.5;gl_FragColor=vec4(vec3(.023,.072,.058)*a*w+vec3(.014,.021,.019),1.);}`}/></mesh>
    <group ref={fg} position={[0,0,3]}><mesh position={[-5,-3,-.4]} rotation={[0,.8,.4]} scale={[.14,1.7,.14]}><octahedronGeometry/><meshBasicMaterial color="#101e16"/></mesh><mesh position={[4.8,2.9,-.8]} rotation={[0,.6,-.9]} scale={[.15,1.5,.15]}><octahedronGeometry/><meshBasicMaterial color="#10221c"/></mesh></group>
    <group position={[0,-3.65,0]} rotation={[-Math.PI/2,0,0]}>
      {[2.4,3.3].map(r=><mesh key={r}><ringGeometry args={[r,r+.006,100]}/><meshBasicMaterial color="#86744e" transparent opacity={.27}/></mesh>)}
    </group>
  </>;
}
function SceneRuntime({runtime,playing,progress,system,profile,tilt,audio,onStats,onAutoLite}) {
  const {gl,camera,invalidate,size}=useThree();
  const stats=useRef({frames:0,seconds:0,slow:0,life:0}), target=useMemo(()=>new Vector3(),[]);
  useFrame((state,delta)=>{
    runtime.current.motion=playing;
    if(playing)runtime.current.time+=Math.min(delta,.06);
    runtime.current.pointer.x=state.pointer.x*.6+(tilt.current.x||0)*.4;
    runtime.current.pointer.y=state.pointer.y*.6+(tilt.current.y||0)*.4;
    runtime.current.energy=audio.sample();
    const r=runtime.current,wide=size.width/size.height;
    let distance=system==='network'||system==='journey'?12.2:system==='terrain'?9.3:8.8;
    if(system==='journey')distance+=smooth(.8,1,progress)*6;
    if(wide<.85)distance*=1.12;
    target.set(r.pointer.x*.25,.35+r.pointer.y*.2,distance);
    camera.position.lerp(target,Math.min(1,delta*2));camera.lookAt(0,system==='network'||system==='journey'?-.3:-.45,0);
    const s=stats.current;s.frames++;s.seconds+=delta;s.life+=delta;
    if(s.seconds>=1){const fps=Math.round(s.frames/s.seconds);onStats({fps,calls:gl.info.render.calls,triangles:gl.info.render.triangles,geometries:gl.info.memory.geometries,textures:gl.info.memory.textures,dpr:gl.getPixelRatio()});
      if(profile==='full'&&playing&&s.life>5){s.slow=fps<28?s.slow+1:0;if(s.slow>=5){onAutoLite();s.slow=0;}}
      s.frames=0;s.seconds=0;
    }
  });
  useEffect(()=>{invalidate();},[playing,progress,system,profile,invalidate]);
  return null;
}
export function Specimens({system,runtime,profile,growth,progress,selected,opened,onSelect,onActivate}) {
  const journey=system==='journey';
  const g=journey?smooth(.25,.62,progress):growth;
  const reveal=journey?smooth(0,.21,progress):1;
  const seedScale=journey?(1-smooth(.48,.7,progress)*.65)*Math.max(.001,reveal):system==='network'?.44:1;
  const worldVisible=system==='terrain'||(journey&&progress>.65);
  return <>
    {(system==='seed'||system==='network'||journey)&&<group scale={journey?1:system==='network'?.95:1}>
      <StarrSeed runtime={runtime} profile={profile} scale={seedScale} onActivate={onActivate} opened={opened}/>
      {system==='seed'?<group scale={.78} position={[0,.12,0]}><LivingRoots runtime={runtime} profile={profile} growth={g} selected={selected}/></group>:<LivingNetwork runtime={runtime} profile={profile} growth={g} selected={selected}/>}
      {(system==='network'||(journey&&progress>.56))&&DOMAINS.map((d,i)=><EcosystemObject key={d.id} index={i} runtime={runtime} active={selected===i} onSelect={onSelect} position={DOMAIN_POSITIONS[i]} scale={.37}/>)}
      {system==='seed'&&opened&&<><EnergyRelease runtime={runtime} profile={profile}/>{DOMAINS.map((d,i)=><EmergingDomain key={d.id} runtime={runtime} index={i} active={selected===i} onSelect={onSelect}/>)}</>}
    </group>}
    {system==='ecosystem'&&<group position={[0,.05,0]} scale={1.7}><EcosystemObject index={selected<0?0:selected} runtime={runtime} active onSelect={onSelect}/><CoreGlow scale={2.4} color={[.38,.45,.26]}/></group>}
    {worldVisible&&<group position={[0,journey?-2.1:-.5,0]} scale={journey?1.4:1.35}><FloatingWorld runtime={runtime} profile={profile} growth={g} tree={!journey}/></group>}
    {system==='primitives'&&<group position={[0,-.2,-1]} scale={.55}><StarrSeed runtime={runtime} profile={profile} onActivate={onActivate}/></group>}
  </>;
}
export default function AssetScene({fallback,...props}) {
  const {profile,playing,visible,onFailure}=props;
  return <CanvasBoundary onFailure={onFailure}>
    <Canvas key={profile} camera={{position:[0,.35,props.system==='network'?12.2:8.8],fov:46,near:.1,far:65}} dpr={PROFILES[profile].dpr} frameloop={playing&&visible?'always':'demand'} gl={{antialias:profile==='full',alpha:false,powerPreference:profile==='lite'?'low-power':'high-performance'}} fallback={fallback} onCreated={({gl})=>{gl.setClearColor(new Color('#080f0d'));const loss=()=>onFailure();gl.domElement.addEventListener('webglcontextlost',loss,{once:true});}}>
      <ambientLight intensity={.7}/><hemisphereLight args={['#efe7c8','#183f2c',1.5]}/>
      <directionalLight position={[2,4,5]} color="#ffe0a4" intensity={3.5}/><directionalLight position={[-5,2,1]} color="#81bda9" intensity={2.2}/><pointLight position={[0,.5,2]} color="#ffd190" intensity={8} distance={9}/>
      <Suspense fallback={null}><Environment runtime={props.runtime} profile={profile}/><Specimens {...props}/></Suspense>
      <SceneRuntime {...props}/>
    </Canvas>
  </CanvasBoundary>;
}
