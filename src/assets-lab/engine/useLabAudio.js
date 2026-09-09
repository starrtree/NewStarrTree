import { useEffect, useRef, useState } from 'react';
export function useLabAudio() {
  const context=useRef(null), analyser=useRef(null), data=useRef(null), [enabled,setEnabled]=useState(false);
  const energy=useRef(0);
  const enable=async()=>{
    if(enabled){setEnabled(false);await context.current?.suspend();return;}
    const Audio=window.AudioContext||window.webkitAudioContext;
    if(!Audio)return;
    try {if(!context.current){context.current=new Audio();analyser.current=context.current.createAnalyser();analyser.current.fftSize=64;analyser.current.connect(context.current.destination);data.current=new Uint8Array(analyser.current.frequencyBinCount);}await context.current.resume();setEnabled(true);} catch {setEnabled(false);}
  };
  const pluck=(index=0)=>{
    if(!enabled||!context.current)return;
    const ctx=context.current, notes=[130.81,164.81,196,261.63,329.63,392];
    [1,1.5,2].forEach((ratio,i)=>{const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='sine';osc.frequency.value=notes[index%6]*ratio;gain.gain.setValueAtTime(.0001,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.065/(i+1),ctx.currentTime+.025);gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+1.8);osc.connect(gain);gain.connect(analyser.current);osc.start();osc.stop(ctx.currentTime+1.85);osc.onended=()=>{osc.disconnect();gain.disconnect();};});
  };
  const sample=()=>{if(!enabled||!analyser.current)return energy.current=0;analyser.current.getByteFrequencyData(data.current);let sum=0;for(let i=0;i<data.current.length;i++)sum+=data.current[i];return energy.current=sum/(data.current.length*100);};
  useEffect(()=>()=>{context.current?.close();},[]);
  return {enabled,enable,pluck,sample,energy};
}
