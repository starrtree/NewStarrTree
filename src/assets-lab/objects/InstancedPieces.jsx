import { useLayoutEffect, useMemo, useRef } from 'react';
import { Color, Object3D } from 'three';
// Repeated botanical and mechanical parts share one geometry and one draw call.
export default function InstancedPieces({items,geometry='octahedron',color='#d8b97e'}) {
  const ref=useRef(),dummy=useMemo(()=>new Object3D(),[]),tint=useMemo(()=>new Color(),[]);
  useLayoutEffect(()=>{items.forEach((item,i)=>{dummy.position.set(...(item.position||[0,0,0]));dummy.rotation.set(...(item.rotation||[0,0,0]));dummy.scale.set(...(item.scale||[1,1,1]));dummy.updateMatrix();ref.current.setMatrixAt(i,dummy.matrix);ref.current.setColorAt(i,tint.set(item.color||color));});ref.current.instanceMatrix.needsUpdate=true;if(ref.current.instanceColor)ref.current.instanceColor.needsUpdate=true;},[items,color,dummy,tint]);
  return <instancedMesh ref={ref} args={[null,null,items.length]} frustumCulled={false}>{geometry==='box'?<boxGeometry/>:<octahedronGeometry/>}<meshStandardMaterial metalness={.65} roughness={.32}/></instancedMesh>;
}
