import React, { useEffect, useState } from 'react';
import { getUser, saveUser, listDocs } from '../utils/storage';

export default function Profile(){
  const [user, setUser] = useState(getUser());
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(()=>{ setUser(getUser()); setFavorites((getUser().favorites||[]).map(id=>listDocs().find(d=>d.id===id)).filter(Boolean)); }, []);

  const save = () => {
    const updated = { ...user, bio };
    if (avatarFile) {
      const url = URL.createObjectURL(avatarFile);
      updated.avatar = url;
    }
    saveUser(updated);
    setUser(updated);
    alert('Profile saved locally');
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h3>{user?.name}</h3>
        <div>
          <img src={user?.avatar || '/avatar-placeholder.png'} alt="avatar" style={{width:120,height:120,borderRadius:12,objectFit:'cover'}} />
        </div>
        <div style={{marginTop:12}}>
          <input type="file" accept="image/*" onChange={e=>setAvatarFile(e.target.files?.[0]||null)} />
        </div>
        <div style={{marginTop:12}}>
          <button className="btn" onClick={save}>Save</button>
        </div>
      </div>

      <div className="profile-main">
        <h3>Profile</h3>
        <div>
          <label>Bio</label>
          <textarea value={bio} onChange={e=>setBio(e.target.value)} style={{width:'100%',padding:8}} />
          <div style={{marginTop:12}}>
            <button className="btn" onClick={save}>Save profile</button>
          </div>
        </div>

        <div style={{marginTop:18}}>
          <h4>Stats</h4>
          <div>Read: {user?.stats?.read || 0}</div>
          <div>Commented: {user?.stats?.commented || 0}</div>
          <div>Likes received: {user?.stats?.likesReceived || 0}</div>
        </div>

        <div style={{marginTop:18}}>
          <h4>Favorites</h4>
          <div>
            {favorites.map(f=>(
              <div key={f.id} style={{padding:8,borderTop:'1px solid #eee'}}>{f.title}</div>
            ))}
          </div>
        </div>

        <div style={{marginTop:18}}>
          <h4>Background</h4>
          <BackgroundUploader />
        </div>
      </div>
    </div>
  );
}

import { setBackgroundDataUrl } from '../utils/storage';
function BackgroundUploader(){
  const [file, setFile] = useState(null);
  const upload = ()=>{
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (e)=>{
      setBackgroundDataUrl(e.target.result);
      alert('Background set');
    };
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} />
      <div style={{marginTop:8}}><button className="btn" onClick={upload}>Upload background</button></div>
    </div>
  );
}