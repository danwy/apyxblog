import React, { useState } from 'react';
import { listDocs } from '../utils/storage';

export default function SearchBar({ onResult }){
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);

  const search = () => {
    const docs = listDocs();
    const key = q.trim().toLowerCase();
    if(!key) { setResults([]); return; }
    const res = docs.filter(d => (d.title || '').toLowerCase().includes(key) || (d.textIndex || '').toLowerCase().includes(key));
    setResults(res);
  };

  return (
    <div>
      <div style={{display:'flex',gap:8}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search titles and text..." style={{flex:1,padding:8,borderRadius:8}} />
        <button className="small-btn" onClick={search}>Search</button>
      </div>
      <div>
        {results.map(r=>(
          <div key={r.id} style={{padding:8,borderBottom:'1px solid #eee',cursor:'pointer'}} onClick={()=>onResult && onResult(r.id)}>
            <strong>{r.title}</strong> <div style={{fontSize:12,color:'#666'}}>{r.category}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
