import React from 'react';
import { getAbout, saveAbout } from '../utils/storage';

export default function About(){
  const val = getAbout();
  const [text, setText] = React.useState(val);

  return (
    <div style={{background:'#fff',padding:12,borderRadius:8}}>
      <h3>About</h3>
      <textarea style={{width:'100%',padding:8,height:280}} value={text} onChange={e=>setText(e.target.value)} />
      <div style={{marginTop:8}}>
        <button className="btn" onClick={()=>{ saveAbout(text); alert('Saved locally'); }}>Save</button>
      </div>
    </div>
  );
}
