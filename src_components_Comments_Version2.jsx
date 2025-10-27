import React, { useEffect, useState } from 'react';
import { listCommentsForDoc, addCommentToDoc } from '../utils/storage';

export default function Comments({ docId }){
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');

  useEffect(()=>{ setComments(listCommentsForDoc(docId)); }, [docId]);

  const submit = (e) => {
    e.preventDefault();
    if(!text) return;
    addCommentToDoc(docId, { author: name || 'Anonymous', text });
    setText(''); setName('');
    setComments(listCommentsForDoc(docId));
  };

  return (
    <div className="comments">
      <h4>Comments</h4>
      <form onSubmit={submit}>
        <input placeholder="Name (optional)" value={name} onChange={e=>setName(e.target.value)} style={{width:'100%',padding:8,marginBottom:8}} />
        <textarea placeholder="Leave a comment..." value={text} onChange={e=>setText(e.target.value)} style={{width:'100%',padding:8,marginBottom:8}} />
        <div style={{display:'flex',gap:8}}>
          <button className="btn" type="submit">Post</button>
        </div>
      </form>

      <div style={{marginTop:12}}>
        {comments.map(c=>(
          <div key={c.id} className="comment">
            <div style={{fontWeight:800}}>{c.author} <span style={{fontWeight:600,fontSize:12,color:'#888'}}>{new Date(c.createdAt).toLocaleString()}</span></div>
            <div style={{marginTop:6}}>{c.text}</div>
            <div style={{marginTop:6,display:'flex',gap:8}}>
              <button className="small-btn" onClick={() => { /* like comment logic can be added */ }}>Like ({c.likes || 0})</button>
              <button className="small-btn">Dislike ({c.dislikes || 0})</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}