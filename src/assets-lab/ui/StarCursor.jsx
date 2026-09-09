import { useEffect, useRef } from 'react';
// An additive focus marker. The native cursor remains available for precision.
export default function StarCursor({enabled=true}) {
  const ref=useRef();
  useEffect(()=>{if(!enabled||!matchMedia('(pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;let frame=0,x=0,y=0;
    const move=e=>{x=e.clientX;y=e.clientY;if(frame)return;frame=requestAnimationFrame(()=>{frame=0;if(ref.current){ref.current.style.transform=`translate3d(${x-15}px,${y-15}px,0)`;ref.current.style.opacity='.65';}});};
    const leave=()=>{if(ref.current)ref.current.style.opacity='0';};window.addEventListener('pointermove',move,{passive:true});document.addEventListener('pointerleave',leave);return()=>{cancelAnimationFrame(frame);window.removeEventListener('pointermove',move);document.removeEventListener('pointerleave',leave);};
  },[enabled]);
  return enabled?<span ref={ref} className="star-cursor" aria-hidden="true">✧</span>:null;
}
