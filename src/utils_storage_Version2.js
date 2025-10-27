// Simple localStorage-backed data store for demo purposes.
// In production, replace with real backend APIs.

const DOC_KEY = 'apyx_docs_v1';
const COMMENT_KEY = 'apyx_comments_v1';
const USER_KEY = 'apyx_user_v1';
const ABOUT_KEY = 'apyx_about_v1';
const CONTACT_KEY = 'apyx_contact_v1';
const BACKGROUND_KEY = 'apyx_background_v1';

function lsGet(k) {
  try { return JSON.parse(localStorage.getItem(k)); } catch { return null; }
}
function lsSet(k, v) { localStorage.setItem(k, JSON.stringify(v)); }

export function initDemoData() {
  if (!lsGet(DOC_KEY)) {
    const sample = [
      {
        id: 'd1',
        title: 'Experimental Piece',
        category: 'Experimental',
        type: 'pdf',
        overview: 'A short experimental document.',
        longOverview: 'This is a longer overview for the experimental piece. Write more here.',
        fileName: null,
        fileUrl: null,
        textIndex: 'experimental piece sample text. add words here for search.',
        likes: 0,
        dislikes: 0,
        favorites: 0,
        reads: 0,
        createdAt: Date.now(),
      },
      {
        id: 'd2',
        title: 'Short Fiction Excerpt',
        category: 'Short fiction/Excerpts',
        type: 'pdf',
        overview: 'Excerpt from a short story.',
        longOverview: 'Full overview and notes about the short excerpt.',
        fileName: null,
        fileUrl: null,
        textIndex: 'short fiction excerpt sample text.',
        likes: 0,
        dislikes: 0,
        favorites: 0,
        reads: 0,
        createdAt: Date.now() - 1000 * 60 * 60 * 24,
      },
      {
        id: 'd3',
        title: 'Ode to Blue',
        category: 'Poetry/Lyrics',
        type: 'pdf',
        overview: 'A poem about the color of sky.',
        longOverview: 'Longer poem notes.',
        fileName: null,
        fileUrl: null,
        textIndex: 'poem sky blue lyrics sample text.',
        likes: 0,
        dislikes: 0,
        favorites: 0,
        reads: 0,
        createdAt: Date.now() - 1000 * 60 * 60 * 48,
      },
      {
        id: 'd4',
        title: 'Ambient Sketch',
        category: 'Music',
        type: 'audio',
        overview: 'A short ambient track.',
        longOverview: 'Longer notes about ambient track.',
        fileName: null,
        fileUrl: null,
        textIndex: '',
        likes: 0,
        dislikes: 0,
        favorites: 0,
        reads: 0,
        createdAt: Date.now() - 1000 * 60 * 60 * 72,
      }
    ];
    lsSet(DOC_KEY, sample);
  }

  if (!lsGet(COMMENT_KEY)) {
    lsSet(COMMENT_KEY, {});
  }
  if (!lsGet(USER_KEY)) {
    lsSet(USER_KEY, {
      id: 'local',
      name: 'Guest',
      avatar: null,
      bio: '',
      stats: { read: 0, commented: 0, likesReceived: 0 },
      favorites: []
    });
  }
  if (!lsGet(ABOUT_KEY)) lsSet(ABOUT_KEY, 'Write your about text here...');
  if (!lsGet(CONTACT_KEY)) lsSet(CONTACT_KEY, 'Put contact info here.');
}

export function listDocs() {
  return lsGet(DOC_KEY) || [];
}

export function getDoc(id) {
  const docs = listDocs();
  return docs.find(d => d.id === id);
}

export function saveDoc(doc) {
  const docs = listDocs();
  const idx = docs.findIndex(d => d.id === doc.id);
  if (idx >= 0) {
    docs[idx] = doc;
  } else {
    docs.push(doc);
  }
  lsSet(DOC_KEY, docs);
}

export function uploadFileForDoc(id, file) {
  // create object URL, store filename too
  const docs = listDocs();
  const doc = docs.find(d => d.id === id);
  if (!doc) return null;
  const url = URL.createObjectURL(file);
  doc.fileUrl = url;
  doc.fileName = file.name;
  saveDoc(doc);
  return doc;
}

export function addDocFromUpload({ title, category, type, overview, longOverview, file, textIndex }) {
  const id = `d${Date.now()}`;
  const url = file ? URL.createObjectURL(file) : null;
  const doc = {
    id,
    title,
    category,
    type,
    overview,
    longOverview,
    fileUrl: url,
    fileName: file ? file.name : null,
    textIndex: textIndex || '',
    likes: 0, dislikes: 0, favorites: 0, reads: 0,
    createdAt: Date.now()
  };
  const docs = listDocs();
  docs.push(doc);
  lsSet(DOC_KEY, docs);
  return doc;
}

export function listCommentsForDoc(id) {
  const all = lsGet(COMMENT_KEY) || {};
  return all[id] || [];
}

export function addCommentToDoc(docId, { author, text }) {
  const all = lsGet(COMMENT_KEY) || {};
  if (!all[docId]) all[docId] = [];
  const comment = { id: `c${Date.now()}`, author: author || 'Anonymous', text, createdAt: Date.now(), likes: 0, dislikes: 0 };
  all[docId].push(comment);
  lsSet(COMMENT_KEY, all);
  // update stats
  const user = lsGet(USER_KEY);
  if (user) {
    user.stats.commented = (user.stats.commented || 0) + 1;
    lsSet(USER_KEY, user);
  }
  return comment;
}

export function toggleLikeDoc(id, like = true) {
  const docs = listDocs();
  const doc = docs.find(d => d.id === id);
  if (!doc) return;
  if (like) doc.likes = (doc.likes || 0) + 1;
  else doc.dislikes = (doc.dislikes || 0) + 1;
  lsSet(DOC_KEY, docs);
}

export function incrementRead(id) {
  const docs = listDocs();
  const doc = docs.find(d => d.id === id);
  if (!doc) return;
  doc.reads = (doc.reads || 0) + 1;
  lsSet(DOC_KEY, docs);
  const user = lsGet(USER_KEY);
  if (user) {
    user.stats.read = (user.stats.read || 0) + 1;
    lsSet(USER_KEY, user);
  }
}

export function toggleFavorite(docId) {
  const user = lsGet(USER_KEY);
  if (!user) return;
  user.favorites = user.favorites || [];
  const idx = user.favorites.indexOf(docId);
  if (idx >= 0) user.favorites.splice(idx, 1);
  else user.favorites.push(docId);
  lsSet(USER_KEY, user);
}

export function getUser() { return lsGet(USER_KEY); }
export function saveUser(user) { lsSet(USER_KEY, user); }
export function getAbout() { return lsGet(ABOUT_KEY); }
export function saveAbout(t) { lsSet(ABOUT_KEY, t); }
export function getContact() { return lsGet(CONTACT_KEY); }
export function saveContact(t) { lsSet(CONTACT_KEY, t); }
export function setBackgroundDataUrl(dataUrl) { lsSet(BACKGROUND_KEY, dataUrl); document.documentElement.style.setProperty('--apyx-bg-image', `url(${dataUrl})`); }
export function getBackground() { return lsGet(BACKGROUND_KEY); }
