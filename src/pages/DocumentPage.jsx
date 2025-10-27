import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDoc, incrementRead, listDocs, toggleLikeDoc, toggleFavorite, listCommentsForDoc, addCommentToDoc } from '../utils/storage';
import PdfViewer from '../components/PdfViewer';
import AudioPlayer from '../components/AudioPlayer';
import Comments from '../components/Comments';

export default function DocumentPage(){
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [mode, setMode] = useState('continuous'); // continuous | single | double
  const [showMore, setShowMore] = useState(false);
  const [related, setRelated] = useState([]);

  useEffect(()=>{
    const d = getDoc(id);
    setDoc(d);
    if (d) incrementRead(d.id);
    // find related by category & keywords
    const all = listDocs();
    setRelated(all.filter(x => x.id !== id && x.category === d?.category).slice(0,4));
  }, [id]);

  if(!doc) return <div>Document not found</div>;

  return (
    <div className="doc-wrapper">
      <div className="doc-viewer">
        <div className="meta-row">
          <div className="meta-title">{doc.title}</div>
          <div style={{marginLeft:'auto'}} className="controls">
            <button className="small-btn" onClick={()=>toggleLikeDoc(doc.id, true)}>Like ({doc.likes || 0})</button>
            <button className="small-btn" onClick={()=>toggleLikeDoc(doc.id, false)}>Dislike ({doc.dislikes || 0})</button>
            <button className="small-btn" onClick={() => { toggleFavorite(doc.id); alert('Toggled favorite (stored locally)'); }}>♥ Favorite</button>
          </div>
        </div>

        <div style={{marginBottom:12,color:'#555'}}>{doc.overview} {doc.longOverview && !showMore && <button onClick={()=>setShowMore(true)} className="small-btn">show more</button>}</div>
        {showMore && <div style={{marginBottom:12,color:'#444'}}>{doc.longOverview}</div>}

        {doc.type === 'pdf' ? (
          <div>
            <div style={{marginBottom:8}}>
              <label>Display mode: </label>
              <select value={mode} onChange={e=>setMode(e.target.value)} style={{padding:8}}>
                <option value="continuous">Continuous</option>
                <option value="single">Single Page</option>
                <option value="double">Double Page</option>
              </select>
            </div>
            <PdfViewer src={doc.fileUrl} mode={mode} />
          </div>
        ) : (
          <AudioPlayer src={doc.fileUrl} />
        )}

        <div style={{display:'flex',gap:12,marginTop:12}}>
          <div style={{flex:1}}>
            <Comments docId={doc.id} />
          </div>

          <div style={{width:320}}>
            <div style={{background:'#fff',padding:12,borderRadius:8}}>
              <h4>Related</h4>
              {related.map(r=>(
                <div key={r.id} style={{padding:8,borderTop:'1px solid #eee',cursor:'pointer'}} onClick={()=>{ window.location.href = `/document/${r.id}`; }}>
                  <div style={{fontWeight:800}}>{r.title}</div>
                  <div style={{fontSize:12,color:'#666'}}>{r.overview}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <aside className="doc-side">
        <div style={{background:'#fff',padding:12,borderRadius:8}}>
          <div style={{fontWeight:800}}>Info</div>
          <div style={{marginTop:8}}>Category: {doc.category}</div>
          <div>Type: {doc.type}</div>
          <div>Reads: {doc.reads || 0}</div>
        </div>

        <div style={{height:12}}/>

        <div style={{background:'#fff',padding:12,borderRadius:8}}>
          <div style={{fontWeight:800}}>Interact</div>
          <div style={{marginTop:8}}>
            <button className="btn" onClick={()=>{ alert('Like registered locally'); toggleLikeDoc(doc.id,true); }}>Like</button>
          </div>
        </div>
      </aside>
    </div>
  );
}
