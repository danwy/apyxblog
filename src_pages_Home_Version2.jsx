import React from 'react';
import { useNavigate } from 'react-router-dom';
import { listDocs } from '../utils/storage';
import SearchBar from '../components/SearchBar';

export default function Home(){
  const navigate = useNavigate();
  const docs = listDocs();
  const random = docs[Math.floor(Math.random() * docs.length)];

  return (
    <div>
      <div className="home-grid">
        <div>
          <div className="random-doc-card">
            <h3>Featured</h3>
            {random ? (
              <div style={{display:'flex',gap:12,alignItems:'center'}}>
                <div style={{width:120,height:160,background:'#fff',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 6px 16px rgba(0,0,0,0.06)'}}>
                  <div style={{fontWeight:800}}>{random.type === 'audio' ? '♫' : '📄'}</div>
                </div>
                <div>
                  <div style={{fontSize:18,fontWeight:800}}>{random.title}</div>
                  <div style={{color:'#666',marginTop:8}}>{random.overview}</div>
                  <div style={{marginTop:12}}>
                    <button className="btn" onClick={()=>navigate(`/document/${random.id}`)}>Open</button>
                  </div>
                </div>
              </div>
            ) : <div>No content yet</div>}
            <div style={{marginTop:16}}>
              <SearchBar onResult={(id)=>navigate(`/document/${id}`)} />
            </div>
          </div>

          <h3 style={{marginTop:22}}>Latest</h3>
          <div className="section-grid">
            {docs.slice().reverse().map(d=>(
              <div key={d.id} className="doc-card" onClick={()=>navigate(`/document/${d.id}`)}>
                <div className="doc-thumb">
                  <div>
                    <div style={{fontWeight:800}}>{d.title}</div>
                    <div style={{fontSize:12,color:'#666',marginTop:8}}>{d.category}</div>
                  </div>
                </div>
                <div style={{marginTop:8,fontWeight:700}}>{d.title}</div>
                <div style={{color:'#666',fontSize:13}}>{d.overview}</div>
              </div>
            ))}
          </div>
        </div>

        <aside>
          <div style={{marginBottom:12,fontWeight:800}}>Categories</div>
          <div className="categories-grid">
            <div className="cat-box" onClick={()=>navigate('/category/Experimental')}>Experimental</div>
            <div className="cat-box" onClick={()=>navigate('/category/Short%20fiction%2FExcerpts')}>Short fiction/Excerpts</div>
            <div className="cat-box" onClick={()=>navigate('/category/Poetry%2FLyrics')}>Poetry/Lyrics</div>
            <div className="cat-box" onClick={()=>navigate('/category/Music')}>Music</div>
          </div>
          <div style={{marginTop:20}}>
            <UploadWidget />
          </div>
        </aside>
      </div>
    </div>
  );
}

// small uploader used on home page to add docs locally
import React, {useState} from 'react';
import { addDocFromUpload } from '../utils/storage';
function UploadWidget(){
  const [title,setTitle] = useState('');
  const [category,setCategory] = useState('Experimental');
  const [type,setType] = useState('pdf');
  const [overview,setOverview] = useState('');
  const [file,setFile] = useState(null);
  const [msg,setMsg] = useState('');

  const submit = async (e)=>{
    e.preventDefault();
    if(!title) return setMsg('Add title');
    const doc = addDocFromUpload({ title, category, type, overview, file, textIndex: overview });
    setMsg('Uploaded');
    setTitle(''); setOverview(''); setFile(null);
  };

  return (
    <form onSubmit={submit} style={{background:'#fff',padding:12,borderRadius:8}}>
      <div style={{fontWeight:800,marginBottom:8}}>Upload</div>
      <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} style={{width:'100%',padding:8,marginBottom:8}} />
      <select value={category} onChange={e=>setCategory(e.target.value)} style={{width:'100%',padding:8,marginBottom:8}}>
        <option>Experimental</option>
        <option>Short fiction/Excerpts</option>
        <option>Poetry/Lyrics</option>
        <option>Music</option>
      </select>
      <select value={type} onChange={e=>setType(e.target.value)} style={{width:'100%',padding:8,marginBottom:8}}>
        <option value="pdf">PDF</option>
        <option value="audio">Audio</option>
      </select>
      <input type="file" accept={type==='pdf'?'.pdf':'audio/*'} onChange={e=>setFile(e.target.files?.[0]||null)} style={{marginBottom:8}} />
      <textarea placeholder="Overview or extracted text for search" value={overview} onChange={e=>setOverview(e.target.value)} style={{width:'100%',padding:8,marginBottom:8}} />
      <div style={{display:'flex',gap:8}}>
        <button className="btn" type="submit">Upload</button>
        <div style={{alignSelf:'center',color:'#666'}}>{msg}</div>
      </div>
    </form>
  );
}