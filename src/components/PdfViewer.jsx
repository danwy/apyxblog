import React, { useEffect, useRef, useState } from 'react';
import { getDocument } from 'pdfjs-dist';

// pdfjs worker setup for modern bundlers
import pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.entry';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function PdfViewer({ src, mode = 'continuous' }){
  const containerRef = useRef(null);
  const [doc, setDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);

  useEffect(()=>{
    if(!src) return;
    let canceled = false;
    (async ()=>{
      try{
        const pdf = await getDocument(src).promise;
        if(canceled) return;
        setDoc(pdf);
        setNumPages(pdf.numPages);
      }catch(err){
        console.error('pdf load error', err);
      }
    })();
    return ()=>{ canceled = true; if (doc) doc.destroy(); };
  }, [src]);

  useEffect(()=>{
    const c = containerRef.current;
    if(!c || !doc) return;
    c.innerHTML = '';
    if(mode === 'continuous'){
      // render every page into canvas and stack
      for(let i=1;i<=doc.numPages;i++){
        (async (p)=>{
          const page = await doc.getPage(p);
          const viewport = page.getViewport({ scale:1.2 });
          const canvas = document.createElement('canvas');
          canvas.style.display = 'block';
          canvas.style.marginBottom = '12px';
          const ctx = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({ canvasContext: ctx, viewport }).promise;
          c.appendChild(canvas);
        })(i);
      }
    } else if(mode === 'single'){
      renderSingle(pageIndex);
    } else if(mode === 'double'){
      renderDouble(pageIndex);
    }
  }, [doc, mode, pageIndex]);

  const renderSingle = async (p) => {
    const c = containerRef.current;
    c.innerHTML = '';
    if(!doc) return;
    const page = await doc.getPage(p);
    const viewport = page.getViewport({ scale:1.3 });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await page.render({ canvasContext: ctx, viewport }).promise;
    c.appendChild(canvas);
  };

  const renderDouble = async (p) => {
    const c = containerRef.current;
    c.innerHTML = '';
    if(!doc) return;
    const leftPage = p;
    const rightPage = p+1 <= doc.numPages ? p+1 : null;
    const pages = [leftPage, rightPage].filter(Boolean);
    const canvases = [];
    for (const pg of pages) {
      const page = await doc.getPage(pg);
      const viewport = page.getViewport({ scale:1.2 });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: ctx, viewport }).promise;
      canvases.push(canvas);
    }
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.gap = '8px';
    canvases.forEach(cv => wrapper.appendChild(cv));
    c.appendChild(wrapper);
  };

  return (
    <div>
      <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:8}}>
        {mode !== 'continuous' && (
          <>
            <button className="small-btn" onClick={()=>setPageIndex(p => Math.max(1,p-1))}>Prev</button>
            <div>Page {pageIndex} / {numPages}</div>
            <button className="small-btn" onClick={()=>setPageIndex(p => Math.min(numPages, p+1))}>Next</button>
          </>
        )}
      </div>
      <div ref={containerRef} />
    </div>
  );
}
