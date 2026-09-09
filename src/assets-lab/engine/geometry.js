import { BufferAttribute, BufferGeometry, CatmullRomCurve3, Color, IcosahedronGeometry, SphereGeometry, TubeGeometry, Vector3 } from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { DOMAIN_POSITIONS, random, TAU } from './config.js';

export function seedGeometry(segments = 40) {
  const geometry = new SphereGeometry(1, segments, Math.floor(segments * .7));
  const p = geometry.attributes.position;
  for (let i=0; i<p.count; i++) {
    const y = p.getY(i), a = Math.atan2(p.getZ(i), p.getX(i));
    const pinch = (0.76 - y * .16) * (1 + Math.cos(a * 6) * .06);
    p.setXYZ(i, p.getX(i)*pinch, y*1.23, p.getZ(i)*pinch);
  }
  geometry.computeVertexNormals(); return geometry;
}
export function curve(points) { return new CatmullRomCurve3(points.map(p => new Vector3(...p))); }
export function mergedTubes(paths, segments = 40, radial = 5) {
  const parts = paths.map(({points,radius=.02,branch=0,start=0,end=1}) => {
    const geo = new TubeGeometry(curve(points), segments, radius, radial, false);
    const uv=geo.attributes.uv, n=uv.count, ids = new Float32Array(n), growth=new Float32Array(n);
    for(let i=0;i<n;i++){ ids[i]=branch; growth[i]=start + uv.getX(i)*(end-start); }
    geo.setAttribute('aBranch',new BufferAttribute(ids,1));
    geo.setAttribute('aGrowth',new BufferAttribute(growth,1)); return geo;
  });
  const result=mergeGeometries(parts); parts.forEach(g=>g.dispose()); return result;
}
export function rootPaths(seed=47) {
  const rnd=random(seed), paths=[];
  for(let i=0;i<12;i++) {
    const angle=i/12*TAU, r=1.4+rnd()*1.5;
    const x=Math.cos(angle)*r, z=Math.sin(angle)*r*.6;
    const points=[[Math.cos(angle)*.12,-.7,Math.sin(angle)*.12],[x*.22,-1.35,z*.2],[x*.58,-2.05,z*.6],[x,-2.4-rnd()*.5,z],[x*1.1,-3.25-rnd()*.55,z*1.3]];
    paths.push({points,radius:.025+rnd()*.025,branch:i%6,start:0,end:.8});
    for(let j=0;j<2;j++) {
      const from=points[2+j], sign=j?1:-1;
      paths.push({points:[from,[from[0]+sign*.25,from[1]-.2,from[2]+.18],[from[0]+sign*.6,from[1]-.45,from[2]+.3],[from[0]+sign*.9,from[1]-.7,from[2]+.1]],radius:.009,branch:i%6,start:.4+j*.1,end:1});
    }
  } return paths;
}
export function branchPaths() {
  return DOMAIN_POSITIONS.flatMap((p,i) => {
    const s=p[0]>0?1:-1;
    const stem=[[0,-1.2,0],[s*.16,.05,0],[p[0]*.28,p[1]*.6+.5,-.1],[p[0]*.64,p[1]+.06,p[2]-.15],p];
    return [{points:stem,radius:.038,branch:i,start:0,end:.8},
      {points:[stem[2],[p[0]*.5,p[1]*.8+.55,.15],[p[0]*.78,p[1]+.7,.2],[p[0]*.85,p[1]+.82,.1]],radius:.013,branch:i,start:.42,end:1},
      {points:[stem[3],[p[0]*.75,p[1]-.3,.15],[p[0]*.93,p[1]-.38,.3]],radius:.012,branch:i,start:.6,end:1}];
  });
}
export function terrainGeometry(detail=1) {
  const geo=new IcosahedronGeometry(1,detail), p=geo.attributes.position, colors=new Float32Array(p.count*3), rnd=random(52);
  const top=new Color('#284c3e'), rock=new Color('#182d2b');
  for(let i=0;i<p.count;i++) {
    const x=p.getX(i),y=p.getY(i),z=p.getZ(i);
    const variation=1+.085*Math.sin(x*16+z*17);
    p.setXYZ(i,x*1.9*variation,y>0 ? y*.28 : y*1.65,z*1.32*variation);
    const c=(y>.16?top:rock).clone().multiplyScalar(.8+rnd()*.45);c.toArray(colors,i*3);
  }
  geo.setAttribute('color',new BufferAttribute(colors,3)); geo.computeVertexNormals();return geo;
}
export function particleGeometry(count,seed=90) {
  const rnd=random(seed), positions=new Float32Array(count*3), sizes=new Float32Array(count);
  for(let i=0;i<count;i++) { positions.set([(rnd()-.5)*24,(rnd()-.5)*16,(rnd()-.5)*16-3],i*3); sizes[i]=.5+rnd()*2; }
  const geo=new BufferGeometry();geo.setAttribute('position',new BufferAttribute(positions,3));geo.setAttribute('aSize',new BufferAttribute(sizes,1));return geo;
}

export function leafGeometry() {
  const positions=[],uv=[],indices=[];
  for(let i=0;i<=10;i++){const t=i/10,w=Math.sin(t*Math.PI)*.55;for(let j=0;j<3;j++){const side=j-1;positions.push(side*w,t*2,Math.sin(t*Math.PI)*.25-Math.abs(side)*.1);uv.push(j/2,t);}}
  for(let i=0;i<10;i++)for(let j=0;j<2;j++){const a=i*3+j;indices.push(a,a+1,a+3,a+1,a+4,a+3);}
  const geo=new BufferGeometry();geo.setAttribute('position',new BufferAttribute(new Float32Array(positions),3));geo.setAttribute('uv',new BufferAttribute(new Float32Array(uv),2));geo.setIndex(indices);geo.computeVertexNormals();return geo;
}
