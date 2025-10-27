import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

export default function AudioPlayer({ src }){
  const waveformRef = useRef(null);
  const waveSurferRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(()=>{
    if(!src) return;
    if(waveSurferRef.current) waveSurferRef.current.destroy();
    waveSurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#dfefff',
      progressColor: '#00A5FF',
      cursorColor: '#333',
      height: 64,
    });
    waveSurferRef.current.load(src);
    waveSurferRef.current.on('ready', ()=> {
      setDuration(waveSurferRef.current.getDuration());
    });
    waveSurferRef.current.on('audioprocess', ()=> {
      setCurrentTime(waveSurferRef.current.getCurrentTime());
    });
    waveSurferRef.current.on('finish', ()=>{
      setPlaying(false);
    });
    return ()=> waveSurferRef.current && waveSurferRef.current.destroy();
  }, [src]);

  const toggle = () => {
    if(!waveSurferRef.current) return;
    waveSurferRef.current.playPause();
    setPlaying(!playing);
  };

  return (
    <div style={{background:'#fff',padding:12,borderRadius:8}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <button className="btn" onClick={toggle}>{playing ? 'Pause' : 'Play'}</button>
        <div>{(currentTime || 0).toFixed(1)} / {(duration || 0).toFixed(1)}s</div>
      </div>
      <div ref={waveformRef} style={{marginTop:12}} />
    </div>
  );
}
