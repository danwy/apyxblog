import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listDocs } from '../utils/storage';

export default function CategoryPage(){
  const { name } = useParams();
  const navigate = useNavigate();
  const docs = listDocs().filter(d => d.category === name);

  return (
    <div>
      <h2>{name}</h2>
      <div className="section-grid">
        {docs.map(d=>(
          <div key={d.id} className="doc-card" onClick={()=>navigate(`/document/${d.id}`)}>
            <div className="doc-thumb">
              <div>
                <div style={{fontWeight:800}}>{d.title}</div>
                <div style={{fontSize:12,color:'#666',marginTop:8}}>{d.type.toUpperCase()}</div>
              </div>
            </div>
            <div style={{marginTop:8,fontWeight:700}}>{d.title}</div>
            <div style={{color:'#666',fontSize:13}}>{d.overview}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
