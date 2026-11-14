/* Folix PDF Viewer - app logic (viewer runs only on index.html) */
(()=>{
const $=id=>document.getElementById(id);
const C=window.FOLIX_CONFIG;
// ---------- icons are built in, so a missing or stale icon file can never show a broken image ----------
const ICONS={"close":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><path d=\"M5 5l14 14M19 5L5 19\"/></svg>","contrast":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><circle cx=\"12\" cy=\"12\" r=\"8\"/><path d=\"M12 4a8 8 0 0 1 0 16z\" fill=\"#0a0a0a\"/></svg>","download":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><path d=\"M12 3v13M6 11l6 6 6-6M4 21h16\"/></svg>","eraser":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><path d=\"M4 16l9-9 7 7-5 5H8zM9 21h11\"/></svg>","fit-height":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><path d=\"M12 3v18M7 7l5-5 5 5M7 17l5 5 5-5\"/></svg>","fit-width":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><path d=\"M3 12h18M7 7l-5 5 5 5M17 7l5 5-5 5\"/></svg>","fullscreen":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><path d=\"M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5\"/></svg>","highlight":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><path d=\"M5 20h14M8 15l4-10 4 10M9.5 12h5\"/></svg>","image":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><path d=\"M3 4h18v16H3zM3 16l5-5 4 4 3-3 6 6M15 9h.01\"/></svg>","marker":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><path d=\"M6 18L18 6\" stroke-width=\"8\" stroke-linecap=\"butt\"/></svg>","menu":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><path d=\"M3 6h18M3 12h18M3 18h18\"/></svg>","more":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"#0a0a0a\" stroke=\"#0a0a0a\" stroke-width=\"3\"><circle cx=\"5\" cy=\"12\" r=\"1.5\"/><circle cx=\"12\" cy=\"12\" r=\"1.5\"/><circle cx=\"19\" cy=\"12\" r=\"1.5\"/></svg>","next":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><path d=\"M9 4l8 8-8 8\"/></svg>","note":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><path d=\"M4 4h16v11l-5 5H4zM15 20v-5h5\"/></svg>","open":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><path d=\"M3 6h7l2 3h9v11H3z\"/></svg>","pages-edit":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><path d=\"M8 3h12v14H8zM4 7v14h12\"/></svg>","pen":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><path d=\"M4 20l1-5L16 4l4 4L9 19zM13 7l4 4\"/></svg>","pin":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><path d=\"M9 3h6l-1 6 4 4v2H6v-2l4-4zM12 15v6\"/></svg>","prev":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><path d=\"M15 4l-8 8 8 8\"/></svg>","print":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><path d=\"M7 9V3h10v6M7 17H3V9h18v8h-4M7 14h10v7H7z\"/></svg>","redo":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><path d=\"M15 5l5 5-5 5M20 10H10a6 6 0 0 0 0 12h3\"/></svg>","rotate":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><path d=\"M20 12a8 8 0 1 1-2.5-5.8M20 3v6h-6\"/></svg>","search":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><circle cx=\"10\" cy=\"10\" r=\"6\"/><path d=\"M15 15l6 6\"/></svg>","share":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><circle cx=\"18\" cy=\"5\" r=\"3\"/><circle cx=\"6\" cy=\"12\" r=\"3\"/><circle cx=\"18\" cy=\"19\" r=\"3\"/><path d=\"M8.6 10.5l6.8-4M8.6 13.5l6.8 4\"/></svg>","sidebar":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><path d=\"M3 4h18v16H3zM9 4v16\"/></svg>","signature":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><path d=\"M3 16c3-9 5-10 5-5s2 4 4-1c1 3 3 3 4 0 1 1 2 1 3 0M3 21h18\"/></svg>","speaker":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><path d=\"M4 9h4l5-4v14l-5-4H4zM17 8c2 2 2 6 0 8M20 5c4 4 4 10 0 14\"/></svg>","spotlight":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2\"/></svg>","textbox":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><path d=\"M5 6h14M12 6v13M9 19h6\"/></svg>","trim":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><path d=\"M7 2v15h15M2 7h15v15\"/></svg>","two-page":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><path d=\"M3 5h8v14H3zM13 5h8v14h-8z\"/></svg>","undo":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><path d=\"M9 5L4 10l5 5M4 10h10a6 6 0 0 1 0 12h-3\"/></svg>","zoom-in":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><path d=\"M12 4v16M4 12h16\"/></svg>","zoom-out":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"miter\"><path d=\"M4 12h16\"/></svg>"};
const icoSrc=n=>ICONS[n]?'data:image/svg+xml,'+encodeURIComponent(ICONS[n]):'assets/icons/'+n+'.svg';
document.querySelectorAll('img[src*="/icons/"]').forEach(im=>{const n=im.getAttribute('src').split('/').pop().replace('.svg','');im.classList.add('ic');if(ICONS[n])im.src=icoSrc(n)});

document.querySelectorAll('[data-cfg]').forEach(e=>e.textContent=C[e.dataset.cfg]);
document.querySelectorAll('a[data-mail]').forEach(a=>a.href='mailto:'+C.email);
const cp=$('copy');if(cp)cp.onclick=()=>{(navigator.clipboard?navigator.clipboard.writeText(C.email):Promise.reject()).then(()=>{cp.textContent='Copied!'},()=>{cp.textContent=C.email});setTimeout(()=>cp.textContent='Copy email',2000)};
const burger=$('burger'),hdr=document.querySelector('.top');
if(burger)burger.onclick=()=>{const o=hdr.classList.toggle('open');burger.setAttribute('aria-expanded',o);burger.firstElementChild.src=icoSrc(o?'close':'menu')};
// ---------- site-wide theme (light / sepia / dark) ----------
const THEMES=['light','sepia','dark'],TCOL={light:'#ff6a00',sepia:'#d27a2c',dark:'#a9500f'};
let th='light';
try{const t=localStorage.getItem('folix.theme');th=THEMES.includes(t)?t:(localStorage.getItem('folix.dark')==='1'?'dark':'light')}catch(e){}
const themeHooks=[];
function applyTheme(){
  document.documentElement.dataset.theme=th;
  const mc=document.querySelector('meta[name=theme-color]');if(mc)mc.content=TCOL[th];
  document.querySelectorAll('[data-theme-toggle]').forEach(b=>{b.title='Theme: '+th+' (click to change)';b.setAttribute('aria-label','Theme: '+th+'. Click to change');if(b.dataset.themeToggle==='text')b.textContent='Theme: '+th});
  themeHooks.forEach(f=>f());
}
function nextTheme(){th=THEMES[(THEMES.indexOf(th)+1)%3];try{localStorage.setItem('folix.theme',th)}catch(e){}applyTheme();if(typeof msg==='function')msg('Theme: '+th)}
document.querySelectorAll('[data-theme-toggle]').forEach(b=>b.addEventListener('click',nextTheme));
applyTheme();
if('serviceWorker' in navigator&&/^https?:/.test(location.protocol))addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
if(!$('pages'))return; // static pages stop here
const lib=window.pdfjsLib;
lib.GlobalWorkerOptions.workerSrc=C.workerSrc;
const main=$('main'),pagesEl=$('pages'),empty=$('empty');
let noHide=0,rot=0,fitMode='w';let pdf=null,bytes=null,name='document.pdf',scale=1,base=null,cur=1,io=null,hits=[],hi=-1,query='';
const ctrls=['prev','next','pg','zo','zi','fit','fith','rot','two','spotb','sb','ann','share','tts','png','ptb','trim','sprev','snext','q','dl','pr'];
const msg=t=>{const m=$('msg');m.textContent=t;m.style.display=t?'block':'none';if(t)setTimeout(()=>m.style.display='none',2500)};

async function openData(data,fname){
  try{
    if(pdf){pdf.destroy();pdf=null}
    pagesEl.innerHTML='';resetSide();msg('Loading…');
    bytes=data.slice(0);name=fname||'document.pdf';
    const task=lib.getDocument({data,isEvalSupported:false});
    task.onPassword=(update,reason)=>askPw(update,reason,task);
    pdf=await task.promise;
    const p1=await pdf.getPage(1);base=p1.getViewport({scale:1});
    empty.classList.add('hide');document.body.classList.add('reading');requestAnimationFrame(fitBar);
    ctrls.forEach(c=>$(c).disabled=false);
    $('pg').max=pdf.numPages;$('tot').textContent='/ '+pdf.numPages;
    document.title=name+' – Folix';
    rot=0;fitDefault(true);build();initSide();initAnn();initSpot();msg('');restoreLast();recentAdd();
  }catch(e){
    const was=pwCancelled;pwCancelled=false;
    msg(was?'Cancelled':'Could not open this PDF');
    if(!pdf){empty.classList.remove('hide');document.body.classList.remove('reading');requestAnimationFrame(fitBar)}
    if(!was)console.error(e);
  }
}
// ---- page rendering: one page at a time, nearest to the viewport first, text layers built when idle ----
const want=new Set(),kept=new Set(),tlq=[];
let rActive=0,pumpT=0,tlRun=false;
const MAX_PX=9e6,KEEP_PX=70e6,KEEP_N=14;
const ctxFilter=typeof CanvasRenderingContext2D!=='undefined'&&'filter' in CanvasRenderingContext2D.prototype;
const idle=f=>window.requestIdleCallback?requestIdleCallback(f,{timeout:300}):setTimeout(f,16);
const dist=d=>Math.abs(d.offsetTop+d.offsetHeight/2-(main.scrollTop+main.clientHeight/2));
function bakeFilter(){
  if(!ctxFilter)return '';
  if(th==='dark')return 'invert(.92) hue-rotate(180deg)';
  if(th==='sepia')return 'sepia(.6) saturate(.85) brightness(.96)';
  if(main.dataset.spot==='1')return 'sepia(.55) brightness(.92)';
  return '';
}
function build(){
  if(io)io.disconnect();
  want.clear();kept.clear();tlq.length=0;
  pagesEl.innerHTML='';
  io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)want.add(e.target);else{want.delete(e.target);if(e.target._rt&&!e.target._done){try{e.target._rt.cancel()}catch(x){}}}});pump()},{root:main,rootMargin:'700px 0px'});
  for(let i=1;i<=pdf.numPages;i++){
    const d=document.createElement('div');d.className='page';d.dataset.n=i;size(d);pagesEl.appendChild(d);io.observe(d);
  }
  $('zl').textContent=Math.round(scale*100)+'%';
}
function applyTl(d,tl){const k=d._s/tl._s;tl.style.transformOrigin='0 0';tl.style.transform=Math.abs(k-1)<.001?'':'scale('+k+')'}
function resetPages(resize,hard){
  want.clear();tlq.length=0;if(hard)kept.clear();
  pagesEl.querySelectorAll('.page').forEach(d=>{
    d._tok=(d._tok||0)+1;if(d._rt){try{d._rt.cancel()}catch(e){}d._rt=null}
    d._busy=false;d._done=false;if(resize)size(d);
    if(hard){d.textContent='';d._svg=d._g=d._nl=null;d._noAnn=false}
    else{   // soft: keep the old bitmap (stretched) and the text layer so a selection survives zooming
      const cv=d.querySelector('canvas');if(cv){cv.style.width=d.style.width;cv.style.height=d.style.height}
      d._s=scale;d.querySelectorAll('.textLayer,.annotationLayer').forEach(x=>applyTl(d,x));if(d._g)annDraw(d);
    }
    io.unobserve(d);io.observe(d);
  });
}
function pump(){
  if(pumpT)return;
  pumpT=setTimeout(()=>{
    pumpT=0;if(rActive>=1||!pdf)return;
    if(vel>1800&&performance.now()-lastT0<120){setTimeout(pump,90);return}
    let best=null,bd=1e12;want.forEach(d=>{if(d._done||d._busy)return;const x=dist(d);if(x<bd){bd=x;best=d}});
    if(best)render(best);
  },0);
}
function freePage(d){d._noAnn=false;kept.delete(d);d._tok=(d._tok||0)+1;d._done=false;d.textContent='';d._svg=d._g=d._nl=null}
function evict(){
  let sum=0;kept.forEach(d=>sum+=d._px||0);
  if(kept.size<=KEEP_N&&sum<=KEEP_PX)return;
  [...kept].filter(d=>!want.has(d)).sort((a,b)=>dist(b)-dist(a)).forEach(d=>{
    if(kept.size<=KEEP_N&&sum<=KEEP_PX)return;sum-=d._px||0;freePage(d);
  });
}
const bw=()=>rot%180?base.height:base.width,bh=()=>rot%180?base.width:base.height;
function size(d){d.style.width=bw()*scale+'px';d.style.height=bh()*scale+'px'}
async function render(d){
  if(d._busy||d._done)return;
  d._busy=true;rActive++;const my=pdf,tok=d._tok=(d._tok||0)+1;
  try{
    const page=await my.getPage(+d.dataset.n);
    if(my!==pdf||d._tok!==tok||!want.has(d))return;
    const v1=page.getViewport({scale:1});d._W=v1.width;d._H=v1.height;
    const vp=page.getViewport({scale,rotation:(page.rotate+rot)%360});
    let dpr=Math.min(window.devicePixelRatio||1,C.maxDpr);
    if(vp.width*vp.height*dpr*dpr>MAX_PX)dpr=Math.max(.5,Math.sqrt(MAX_PX/(vp.width*vp.height)));
    d.style.width=vp.width+'px';d.style.height=vp.height+'px';
    const cv=document.createElement('canvas');
    cv.width=Math.floor(vp.width*dpr);cv.height=Math.floor(vp.height*dpr);
    cv.style.width=vp.width+'px';cv.style.height=vp.height+'px';
    const ctx=cv.getContext('2d',{alpha:false});
    const task=page.render({canvasContext:ctx,viewport:vp,transform:dpr!==1?[dpr,0,0,dpr,0,0]:null});
    d._rt=task;await task.promise;d._rt=null;
    if(my!==pdf||d._tok!==tok)return;
    const f=bakeFilter();    // dark / sepia look is baked into the bitmap once, so scrolling stays cheap
    if(f){
      ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.filter=f;const H=cv.height,S=600;
      for(let y=0;y<H;y+=S){
        const h=Math.min(S,H-y);ctx.drawImage(cv,0,y,cv.width,h,0,y,cv.width,h);
        if(y+S<H){await new Promise(z=>setTimeout(z,0));if(d._tok!==tok||my!==pdf){ctx.restore();return}}
      }
      ctx.restore();cv.className='baked';
    }
    const old=d.querySelector('canvas');if(old)old.replaceWith(cv);else d.insertBefore(cv,d.firstChild);
    annAttach(d,vp);d._done=true;d._px=cv.width*cv.height;kept.add(d);evict();
    const etl=d.querySelector('.textLayer'),eal=d.querySelector('.annotationLayer');
    if(etl)applyTl(d,etl);if(eal)applyTl(d,eal);
    if(!etl||(!eal&&!d._noAnn)){tlq.push({d,page,vp,tok});if(!tlRun)runText()}
  }catch(e){if(e&&e.name!=='RenderingCancelledException')console.error(e)}
  finally{d._busy=false;d._rt=null;rActive--;pump()}
}
function runText(){
  tlRun=true;
  const live=j=>pdf&&j.d._done&&j.d._tok===j.tok;
  const step=async()=>{
    tlq.sort((a,b)=>dist(a.d)-dist(b.d));
    const j=tlq.shift();if(!j){tlRun=false;return}
    if(live(j)&&!j.d.querySelector('.textLayer')){
      try{
        const tl=document.createElement('div');tl.className='textLayer';tl._s=j.vp.scale;tl._divs=[];tl.style.setProperty('--scale-factor',scale);
        const tc=await j.page.getTextContent();
        if(live(j)){
          j.d.insertBefore(tl,j.d._svg||null);
          const its=tc.items;
          for(let i=0;i<its.length;i+=100){
            if(!live(j))break;
            await lib.renderTextLayer({textContentSource:{items:its.slice(i,i+100),styles:tc.styles},container:tl,viewport:j.vp,textDivs:tl._divs}).promise;
            if(i+100<its.length)await new Promise(z=>idle(z));
          }
          tl._done=true;mark(j.d);
        }
      }catch(e){}
    }
    if(live(j)&&!j.d.querySelector('.annotationLayer')&&!j.d._noAnn){
      try{
        const use=(await j.page.getAnnotations({intent:'display'})).filter(a=>a.subtype==='Link'||a.subtype==='Widget');
        if(!live(j)){}
        else if(!use.length)j.d._noAnn=true;
        else{
          const al=document.createElement('div');al.className='annotationLayer';al._s=j.vp.scale;al.style.setProperty('--scale-factor',j.vp.scale);
          j.d.insertBefore(al,j.d._svg||null);
          await new lib.AnnotationLayer({div:al,page:j.page,viewport:j.vp.clone({dontFlip:true})}).render({annotations:use,imageResourcesPath:'',renderForms:true,linkService:LS,downloadManager:null,annotationStorage:pdf.annotationStorage,enableScripting:false,hasJSActions:false});
        }
      }catch(e){console.warn('annotation layer',e)}
    }
    idle(step);
  };
  idle(step);
}
function mark(d){if(window.CSS&&CSS.highlights){hlSoon();return}const q=sQ;d.querySelectorAll('.textLayer span').forEach(s=>s.classList.toggle('hit',!!q&&s.textContent.toLowerCase().includes(q)))}
function setScale(s,km,hard){
  if(!pdf)return;if(!km)fitMode=null;
  const mid=cur;scale=Math.min(C.maxScale,Math.max(C.minScale,s));
  resetPages(true,hard);
  $('zl').textContent=Math.round(scale*100)+'%';
  go(mid);saveLast();
}
function fitWidth(silent){scale=Math.max(.25,Math.min(5,(main.clientWidth-24-(two?24:0))/(pp()*bw())));fitMode='w';if(!silent)setScale(scale,true)}
function fitDefault(silent){
  if(two)return fitWidth(silent);
  const vw=main.clientWidth,t=Math.min(vw-24,Math.max(640,Math.min(1500,vw*.7)));
  scale=Math.max(C.minScale,Math.min(C.maxScale,t/bw()));fitMode='d';if(!silent)setScale(scale,true);
}
function refit(){if(!pdf)return;if(fitMode==='d')fitDefault();else if(fitMode==='w')fitWidth();else if(fitMode==='h')fitHeight();else if(fitMode==='c')fitContent()}
let rzT;addEventListener('resize',()=>{clearTimeout(rzT);rzT=setTimeout(refit,220)});
function fitHeight(){setScale((main.clientHeight-56)/bh(),true);fitMode='h'}
function go(n){
  n=Math.min(pdf.numPages,Math.max(1,n|0));
  noHide=Date.now()+700;const d=pagesEl.children[n-1];if(d)main.scrollTop=d.offsetTop-8;
  cur=n;$('pg').value=n;markCur();
}
let tick=false,lastY0=0,lastT0=0,vel=0;
main.addEventListener('scroll',()=>{
  {const now=performance.now(),y=main.scrollTop,dt=Math.max(1,now-lastT0);vel=vel*.6+Math.abs(y-lastY0)/dt*1000*.4;lastY0=y;lastT0=now}
  if(!pdf||tick)return;tick=true;
  requestAnimationFrame(()=>{
    tick=false;const mid=main.scrollTop+main.clientHeight/3;
    const ch=pagesEl.children;let lo=0,hi2=ch.length-1;
    while(lo<hi2){const m=(lo+hi2+1)>>1;ch[m].offsetTop<=mid?lo=m:hi2=m-1}
    while(lo>0&&ch[lo-1].offsetTop===ch[lo].offsetTop)lo--;cur=lo+1;if(document.activeElement!==$('pg'))$('pg').value=cur;markCur();saveLast();
  });
},{passive:true});

// search

// printing + download
function download(){
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
  a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000);
}
function print(){
  const url=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
  const f=document.createElement('iframe');f.style.cssText='position:fixed;width:0;height:0;border:0';f.src=url;
  f.onload=()=>{try{f.contentWindow.focus();f.contentWindow.print()}catch{window.open(url)}setTimeout(()=>{f.remove();URL.revokeObjectURL(url)},60000)};
  document.body.appendChild(f);
}

// password dialog (password is only passed to PDF.js, never stored)
const dlg=$('pw');let pwS=null,pwCancelled=false;
function askPw(update,reason,task){
  pwS={update,task};
  $('pwmsg').textContent=reason===lib.PasswordResponses.INCORRECT_PASSWORD?'Wrong password. Try again.':'This PDF is locked. Enter its password.';
  $('pwi').value='';if(!dlg.open)modal(dlg);setTimeout(()=>$('pwi').focus(),30);
}
$('pwf').onsubmit=e=>{e.preventDefault();const s=pwS;if(!s)return;pwS=null;const pw=$('pwi').value;$('pwi').value='';dlg.close();s.update(pw)};
$('pwx').onclick=()=>dlg.close();
dlg.addEventListener('close',()=>{if(pwS){const s=pwS;pwS=null;pwCancelled=true;s.task.destroy()}});
// sidebar: page thumbnails + outline
const work=$('work'),side=$('side'),thumbs=$('thumbs'),outl=$('outline'),TW=150;
let tio=null,thumbsFor=null,curTh=null,thumbsReady=false;
const hasSb=()=>work.classList.contains('sb');
function setSidebar(o,save){
  work.classList.toggle('sb',o);if(save&&pdf)requestAnimationFrame(refit);$('sb').classList.toggle('on',o);$('sb').setAttribute('aria-pressed',o);
  if(save)try{localStorage.setItem('folix.side',o?'1':'0')}catch(e){}
  if(o){buildThumbs();markCur()}
}
function setTab(t){side.dataset.tab=t;[['tabp','pages'],['tabo','outline'],['tabq','search'],['tabn','notes']].forEach(([i,n])=>$(i).classList.toggle('on',t===n));if(t==='notes')renderNotes()}
$('sb').onclick=()=>setSidebar(!hasSb(),true);
$('tabp').onclick=()=>setTab('pages');$('tabo').onclick=()=>setTab('outline');$('tabq').onclick=()=>setTab('search');$('tabn').onclick=()=>setTab('notes');
function resetSide(){fp=null;TX.clear();sReset();ttsStop();if(tio)tio.disconnect();thumbs.textContent='';outl.textContent='';thumbsFor=null;thumbsReady=false;curTh=null}
function buildThumbs(){
  if(!pdf||thumbsFor===pdf)return;thumbsFor=pdf;thumbs.textContent='';
  tio=new IntersectionObserver(es=>es.forEach(e=>{e.target._vis=e.isIntersecting;e.isIntersecting?thRender(e.target):thDrop(e.target)}),{root:thumbs,rootMargin:'300px 0px'});
  const hgt=Math.round(base.height/base.width*TW);
  for(let i=1;i<=pdf.numPages;i++){
    const b=document.createElement('button');b.className='th';b.dataset.n=i;b.setAttribute('aria-label','Page '+i);
    b.innerHTML='<div class="box"></div><span>'+i+'</span>';
    b.firstChild.style.width=TW+'px';b.firstChild.style.height=hgt+'px';
    b.onclick=()=>{go(i);if(innerWidth<=720)setSidebar(false,false)};
    thumbs.appendChild(b);tio.observe(b);
  }
  thumbsReady=true;
}
const thq=[];let thBusy=false;
function thRender(el){if(!pdf||el._d||el._b||el._q)return;el._q=true;thq.push(el);thPump()}
function thPump(){
  if(thBusy)return;const el=thq.shift();if(!el)return;el._q=false;
  if(el._d||!pdf||!el._vis)return thPump();
  thBusy=true;el._b=true;el._x=false;const my=pdf;
  my.getPage(+el.dataset.n).then(async pg=>{
    if(my!==pdf)return;
    const vp=pg.getViewport({scale:TW/pg.getViewport({scale:1}).width}),dpr=Math.min(devicePixelRatio||1,2);
    const cv=document.createElement('canvas');cv.width=vp.width*dpr|0;cv.height=vp.height*dpr|0;
    cv.style.width=vp.width+'px';cv.style.height=vp.height+'px';
    await pg.render({canvasContext:cv.getContext('2d'),viewport:vp,transform:dpr!==1?[dpr,0,0,dpr,0,0]:null}).promise;
    el.firstChild.textContent='';el.firstChild.appendChild(cv);el._d=true;
  }).catch(()=>{}).finally(()=>{el._b=false;thBusy=false;if(el._x)thDrop(el);setTimeout(thPump,rActive?150:40)});
}
function thDrop(el){if(el._b){el._x=true;return}el._d=false;el.firstChild.textContent=''}
function markCur(){
  if(!thumbsReady)return;const el=thumbs.children[cur-1];if(!el||el===curTh)return;
  if(curTh)curTh.classList.remove('cur');curTh=el;el.classList.add('cur');
  if(hasSb()&&side.dataset.tab==='pages'){const t=el.offsetTop,b=t+el.offsetHeight,v=thumbs.scrollTop,h=thumbs.clientHeight;if(t<v+8)thumbs.scrollTop=t-12;else if(b>v+h-8)thumbs.scrollTop=b-h+12}
}
function buildOutline(items,ul){
  items.forEach(it=>{
    const li=document.createElement('li'),row=document.createElement('div');row.className='orow';
    const has=it.items&&it.items.length;let kids=null;
    if(has){const t=document.createElement('button');t.className='tg';t.textContent='+';t.setAttribute('aria-expanded','false');t.setAttribute('aria-label','Expand section');
      t.onclick=()=>{const o=!kids.classList.toggle('hide');t.textContent=o?'–':'+';t.setAttribute('aria-expanded',o)};row.appendChild(t)}
    const b=document.createElement('button');b.className='ol';b.textContent=it.title||'(untitled)';b.onclick=()=>jump(it);row.appendChild(b);li.appendChild(row);
    if(has){kids=document.createElement('ul');kids.className='hide';buildOutline(it.items,kids);li.appendChild(kids)}
    ul.appendChild(li);
  });
}
async function jump(it){
  try{
    if(!it.dest&&it.url&&/^https?:/i.test(it.url)){window.open(it.url,'_blank','noopener');return}
    let d=it.dest;if(typeof d==='string')d=await pdf.getDestination(d);
    if(!Array.isArray(d))return;
    const i=typeof d[0]==='object'?await pdf.getPageIndex(d[0]):d[0];
    go(i+1);if(innerWidth<=720)setSidebar(false,false);
  }catch(e){msg('Could not jump to that section')}
}
function initSide(){
  setTab('pages');const my=pdf;
  my.getOutline().then(o=>{
    if(my!==pdf)return;
    if(o&&o.length){outl.textContent='';const ul=document.createElement('ul');buildOutline(o,ul);outl.appendChild(ul)}
    else outl.innerHTML='<p class="none">NO OUTLINE IN THIS PDF</p>';
  }).catch(()=>{});
  let sv=null;try{sv=localStorage.getItem('folix.side')}catch(e){}
  setSidebar(sv==='1'&&innerWidth>720,false);
}
// ---------- annotations ----------
const NS=(n,a)=>{const e=document.createElementNS('http://www.w3.org/2000/svg',n);for(const k in a)e.setAttribute(k,a[k]);return e};
let ann={},fp=null,tool=null,col='#ff3b30',wid=4,picked=false,toasted=false;
const hist=[],redoS=[],defC={pen:'#ff3b30',mk:'#ffd60a',hl:'#ffd60a',note:'#ffd60a',tx:'#0a0a0a'};
function modal(d){d.showModal()}
const MAT=['',' ','',' '];
const fwd=(d,x,y)=>rot===90?[d._H-y,x]:rot===180?[d._W-x,d._H-y]:rot===270?[y,d._W-x]:[x,y];
const inv=(d,u,v)=>rot===90?[v,d._H-u]:rot===180?[d._W-u,d._H-v]:rot===270?[d._W-v,u]:[u,v];
const rotM=d=>rot===90?'matrix(0 1 -1 0 '+d._H+' 0)':rot===180?'matrix(-1 0 0 -1 '+d._W+' '+d._H+')':rot===270?'matrix(0 -1 1 0 0 '+d._W+')':'';
const f1=q=>q[0].toFixed(1)+' '+q[1].toFixed(1);
function pathD(p){
  if(p.length<3)return 'M'+p.map(f1).join('L');
  let s='M'+f1(p[0]);
  for(let i=1;i<p.length-1;i++)s+='Q'+f1(p[i])+' '+f1([(p[i][0]+p[i+1][0])/2,(p[i][1]+p[i+1][1])/2]);
  return s+'L'+f1(p[p.length-1]);
}
function annAttach(d,vp){
  d.querySelectorAll('.ann,.nl').forEach(e=>e.remove());
  d._s=vp.scale;const w=rot%180?d._H:d._W,h=rot%180?d._W:d._H;
  const svg=NS('svg',{class:'ann',viewBox:'0 0 '+w+' '+h,width:vp.width,height:vp.height});
  const g=NS('g',{transform:rotM(d)});svg.appendChild(g);d.appendChild(svg);d._svg=svg;d._g=g;
  const nl=document.createElement('div');nl.className='nl';d.appendChild(nl);d._nl=nl;
  svg.addEventListener('pointerdown',e=>{
    const pi=+d.dataset.n-1;
    if(tool==='er'){const t=e.target.closest&&e.target.closest('[data-i]');if(t){e.preventDefault();delAnn(pi,(ann[pi]||[])[+t.dataset.i])}return}
    drawStart(e,d);
  });
  annDraw(d);
}
function annDraw(d){
  if(!d._g)return;const g=d._g,pi=+d.dataset.n-1,list=ann[pi]||[];g.textContent='';d._nl.textContent='';
  list.forEach((a,i)=>{
    if(a.t==='hl'){
      const q=NS('g',{class:'hl','data-i':i});
      a.r.forEach(r=>q.appendChild(NS('rect',{x:r[0],y:r[1],width:r[2],height:r[3],fill:a.c,'fill-opacity':.4,style:'mix-blend-mode:multiply'})));
      g.appendChild(q);
    }else if(a.t==='ink'){
      const dd=pathD(a.p);
      g.appendChild(NS('path',{d:dd,fill:'none',stroke:a.c,'stroke-width':a.w,'stroke-opacity':a.a,'stroke-linecap':'round','stroke-linejoin':'round'}));
      g.appendChild(NS('path',{class:'hit','data-i':i,d:dd,fill:'none',stroke:'transparent','stroke-width':Math.max(a.w,14),'stroke-linecap':'round','stroke-linejoin':'round'}));
    }else if(a.t==='text'){
      const p=fwd(d,a.x,a.y),el=document.createElement('div');el.className='tx';el.textContent=a.s;
      el.style.cssText='left:'+p[0]*d._s+'px;top:'+p[1]*d._s+'px;font-size:'+a.z*d._s+'px;color:'+a.c;
      el.addEventListener('pointerdown',e=>{if(tool==='er'){e.preventDefault();delAnn(pi,a)}});
      el.addEventListener('click',()=>{if(tool==='tx')editText(el,pi,a)});
      d._nl.appendChild(el);
    }else if(a.t==='sig'){
      const p=fwd(d,a.x,a.y),s=d._s,im=document.createElement('img');im.className='sg';im.src=a.img;im.alt='Signature';im.draggable=false;
      im.style.cssText='left:'+p[0]*s+'px;top:'+p[1]*s+'px;width:'+a.w*s+'px;height:'+a.h*s+'px';
      im.addEventListener('pointerdown',e=>{if(tool==='er'){e.preventDefault();delAnn(pi,a);return}sgDrag(e,im,d,pi,a)});
      d._nl.appendChild(im);
    }else if(a.t==='note'){
      const p=fwd(d,a.x,a.y),b=document.createElement('button');b.className='nt';
      b.style.left=p[0]*d._s+'px';b.style.top=p[1]*d._s+'px';b.style.background=a.c;b.setAttribute('aria-label','Note');
      b.innerHTML='<img class="ic" src="'+icoSrc('note')+'" alt="">';
      const tx=document.createElement('span');tx.className='ntx';tx.textContent=a.s;b.appendChild(tx);
      b.onclick=e=>{e.stopPropagation();if(tool==='er')delAnn(pi,a);else b.classList.toggle('open')};
      d._nl.appendChild(b);
    }
  });
}
function drawStart(e,d){
  if(!['pen','mk','note','tx','sig'].includes(tool))return;
  if((tool==='tx'||tool==='sig')&&rot!==0){e.preventDefault();return msg('Rotate the page back to 0° first')}
  e.preventDefault();const svg=d._svg;
  const pt=ev=>{const r=svg.getBoundingClientRect(),vb=svg.viewBox.baseVal;return inv(d,(ev.clientX-r.left)*vb.width/r.width,(ev.clientY-r.top)*vb.height/r.height)};
  const pi=+d.dataset.n-1;
  if(tool==='tx'){e.preventDefault();const p=pt(e);setTimeout(()=>startText(d,pi,p),0);return}
  if(tool==='sig'){e.preventDefault();if(!sigImg)return;const p=pt(e),w=({2:110,4:160,8:240})[wid]||160,h=w*sigImg.h/sigImg.w;addAnn(pi,{t:'sig',x:p[0]-w/2,y:p[1]-h/2,w,h,img:sigImg.url});setTool('sig');return}
  if(tool==='note'){const p=pt(e);setTimeout(()=>openNote(pi,p),0);return}
  const w=tool==='mk'?wid*3.5:wid,al=tool==='mk'?.35:1,c=col,pts=[pt(e)];
  const path=NS('path',{fill:'none',stroke:c,'stroke-width':w,'stroke-opacity':al,'stroke-linecap':'round','stroke-linejoin':'round'});
  d._g.appendChild(path);path.setAttribute('d',pathD(pts.length<2?[pts[0],[pts[0][0]+.01,pts[0][1]]]:pts));
  svg.setPointerCapture(e.pointerId);
  const mv=ev=>{const p=pt(ev),l=pts[pts.length-1];if(Math.hypot(p[0]-l[0],p[1]-l[1])>.6){pts.push(p);path.setAttribute('d',pathD(pts))}};
  const up=()=>{svg.removeEventListener('pointermove',mv);svg.removeEventListener('pointerup',up);svg.removeEventListener('pointercancel',up);path.remove();
    if(pts.length===1)pts.push([pts[0][0]+.01,pts[0][1]]);addAnn(pi,{t:'ink',c,w,a:al,p:pts})};
  svg.addEventListener('pointermove',mv);svg.addEventListener('pointerup',up);svg.addEventListener('pointercancel',up);
}
let noteAt=null;
function openNote(pi,p){noteAt={pi,p};$('nti').value='';modal($('ntd'));setTimeout(()=>$('nti').focus(),30)}
$('ntf').onsubmit=e=>{e.preventDefault();const s=$('nti').value.trim();$('ntd').close();if(s&&noteAt)addAnn(noteAt.pi,{t:'note',c:col,x:noteAt.p[0],y:noteAt.p[1],s});noteAt=null};
$('ntc').onclick=()=>$('ntd').close();
function addAnn(pi,a){(ann[pi]=ann[pi]||[]).push(a);hist.push({k:'add',pi,a});redoS.length=0;changed(pi)}
function delAnn(pi,a){const l=ann[pi]||[],i=l.indexOf(a);if(i<0)return;l.splice(i,1);hist.push({k:'del',pi,a,i});redoS.length=0;changed(pi)}
function undo(){const o=hist.pop();if(!o)return;const l=ann[o.pi]=ann[o.pi]||[];if(o.k==='mod')Object.assign(o.a,o.old);else if(o.k==='add')l.splice(l.indexOf(o.a),1);else l.splice(o.i,0,o.a);redoS.push(o);changed(o.pi)}
function redo(){const o=redoS.pop();if(!o)return;const l=ann[o.pi]=ann[o.pi]||[];if(o.k==='mod')Object.assign(o.a,o.nw);else if(o.k==='add')l.push(o.a);else l.splice(l.indexOf(o.a),1);hist.push(o);changed(o.pi)}
function modAnn(pi,a,patch){const old={};for(const k in patch)old[k]=a[k];Object.assign(a,patch);hist.push({k:'mod',pi,a,old,nw:patch});redoS.length=0;changed(pi)}
let sv;
function changed(pi){
  const d=pagesEl.children[pi];if(d&&d._done)annDraw(d);renderNotes();
  $('undo').disabled=!hist.length;$('redo').disabled=!redoS.length;
  if(!toasted){toasted=true;msg('Annotations are saved in this browser')}
  clearTimeout(sv);sv=setTimeout(()=>{if(!fp)return;try{Object.values(ann).some(l=>l&&l.length)?localStorage.setItem('folix.ann.'+fp,JSON.stringify(ann)):localStorage.removeItem('folix.ann.'+fp)}catch(e){msg('Could not save: browser storage is full')}},300);
}
function initAnn(){
  fp=(pdf.fingerprints&&pdf.fingerprints[0])||null;ann={};hist.length=0;redoS.length=0;
  if(fp)try{ann=JSON.parse(localStorage.getItem('folix.ann.'+fp)||'{}')}catch(e){ann={}}
  $('undo').disabled=true;$('redo').disabled=true;renderNotes();
}
function syncUI(){
  document.querySelectorAll('.abar [data-tool]').forEach(b=>{const o=b.dataset.tool===tool;b.classList.toggle('on',o);b.setAttribute('aria-pressed',o)});
  document.querySelectorAll('.sw').forEach(b=>b.classList.toggle('on',b.dataset.c===col));
  document.querySelectorAll('#wds button').forEach(b=>b.classList.toggle('on',+b.dataset.w===wid));
}
function setTool(t){
  tool=tool===t?null:t;main.dataset.tl=tool||'';
  if(tool&&!picked&&defC[tool])col=defC[tool];
  syncUI();
  if(tool==='sig'){openSig();return}
  if(tool&&matchMedia('(pointer:coarse)').matches&&tool!=='hl')msg('Tap the tool again to scroll');
}
document.querySelectorAll('.abar [data-tool]').forEach(b=>b.onclick=()=>setTool(b.dataset.tool));
document.querySelectorAll('.sw').forEach(b=>b.onclick=()=>{col=b.dataset.c;picked=true;syncUI()});
document.querySelectorAll('#wds button').forEach(b=>b.onclick=()=>{wid=+b.dataset.w;syncUI()});
$('ann').onclick=()=>{const o=$('abar').classList.toggle('hide')===false;$('ann').classList.toggle('on',o);$('ann').setAttribute('aria-pressed',o);if(!o&&tool)setTool(tool);else syncUI()};
$('undo').onclick=undo;$('redo').onclick=redo;
// text highlight: select text with the Highlight tool on
function applyHl(){
  const sel=getSelection();if(!sel||sel.isCollapsed||!sel.rangeCount)return;
  const rs=[...sel.getRangeAt(0).getClientRects()].filter(r=>r.width>1&&r.height>1),by={},seen=new Set();
  [...pagesEl.children].forEach(d=>{
    if(!d._done||!d._svg)return;const pr=d.getBoundingClientRect(),s=d._s;
    rs.forEach(r=>{
      const cx=r.left+r.width/2,cy=r.top+r.height/2;
      if(cx<pr.left||cx>pr.right||cy<pr.top||cy>pr.bottom||r.height>pr.height*.15)return;
      const k=d.dataset.n+':'+Math.round(r.left/2)+':'+Math.round(r.top/2)+':'+Math.round(r.width/2);if(seen.has(k))return;seen.add(k);
      const a=inv(d,(r.left-pr.left)/s,(r.top-pr.top)/s),b=inv(d,(r.right-pr.left)/s,(r.bottom-pr.top)/s);
      (by[d.dataset.n-1]=by[d.dataset.n-1]||[]).push([Math.min(a[0],b[0]),Math.min(a[1],b[1]),Math.abs(a[0]-b[0]),Math.abs(a[1]-b[1])]);
    });
  });
  const ks=Object.keys(by);if(!ks.length)return;
  const stxt=sel.toString().replace(/\s+/g,' ').trim().slice(0,90);ks.forEach(k=>addAnn(+k,{t:'hl',c:col,r:by[k],txt:stxt}));sel.removeAllRanges();
}
let lastPT='mouse',hlT;
main.addEventListener('pointerdown',e=>{lastPT=e.pointerType},{passive:true});
main.addEventListener('pointerup',e=>{if(tool==='hl'&&e.pointerType!=='touch')setTimeout(applyHl,30)});
document.addEventListener('selectionchange',()=>{if(tool==='hl'&&lastPT==='touch'){clearTimeout(hlT);hlT=setTimeout(applyHl,700)}});
document.addEventListener('keydown',e=>{
  if(!pdf)return;
  if(e.key==='Escape'&&tool&&!document.querySelector('dialog[open]'))return setTool(tool);
  if((e.ctrlKey||e.metaKey)&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName)){
    const k=e.key.toLowerCase();
    if(k==='z'&&!e.shiftKey){e.preventDefault();undo()}else if(k==='y'||(k==='z'&&e.shiftKey)){e.preventDefault();redo()}
  }
});
// save a copy with annotations flattened in (pdf-lib loads only now)
const hexRgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255);
function wrapText(t,font,sz,mw){const out=[];t.split('\n').forEach(par=>{let line='';par.split(' ').forEach(w=>{const tt=line?line+' '+w:w;if(font.widthOfTextAtSize(tt,sz)>mw&&line){out.push(line);line=w}else line=tt});out.push(line)});return out}
const hasAnn=()=>Object.values(ann).some(l=>l&&l.length);
async function ensurePdfLib(){if(!window.PDFLib)await new Promise((ok,no)=>{const s=document.createElement('script');s.src=C.pdfLibSrc;s.onload=ok;s.onerror=no;document.head.appendChild(s)})}
const formDirty=()=>!!(pdf&&pdf.annotationStorage&&pdf.annotationStorage.size>0);
async function formBytes(){if(formDirty()){try{return await pdf.saveDocument()}catch(e){console.error(e)}}return bytes}
async function outputBytes(){
  let data=await formBytes(),edited=data!==bytes;
  if(hasAnn()){const out=await buildAnnotated(data);if(!out)return null;data=out;edited=true}
  return {data,edited};
}
async function buildAnnotated(base){
  try{
    await ensurePdfLib();
    const {PDFDocument,rgb,StandardFonts,LineCapStyle}=window.PDFLib;
    let doc;try{doc=await PDFDocument.load(base||bytes)}catch(e){msg('Locked PDFs cannot include annotations');return null}
    const font=await doc.embedFont(StandardFonts.Helvetica),pgs=doc.getPages();
    for(const k of Object.keys(ann)){
      const list=ann[k];if(!list||!list.length||!pgs[+k])continue;
      const pj=await pdf.getPage(+k+1),vp=pj.getViewport({scale:1}),P=(x,y)=>vp.convertToPdfPoint(x,y),pg=pgs[+k];
      for(const a of list){
        const c=rgb(...hexRgb(a.c||'#000000'));
        if(a.t==='ink'){const q=a.p.map(t=>P(t[0],t[1]));pg.drawSvgPath('M'+q.map(t=>t[0].toFixed(2)+' '+(-t[1]).toFixed(2)).join('L'),{x:0,y:0,borderColor:c,borderWidth:a.w,borderOpacity:a.a,borderLineCap:LineCapStyle.Round})}
        else if(a.t==='hl'){a.r.forEach(r=>{const p1=P(r[0],r[1]),p2=P(r[0]+r[2],r[1]+r[3]);pg.drawRectangle({x:Math.min(p1[0],p2[0]),y:Math.min(p1[1],p2[1]),width:Math.abs(p1[0]-p2[0]),height:Math.abs(p1[1]-p2[1]),color:c,opacity:.4,borderWidth:0})})}
        else if(a.t==='text'){const p=P(a.x,a.y),sz=a.z;a.s.replace(/[^\x20-\x7E\n]/g,'?').split('\n').forEach((ln,i)=>pg.drawText(ln,{x:p[0],y:p[1]-sz*.85-i*sz*1.2,size:sz,font,color:c}))}
        else if(a.t==='sig'){const im=await doc.embedPng(a.img),p1=P(a.x,a.y),p2=P(a.x+a.w,a.y+a.h);pg.drawImage(im,{x:Math.min(p1[0],p2[0]),y:Math.min(p1[1],p2[1]),width:Math.abs(p1[0]-p2[0]),height:Math.abs(p1[1]-p2[1])})}
        else if(a.t==='note'){
          const p=P(a.x,a.y),lines=wrapText(a.s.replace(/[^\x20-\x7E\n]/g,'?'),font,9,150),bh=lines.length*11+8;
          pg.drawRectangle({x:p[0],y:p[1]-14,width:14,height:14,color:c,borderColor:rgb(.04,.04,.04),borderWidth:1.5});
          pg.drawRectangle({x:p[0]+18,y:p[1]-bh+2,width:166,height:bh,color:rgb(1,1,1),borderColor:rgb(.04,.04,.04),borderWidth:1.5});
          lines.forEach((ln,i)=>pg.drawText(ln,{x:p[0]+24,y:p[1]-9-i*11,size:9,font,color:rgb(.04,.04,.04)}));
        }
      }
    }
    return await doc.save();
  }catch(e){console.error(e);msg('Could not build the annotated PDF');return null}
}
function downloadBytes(data,fname){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type:'application/pdf'}));a.download=fname;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000)}
const baseName=()=>name.replace(/\.pdf$/i,'');
$('asave').onclick=async()=>{
  if(!pdf)return;
  if(!hasAnn()&&!formDirty())return msg('Nothing to save yet. Add an annotation or fill a form field first');
  msg('Preparing PDF…');const o=await outputBytes();
  if(o){downloadBytes(o.data,baseName()+'-edited.pdf');msg('Saved a copy with your changes')}
};
// share the PDF through the system share sheet (with your annotations and form entries if any)
$('share').onclick=async()=>{
  if(!pdf)return;
  let data=bytes,fname=baseName()+'.pdf';
  if(hasAnn()||formDirty()){msg('Preparing PDF with your changes…');const o=await outputBytes();if(o&&o.edited){data=o.data;fname=baseName()+'-edited.pdf'}}
  const file=new File([data],fname,{type:'application/pdf'});
  if(navigator.canShare&&navigator.canShare({files:[file]})){
    try{await navigator.share({files:[file],title:fname})}catch(e){if(e&&e.name!=='AbortError')msg('Could not share this file')}
  }else{downloadBytes(data,fname);msg('Sharing is not available in this browser, so the PDF was downloaded')}
};
// ---------- remember last page ----------
let lastT;
let keepZoom=true;try{keepZoom=localStorage.getItem('folix.keepzoom')!=='0'}catch(e){}
const kzLabel=()=>{$('kz').textContent='Reopen at last zoom: '+(keepZoom?'ON':'OFF')};
$('kz').onclick=()=>{keepZoom=!keepZoom;try{localStorage.setItem('folix.keepzoom',keepZoom?'1':'0')}catch(e){}kzLabel()};kzLabel();
function saveLast(){if(!fp)return;clearTimeout(lastT);lastT=setTimeout(()=>{try{localStorage.setItem('folix.last.'+fp,JSON.stringify({p:cur,m:fitMode,s:+scale.toFixed(3)}))}catch(e){}},400)}
function restoreLast(){
  if(!fp)return;let o=null;
  try{const v=localStorage.getItem('folix.last.'+fp);o=v?(v[0]==='{'?JSON.parse(v):{p:+v}):null}catch(e){}
  if(!o)return;
  if(keepZoom){if(o.m==='h')fitHeight();else if(o.m==='c')fitContent();else if(o.m===null&&o.s)setScale(o.s)}
  if(o.p>1&&o.p<=pdf.numPages){go(o.p);msg('Resumed on page '+o.p)}
}
// ---------- double-tap zoom (touch) ----------
let tapT=0,tapX=0,tapY=0,tmoved=false;
main.addEventListener('touchstart',()=>{tmoved=false},{passive:true});
main.addEventListener('touchmove',()=>{tmoved=true},{passive:true});
main.addEventListener('touchend',e=>{
  if(!pdf||tool||tmoved||e.touches.length||e.changedTouches.length!==1)return;
  const t=e.changedTouches[0],now=Date.now();
  if(now-tapT<320&&Math.hypot(t.clientX-tapX,t.clientY-tapY)<40){tapT=0;e.preventDefault();dtZoom(t.clientX,t.clientY)}
  else{tapT=now;tapX=t.clientX;tapY=t.clientY}
},{passive:false});
function dtZoom(cx,cy){
  const r=main.getBoundingClientRect(),x=cx-r.left,y=cy-r.top,a=anchorAt(x,y);
  const fw=(main.clientWidth-24-(two?24:0))/(pp()*bw());
  setScale(scale<fw*1.4?Math.min(fw*2.5,C.maxScale):fw);scrollToAnchor(a,x,y);
}
// ---------- text boxes + signature ----------
const txSize=()=>wid===2?12:wid===4?16:24;
function startText(d,pi,p){
  const q=fwd(d,p[0],p[1]),z=txSize(),el=document.createElement('div'),c=col;
  el.className='tx edit';el.contentEditable='true';el.spellcheck=false;
  el.style.cssText='left:'+q[0]*d._s+'px;top:'+q[1]*d._s+'px;font-size:'+z*d._s+'px;color:'+c;
  d._nl.appendChild(el);el.focus();let done=false;
  el.addEventListener('blur',()=>{if(done)return;done=true;const s=el.innerText.replace(/\s+$/,'');el.remove();if(s)addAnn(pi,{t:'text',c,x:p[0],y:p[1],s,z})});
  el.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();el.blur()}e.stopPropagation()});
}
function editText(el,pi,a){
  if(el.isContentEditable)return;el.contentEditable='true';el.classList.add('edit');el.focus();{const rg=document.createRange();rg.selectNodeContents(el);rg.collapse(false);const sl=getSelection();sl.removeAllRanges();sl.addRange(rg)}
  el.onkeydown=e=>{if(e.key==='Escape'){e.preventDefault();el.blur()}e.stopPropagation()};
  el.onblur=()=>{const s=el.innerText.replace(/\s+$/,'');if(!s)delAnn(pi,a);else if(s!==a.s)modAnn(pi,a,{s});else{el.contentEditable='false';el.classList.remove('edit')}};
}
function sgDrag(e,im,d,pi,a){
  e.preventDefault();im.setPointerCapture(e.pointerId);
  const sx=e.clientX,sy=e.clientY,l0=parseFloat(im.style.left),t0=parseFloat(im.style.top);
  const mv=ev=>{im.style.left=l0+ev.clientX-sx+'px';im.style.top=t0+ev.clientY-sy+'px'};
  const up=ev=>{
    im.removeEventListener('pointermove',mv);im.removeEventListener('pointerup',up);im.removeEventListener('pointercancel',up);
    const dx=(ev.clientX-sx)/d._s,dy=(ev.clientY-sy)/d._s;if(Math.abs(dx)+Math.abs(dy)<.5)return;
    const f=fwd(d,a.x,a.y),p=inv(d,f[0]+dx,f[1]+dy);modAnn(pi,a,{x:p[0],y:p[1]});
  };
  im.addEventListener('pointermove',mv);im.addEventListener('pointerup',up);im.addEventListener('pointercancel',up);
}
let sigImg=null,savedSig=null,sgMode='draw',sgDown=false,sgInk=false;
const sgd=$('sgd'),sgc=$('sgc'),sgx=sgc.getContext('2d');
sgx.lineWidth=4;sgx.lineCap='round';sgx.lineJoin='round';sgx.strokeStyle='#0a0a0a';
function trimCanvas(src){
  const w=src.width,h=src.height,px=src.getContext('2d').getImageData(0,0,w,h).data;let x0=w,y0=h,x1=-1,y1=-1;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(px[(y*w+x)*4+3]>8){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
  if(x1<0)return null;const pad=8,cw=x1-x0+1,ch=y1-y0+1,o=document.createElement('canvas');o.width=cw+pad*2;o.height=ch+pad*2;
  o.getContext('2d').drawImage(src,x0,y0,cw,ch,pad,pad,cw,ch);return {url:o.toDataURL('image/png'),w:o.width,h:o.height};
}
async function typedSig(){
  const t=$('sgi').value.trim();if(!t)return null;
  try{await document.fonts.load('600 90px "Dancing Script"')}catch(e){}
  const c=document.createElement('canvas');c.width=900;c.height=220;const x=c.getContext('2d');
  x.font='600 90px "Dancing Script",cursive';x.fillStyle='#0a0a0a';x.fillText(t,20,150);return trimCanvas(c);
}
function sgTab(m){sgMode=m;$('sgtd').classList.toggle('on',m==='draw');$('sgtt').classList.toggle('on',m==='type');$('sgdraw').classList.toggle('hide',m!=='draw');$('sgtype').classList.toggle('hide',m!=='type');$('sgerr').textContent=''}
function openSig(){
  savedSig=null;try{savedSig=JSON.parse(localStorage.getItem('folix.sig')||'null')}catch(e){}
  $('sgsaved').classList.toggle('hide',!savedSig);if(savedSig)$('sgimg').src=savedSig.url;
  sgx.clearRect(0,0,sgc.width,sgc.height);sgInk=false;$('sgi').value='';$('sgprev').textContent='';sgTab('draw');modal(sgd);
}
const sgPt=e=>{const r=sgc.getBoundingClientRect();return [(e.clientX-r.left)*sgc.width/r.width,(e.clientY-r.top)*sgc.height/r.height]};
sgc.addEventListener('pointerdown',e=>{e.preventDefault();sgc.setPointerCapture(e.pointerId);sgDown=true;sgInk=true;const p=sgPt(e);sgx.beginPath();sgx.moveTo(p[0],p[1]);sgx.lineTo(p[0]+.1,p[1]);sgx.stroke()});
sgc.addEventListener('pointermove',e=>{if(!sgDown)return;const p=sgPt(e);sgx.lineTo(p[0],p[1]);sgx.stroke();sgx.beginPath();sgx.moveTo(p[0],p[1])});
['pointerup','pointercancel'].forEach(t=>sgc.addEventListener(t,()=>{sgDown=false}));
$('sgclr').onclick=()=>{sgx.clearRect(0,0,sgc.width,sgc.height);sgInk=false};
$('sgtd').onclick=()=>sgTab('draw');$('sgtt').onclick=()=>{sgTab('type');$('sgi').focus()};
$('sgi').oninput=async()=>{const r=await typedSig();$('sgprev').innerHTML='';if(r){const im=new Image();im.src=r.url;$('sgprev').appendChild(im)}};
$('sguse').onclick=()=>{if(savedSig){sigImg=savedSig;sgd.close();msg('Click the page where the signature goes')}};
$('sgx').onclick=()=>sgd.close();
$('sgf').onsubmit=async e=>{
  e.preventDefault();const r=sgMode==='draw'?(sgInk?trimCanvas(sgc):null):await typedSig();
  if(!r){$('sgerr').textContent=sgMode==='draw'?'Draw your signature first.':'Type your name first.';return}
  sigImg=r;try{localStorage.setItem('folix.sig',JSON.stringify(r))}catch(x){}sgd.close();msg('Click the page where the signature goes');
};
sgd.addEventListener('close',()=>{if(tool==='sig'&&!sigImg)setTool('sig')});
// ---------- keyboard shortcuts help + single-key shortcuts ----------
const hk=$('hk');
[$('hkb'),$('hkb2')].forEach(b=>b&&(b.onclick=()=>{closePops();hk.showModal()}));$('hkx').onclick=()=>hk.close();
document.addEventListener('keydown',e=>{
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  const t=document.activeElement,typing=t&&(/INPUT|TEXTAREA|SELECT/.test(t.tagName)||t.isContentEditable);
  if(typing||document.querySelector('dialog[open]'))return;
  if(e.key==='?'){e.preventDefault();hk.showModal();return}
  if(!pdf)return;
  const f=({w:()=>fitWidth(),h:fitHeight,r:()=>$('rot').click(),t:nextTheme,'2':()=>$('two').click(),s:()=>$('sb').click(),a:()=>$('ann').click(),g:gotoPage,v:()=>$('tts').click(),c:()=>$('trim').click(),e:()=>$('ptb').click(),l:()=>$('spotb').click(),'[':()=>spOn&&spSize(spR-30),']':()=>spOn&&spSize(spR+30)})[e.key.toLowerCase()];
  if(f){e.preventDefault();f()}
});
// ---------- spotlight night reading: page goes dark, only a soft circle follows the pointer ----------
const spot=$('spot'),sdot=spot.firstElementChild,spctl=$('spctl');
let spOn=false,spR=170,spx=0,spy=0,spRaf=0;
try{spR=Math.min(420,Math.max(80,+localStorage.getItem('folix.spotr')||170))}catch(e){}
function spDraw(){spRaf=0;sdot.style.transform='translate3d('+(spx-spR)+'px,'+(spy-spR)+'px,0)'}
function spSize(n){spR=Math.min(420,Math.max(80,n));spot.style.setProperty('--sr',spR+'px');try{localStorage.setItem('folix.spotr',spR)}catch(e){}spDraw()}
function spMove(cx,cy){const r=spot.getBoundingClientRect();spx=cx-r.left;spy=cy-r.top;if(!spRaf)spRaf=requestAnimationFrame(spDraw)}
function setSpot(o,save){
  spOn=o;main.dataset.spot=o?'1':'';document.body.dataset.spot=o?'1':'';if(th==='light'&&ctxFilter&&pdf&&io)resetPages(false,true);spot.classList.toggle('hide',!o);spctl.classList.toggle('hide',!o);
  $('spotb').classList.toggle('on',o);$('spotb').setAttribute('aria-pressed',o);
  if(save)try{localStorage.setItem('folix.spot',o?'1':'0')}catch(e){}
  if(o){const r=spot.getBoundingClientRect();if(!spx&&!spy){spx=r.width/2;spy=r.height/3}spot.style.setProperty('--sr',spR+'px');spDraw();if(save)msg('Spotlight on. Move your mouse or finger to read')}
}
function initSpot(){let v=false;try{v=localStorage.getItem('folix.spot')==='1'}catch(e){}setSpot(v,false)}
let awT;[$('chrome'),$('side')].forEach(el=>el.addEventListener('pointerdown',()=>{if(!spOn)return;el.classList.add('awake');clearTimeout(awT);awT=setTimeout(()=>el.classList.remove('awake'),3000)}));
$('spotb').onclick=()=>setSpot(!spOn,true);$('spx').onclick=()=>setSpot(false,true);
$('spm').onclick=()=>spSize(spR-30);$('spp').onclick=()=>spSize(spR+30);
addEventListener('pointermove',e=>{if(spOn&&e.pointerType!=='touch')spMove(e.clientX,e.clientY)},{passive:true});
['touchstart','touchmove'].forEach(t=>addEventListener(t,e=>{if(spOn&&e.touches[0])spMove(e.touches[0].clientX,e.touches[0].clientY)},{passive:true}));
// ---------- text index (used by search, read aloud and highlights) ----------
const TX=new Map();
async function pageText(n){
  if(TX.has(n)){const v=TX.get(n);TX.delete(n);TX.set(n,v);return v}
  const my=pdf;if(!my)return null;
  const pg=await my.getPage(n),tc=await pg.getTextContent();
  if(my!==pdf)return null;
  const strs=[],its=[];tc.items.forEach(it=>{if(it.str!==undefined){strs.push(it.str);its.push(it)}});
  let norm='',disp='',last=' ';const io=[],oo=[];
  const emit=(lo,orig,i,k)=>{norm+=lo;disp+=orig;io.push(i);oo.push(k);last=lo};
  for(let i=0;i<strs.length;i++){
    const s=strs[i],it=its[i];
    if(i>0&&last!==' '){
      const p=its[i-1],f=Math.abs(it.transform[3])||it.height||10;
      if(p.hasEOL||Math.abs(it.transform[5]-p.transform[5])>f*.5||it.transform[4]-(p.transform[4]+p.width)>f*.12)emit(' ',' ',i,-1);
    }
    for(let k=0;k<s.length;k++){
      const c=s[k];
      if(/\s/.test(c)){if(last!==' ')emit(' ',' ',i,k)}
      else{const lo=c.toLowerCase();if(lo.length===1)emit(lo,c,i,k);else for(const ch of lo)emit(ch,ch,i,k)}
    }
  }
  const v={norm,disp,itemOf:Int32Array.from(io),offOf:Int32Array.from(oo),strs};
  TX.set(n,v);if(TX.size>80)TX.delete(TX.keys().next().value);return v;
}
function rangesFor(tl,v,s,e){
  const out=[],divs=tl._divs||[];let i0=-1,a=0,b=0;
  const flush=()=>{if(i0<0)return;const nd=divs[i0]&&divs[i0].firstChild;if(nd&&nd.nodeType===3){try{const r=document.createRange();r.setStart(nd,Math.min(a,nd.length));r.setEnd(nd,Math.min(b,nd.length));out.push(r)}catch(x){}}i0=-1};
  for(let k=s;k<e&&k<v.norm.length;k++){const i=v.itemOf[k],o=v.offOf[k];if(o<0)continue;if(i!==i0){flush();i0=i;a=o;b=o+1}else b=o+1}
  flush();return out;
}
const tlOf=n=>{const d=pagesEl.children[n-1],tl=d&&d._done&&d.querySelector('.textLayer');return tl&&tl._done?tl:null};
async function waitTl(n,ms){const t0=performance.now();while(performance.now()-t0<(ms||4000)){const tl=tlOf(n);if(tl)return tl;await new Promise(z=>setTimeout(z,60))}return null}
// ---------- search: results list, exact highlights, next / previous ----------
let sQ='',sRes=[],sCur=-1,sRun=0,sBy=new Map(),hlTm=0;
function updCnt(){$('cnt').textContent=sRes.length?(sCur+1)+'/'+sRes.length:'';$('sprev').disabled=$('snext').disabled=!sRes.length}
function sReset(){sQ='';sRes=[];sCur=-1;sRun++;sBy=new Map();updCnt();if(window.CSS&&CSS.highlights){CSS.highlights.delete('fx-hit');CSS.highlights.delete('fx-cur')}$('results').textContent='';$('q').value=''}
async function search(){
  const raw=$('q').value.trim().toLowerCase().replace(/\s+/g,' '),run=++sRun;
  sQ=raw;sRes=[];sCur=-1;sBy=new Map();renderResults();hlSoon();updCnt();
  if(!raw||!pdf)return;
  const my=pdf;$('cnt').textContent='…';
  for(let n=1;n<=my.numPages;n++){
    const v=await pageText(n);if(!v||run!==sRun||my!==pdf)return;
    let k=v.norm.indexOf(raw);
    while(k>-1&&sRes.length<3000){
      const r={p:n,s:k,e:k+raw.length,a:v.disp.slice(Math.max(0,k-32),k),m:v.disp.slice(k,k+raw.length),z:v.disp.slice(k+raw.length,k+raw.length+44)};
      sRes.push(r);(sBy.get(n)||sBy.set(n,[]).get(n)).push(r);k=v.norm.indexOf(raw,k+raw.length);
    }
    if(n%6===0){$('cnt').textContent=sRes.length+'…';await new Promise(z=>setTimeout(z,0))}
  }
  if(run!==sRun)return;
  renderResults();
  if(!sRes.length){$('cnt').textContent='0 found';return}
  const i=sRes.findIndex(r=>r.p>=cur);stepTo(i<0?0:i);hlSoon();
}
function renderResults(){
  const box=$('results');box.textContent='';
  const note=t=>{const p=document.createElement('p');p.className='none';p.textContent=t;box.appendChild(p)};
  if(!sQ)return note('TYPE IN THE SEARCH BOX');
  if(!sRes.length)return note('NO MATCHES');
  note(sRes.length+' MATCH'+(sRes.length>1?'ES':''));
  sRes.slice(0,400).forEach((r,i)=>{
    const b=document.createElement('button');b.className='sr'+(i===sCur?' on':'');b.dataset.i=i;
    const pn=document.createElement('b');pn.textContent='p.'+r.p;b.appendChild(pn);
    b.append(document.createTextNode('…'+r.a));const m=document.createElement('mark');m.textContent=r.m;b.appendChild(m);b.append(document.createTextNode(r.z+'…'));
    b.onclick=()=>stepTo(i);box.appendChild(b);
  });
}
async function stepTo(i){
  if(!sRes.length)return;i=(i+sRes.length)%sRes.length;sCur=i;const r=sRes[i];updCnt();
  const rb0=$('results');rb0.querySelectorAll('.sr').forEach(b=>b.classList.toggle('on',+b.dataset.i===i));
  const onb=rb0.querySelector('.sr.on');if(onb&&hasSb()&&side.dataset.tab==='search'){const t=onb.offsetTop,h=rb0.clientHeight;if(t<rb0.scrollTop||t>rb0.scrollTop+h-40)rb0.scrollTop=t-40}
  if(r.p!==cur)go(r.p);
  const tl=await waitTl(r.p);if(!tl||sCur!==i)return;
  const v=await pageText(r.p);if(!v||sCur!==i)return;
  const rs=rangesFor(tl,v,r.s,r.e);if(!rs.length)return;
  if(window.CSS&&CSS.highlights)CSS.highlights.set('fx-cur',new Highlight(...rs));
  const rb=rs[0].getBoundingClientRect(),mb=main.getBoundingClientRect();
  if(rb.top<mb.top+60||rb.bottom>mb.bottom-60||rb.left<mb.left||rb.right>mb.right)main.scrollTo({top:main.scrollTop+rb.top-mb.top-main.clientHeight/3,left:Math.max(0,main.scrollLeft+rb.left-mb.left-main.clientWidth/3)});
}
function hlSoon(){clearTimeout(hlTm);hlTm=setTimeout(hlRefresh,100)}
async function hlRefresh(){
  if(!(window.CSS&&CSS.highlights)){pagesEl.querySelectorAll('.page').forEach(d=>d._done&&mark(d));return}
  const all=[];
  for(const d of pagesEl.children){
    if(!d._done)continue;const n=+d.dataset.n,rs=sBy.get(n);if(!rs||!rs.length)continue;
    const tl=d.querySelector('.textLayer');if(!tl||!tl._done)continue;
    const v=await pageText(n);if(!v)continue;rs.forEach(r=>rangesFor(tl,v,r.s,r.e).forEach(x=>all.push(x)));
  }
  if(all.length)CSS.highlights.set('fx-hit',new Highlight(...all));else CSS.highlights.delete('fx-hit');
}
$('sprev').onclick=()=>stepTo(sCur-1);$('snext').onclick=()=>stepTo(sCur+1);
$('cnt').onclick=()=>{setSidebar(true,true);setTab('search')};
// ---------- annotation list (Notes tab) ----------
const annLabel=a=>a.t==='ink'?(a.a<1?'Marker':'Drawing'):a.t==='hl'?'Highlight':a.t==='text'?'Text':a.t==='note'?'Note':'Signature';
const annPreview=a=>a.t==='hl'?(a.txt||''):(a.t==='text'||a.t==='note')?(a.s||''):'';
const annPoint=a=>a.t==='ink'?a.p[0]:a.t==='hl'?[a.r[0][0],a.r[0][1]]:[a.x,a.y];
function renderNotes(){
  const box=$('notes');box.textContent='';
  const pages=Object.keys(ann).filter(k=>ann[k]&&ann[k].length).map(Number).sort((a,b)=>a-b);
  if(!pages.length){const p=document.createElement('p');p.className='none';p.textContent='NO ANNOTATIONS YET';box.appendChild(p);return}
  pages.forEach(pi=>ann[pi].forEach(a=>{
    const row=document.createElement('div');row.className='nl2';
    const j2=document.createElement('button');j2.className='nj';const b=document.createElement('b');b.textContent='p.'+(pi+1)+' '+annLabel(a);j2.appendChild(b);j2.append(document.createTextNode(annPreview(a).slice(0,80)));
    j2.onclick=()=>jumpAnn(pi,a);
    const x=document.createElement('button');x.className='nd';x.textContent='×';x.setAttribute('aria-label','Delete annotation');x.onclick=()=>delAnn(pi,a);
    row.append(j2,x);box.appendChild(row);
  }));
}
function jumpAnn(pi,a){
  go(pi+1);
  setTimeout(()=>{try{const d=pagesEl.children[pi],p=fwd(d,...annPoint(a));main.scrollTop=d.offsetTop+p[1]*scale-main.clientHeight/3}catch(e){}},120);
}
// ---------- links and form fields inside PDFs ----------
async function goDest(dest){try{let d=dest;if(typeof d==='string')d=await pdf.getDestination(d);if(!Array.isArray(d))return;const i=typeof d[0]==='object'?await pdf.getPageIndex(d[0]):d[0];go(i+1)}catch(e){}}
const LS={externalLinkEnabled:true,externalLinkTarget:2,externalLinkRel:'noopener noreferrer',isInPresentationMode:false,eventBus:null,
  getDestinationHash:()=>'#',getAnchorUrl:()=>'#',setHash(){},
  executeNamedAction(a){if(a==='NextPage')go(cur+1);else if(a==='PrevPage')go(cur-1);else if(a==='FirstPage')go(1);else if(a==='LastPage')go(pdf.numPages)},
  navigateTo(d){goDest(d)},goToDestination(d){goDest(d)},goToPage(n){go(n)},
  addLinkAttributes(link,url){link.href=url;link.target='_blank';link.rel='noopener noreferrer'}};
// ---------- recent files (kept only in this browser) ----------
let recentOn=true;try{recentOn=localStorage.getItem('folix.recent')!=='0'}catch(e){}
function idb(){if(idb.p)return idb.p;idb.p=new Promise((ok,no)=>{if(!window.indexedDB)return no(new Error('no indexedDB'));const r=indexedDB.open('folix',1);r.onupgradeneeded=()=>r.result.createObjectStore('recent',{keyPath:'fp'});r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)});return idb.p}
const idbReq=(mode,fn)=>idb().then(db=>new Promise((ok,no)=>{const t=db.transaction('recent',mode),r=fn(t.objectStore('recent'));t.oncomplete=()=>ok(r&&r.result);t.onerror=()=>no(t.error);t.onabort=()=>no(t.error)}));
async function recentAdd(){
  if(!recentOn||!fp||!pdf||bytes.length>60e6)return;
  try{
    const pg=await pdf.getPage(1),v1=pg.getViewport({scale:1}),vp=pg.getViewport({scale:240/v1.width}),cv=document.createElement('canvas');
    cv.width=vp.width|0;cv.height=vp.height|0;
    await pg.render({canvasContext:cv.getContext('2d',{alpha:false}),viewport:vp}).promise;
    const rec={fp,name,size:bytes.length,t:Date.now(),pages:pdf.numPages,thumb:cv.toDataURL('image/jpeg',.72),blob:new Blob([bytes],{type:'application/pdf'})};
    await idbReq('readwrite',s=>s.put(rec));
    const all=await idbReq('readonly',s=>s.getAll());all.sort((a,b)=>b.t-a.t);let sum=0;const drop=[];
    all.forEach((x,i)=>{sum+=x.size;if(i>=12||sum>200e6)drop.push(x.fp)});
    if(drop.length)await idbReq('readwrite',s=>{drop.forEach(k=>s.delete(k))});
    renderRecent();
  }catch(e){console.warn('Recent files are unavailable',e)}
}
async function renderRecent(){
  const sec=$('recent');if(!sec)return;
  let list=[];try{if(recentOn)list=(await idbReq('readonly',s=>s.getAll()))||[]}catch(e){}
  list.sort((a,b)=>b.t-a.t);sec.classList.toggle('hide',!list.length);const g=$('rgrid');g.textContent='';
  list.forEach(r=>{
    const b=document.createElement('button');b.className='rc';b.type='button';
    const im=new Image();im.src=r.thumb;im.alt='';b.appendChild(im);
    const t=document.createElement('span');t.className='rt';t.textContent=r.name;b.appendChild(t);
    let lp=0;try{const v=localStorage.getItem('folix.last.'+r.fp),o=v&&(v[0]==='{'?JSON.parse(v):{p:+v});lp=(o&&o.p)||0}catch(e){}
    const m=document.createElement('span');m.className='rm';m.textContent=r.pages+' pages · '+new Date(r.t).toLocaleDateString(undefined,{day:'numeric',month:'short'})+(lp>1?' · p.'+lp:'');b.appendChild(m);
    const x=document.createElement('span');x.className='rx btn';x.setAttribute('role','button');x.setAttribute('aria-label','Remove from recent files');x.textContent='×';
    x.onclick=async e=>{e.stopPropagation();await idbReq('readwrite',s=>s.delete(r.fp));renderRecent()};b.appendChild(x);
    b.onclick=async()=>{const rec=await idbReq('readonly',s=>s.get(r.fp));if(rec)openData(new Uint8Array(await rec.blob.arrayBuffer()),rec.name)};
    g.appendChild(b);
  });
}
$('rclr').onclick=async()=>{try{await idbReq('readwrite',s=>s.clear())}catch(e){}renderRecent()};
const recLabel=()=>{$('rec').textContent='Recent files: '+(recentOn?'ON':'OFF')};
$('rec').onclick=async()=>{recentOn=!recentOn;try{localStorage.setItem('folix.recent',recentOn?'1':'0')}catch(e){}if(!recentOn){try{await idbReq('readwrite',s=>s.clear())}catch(e){}}recLabel();renderRecent()};recLabel();renderRecent();
// ---------- read aloud ----------
const tts={on:false,paused:false,tok:0,page:0,sents:[],i:0,rate:1,voice:'',noHl:false,v:null},RATES=[.8,1,1.25,1.5,2];
try{tts.rate=+localStorage.getItem('folix.ttsr')||1;tts.voice=localStorage.getItem('folix.ttsv')||''}catch(e){}
$('ttsrate').textContent=tts.rate+'×';
function ttsVoices(){
  if(!window.speechSynthesis)return;const sel=$('ttsv'),vs=speechSynthesis.getVoices(),lg=(navigator.language||'en').slice(0,2);
  const sorted=[...vs].sort((a,b)=>(b.lang.slice(0,2)===lg)-(a.lang.slice(0,2)===lg));sel.textContent='';
  sorted.forEach(v=>{const o=document.createElement('option');o.value=v.voiceURI;o.textContent=v.name+(v.lang?' ('+v.lang+')':'');sel.appendChild(o)});
  if(tts.voice&&vs.some(v=>v.voiceURI===tts.voice))sel.value=tts.voice;else if(sorted[0])tts.voice=sorted[0].voiceURI;
}
if(window.speechSynthesis){ttsVoices();if(speechSynthesis.addEventListener)speechSynthesis.addEventListener('voiceschanged',ttsVoices)}else $('tts').classList.add('hide');
function ttsSplit(text){
  const out=[];let m;const re=/[^.!?]+[.!?]*\s*/g;
  while((m=re.exec(text))){
    let raw=m[0],s=m.index;
    while(raw.trim().length>240){let cut=raw.lastIndexOf(' ',220);if(cut<60)cut=220;out.push({s,e:s+cut,txt:raw.slice(0,cut).trim()});raw=raw.slice(cut);s+=cut}
    const t=raw.trim();if(t.length>1)out.push({s,e:s+raw.trimEnd().length,txt:t});
  }
  return out;
}
const showTts=on=>{$('ttsbar').classList.toggle('hide',!on);$('tts').classList.toggle('on',on);$('tts').setAttribute('aria-pressed',on)};
function ttsStop(){tts.tok++;tts.on=false;tts.paused=false;if(window.speechSynthesis)speechSynthesis.cancel();showTts(false);if(window.CSS&&CSS.highlights)CSS.highlights.delete('fx-say')}
async function ttsStart(){
  if(!window.speechSynthesis)return msg('Read aloud is not supported in this browser');
  const sel=getSelection().toString().replace(/\s+/g,' ').trim();
  tts.tok++;speechSynthesis.cancel();tts.on=true;tts.paused=false;showTts(true);$('ttsplay').textContent='Pause';
  if(sel){tts.noHl=true;tts.page=0;tts.sents=ttsSplit(sel);tts.i=0;ttsNext();return}
  tts.noHl=false;ttsPage(cur);
}
async function ttsPage(n){
  const my=tts.tok;if(n>pdf.numPages){ttsStop();msg('Finished reading');return}
  const v=await pageText(n);if(my!==tts.tok)return;
  tts.page=n;tts.v=v;tts.sents=v?ttsSplit(v.disp):[];tts.i=0;
  if(n!==cur)go(n);
  if(!tts.sents.length)return ttsPage(n+1);
  ttsNext();
}
function ttsNext(){
  const my=tts.tok,s=tts.sents[tts.i];
  if(!s){if(tts.noHl)ttsStop();else ttsPage(tts.page+1);return}
  const u=new SpeechSynthesisUtterance(s.txt);u.rate=tts.rate;
  const vo=speechSynthesis.getVoices().find(x=>x.voiceURI===tts.voice);if(vo){u.voice=vo;u.lang=vo.lang}
  u.onstart=()=>{if(my===tts.tok&&!tts.noHl)ttsHl(s,tts.page,my)};
  u.onend=()=>{if(my!==tts.tok)return;tts.i++;ttsNext()};
  u.onerror=e=>{if(my!==tts.tok||e.error==='interrupted'||e.error==='canceled')return;tts.i++;ttsNext()};
  speechSynthesis.speak(u);
}
async function ttsHl(s,n,my){
  if(!(window.CSS&&CSS.highlights))return;const tl=await waitTl(n,2500);if(!tl||my!==tts.tok)return;
  const rs=rangesFor(tl,tts.v,s.s,s.e);if(!rs.length)return;CSS.highlights.set('fx-say',new Highlight(...rs));
  const rb=rs[0].getBoundingClientRect(),mb=main.getBoundingClientRect();
  if(rb.bottom>mb.bottom-90||rb.top<mb.top+40)main.scrollTo({top:main.scrollTop+rb.top-mb.top-main.clientHeight/3,behavior:'smooth'});
}
function ttsJump(d){if(!tts.on)return;tts.i=Math.max(0,tts.i+d);tts.tok++;speechSynthesis.cancel();tts.paused=false;$('ttsplay').textContent='Pause';setTimeout(ttsNext,60)}
$('tts').onclick=()=>tts.on?ttsStop():ttsStart();
$('ttsstop').onclick=ttsStop;$('ttsprev').onclick=()=>ttsJump(-1);$('ttsnext').onclick=()=>ttsJump(1);
$('ttsplay').onclick=()=>{if(!tts.on)return;if(tts.paused){speechSynthesis.resume();tts.paused=false;$('ttsplay').textContent='Pause'}else{speechSynthesis.pause();tts.paused=true;$('ttsplay').textContent='Play'}};
$('ttsrate').onclick=()=>{tts.rate=RATES[(RATES.indexOf(tts.rate)+1)%RATES.length];$('ttsrate').textContent=tts.rate+'×';try{localStorage.setItem('folix.ttsr',tts.rate)}catch(e){}ttsJump(0)};
$('ttsv').onchange=e=>{tts.voice=e.target.value;try{localStorage.setItem('folix.ttsv',tts.voice)}catch(x){}ttsJump(0)};
// ---------- save page as image / fit content / go to page ----------
async function pngPage(){
  if(!pdf)return;const pg=await pdf.getPage(cur),v1=pg.getViewport({scale:1}),s=Math.min(3,Math.sqrt(16e6/(v1.width*v1.height)));
  const vp=pg.getViewport({scale:s,rotation:(pg.rotate+rot)%360}),cv=document.createElement('canvas');cv.width=vp.width|0;cv.height=vp.height|0;
  await pg.render({canvasContext:cv.getContext('2d',{alpha:false}),viewport:vp}).promise;
  cv.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=baseName()+'-p'+cur+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000);msg('Saved page '+cur+' as an image')},'image/png');
}
$('png').onclick=pngPage;
let trimBox=null;
async function measureTrim(){
  if(trimBox&&trimBox.fp===fp&&fp)return trimBox;
  const my=pdf;let l=1,r=1,n=0;
  for(let i=1;i<=Math.min(my.numPages,8);i++){
    const pg=await my.getPage(i),v1=pg.getViewport({scale:1}),vp=pg.getViewport({scale:420/v1.width}),cv=document.createElement('canvas');
    cv.width=vp.width|0;cv.height=vp.height|0;const ctx=cv.getContext('2d',{alpha:false,willReadFrequently:true});
    await pg.render({canvasContext:ctx,viewport:vp}).promise;if(my!==pdf)return null;
    const W=cv.width,H=cv.height,px=ctx.getImageData(0,0,W,H).data;let x0=W,x1=-1;
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){const k=(y*W+x)*4;if(px[k]+px[k+1]+px[k+2]<690){if(x<x0)x0=x;if(x>x1)x1=x}}
    if(x1<0)continue;l=Math.min(l,x0/W);r=Math.min(r,(W-1-x1)/W);n++;
  }
  trimBox={fp,l:n?Math.max(0,l-.01):0,r:n?Math.max(0,r-.01):0};return trimBox;
}
async function fitContent(){
  if(two)return fitWidth();
  const tb=await measureTrim();if(!tb)return;const cw=(1-tb.l-tb.r)*bw();
  const fw=(main.clientWidth-16)/bw();setScale(Math.max(C.minScale,Math.min(C.maxScale,fw*1.6,(main.clientWidth-16)/cw)),true);fitMode='c';
  requestAnimationFrame(()=>{main.scrollLeft=Math.max(0,tb.l*bw()*scale-8)});
}
$('trim').onclick=()=>fitContent();
function gotoPage(){const el=$('pg');if(el.closest('#more'))$('moreb').click();setTimeout(()=>{el.focus();el.select()},40)}
// ---------- selection menu: copy, read, define, translate ----------
const sp=document.createElement('div');sp.id='selpop';sp.className='hide';
sp.innerHTML='<button data-a="copy">Copy</button><button data-a="say">Read</button><button data-a="def">Define</button><button data-a="tr">Translate</button>';document.body.appendChild(sp);
let selTxt='';
function spShow(){
  const s=getSelection();if(!pdf||tool||!s||s.isCollapsed||!s.rangeCount){sp.classList.add('hide');return}
  const n=s.anchorNode&&(s.anchorNode.nodeType===3?s.anchorNode.parentElement:s.anchorNode);
  if(!n||!n.closest||!n.closest('.textLayer')){sp.classList.add('hide');return}
  selTxt=s.toString().replace(/\s+/g,' ').trim();if(!selTxt||selTxt.length>500){sp.classList.add('hide');return}
  const r=s.getRangeAt(0).getBoundingClientRect();sp.querySelector('[data-a=def]').classList.toggle('hide',selTxt.split(' ').length>3);
  sp.classList.remove('hide');const w=sp.offsetWidth;
  sp.style.left=Math.max(8,Math.min(innerWidth-w-8,r.left+r.width/2-w/2))+'px';sp.style.top=Math.min(innerHeight-50,r.bottom+8)+'px';
}
main.addEventListener('pointerup',e=>{if(e.pointerType!=='touch')setTimeout(spShow,30)});
document.addEventListener('selectionchange',()=>{const s=getSelection();if(!s||s.isCollapsed)sp.classList.add('hide')});
sp.addEventListener('pointerdown',e=>e.preventDefault());
sp.addEventListener('click',e=>{
  const a=e.target.dataset&&e.target.dataset.a;if(!a)return;
  if(a==='copy'){if(navigator.clipboard)navigator.clipboard.writeText(selTxt).then(()=>msg('Copied'))}
  else if(a==='say')ttsStart();
  else if(a==='def')window.open('https://www.google.com/search?q='+encodeURIComponent('define '+selTxt),'_blank','noopener');
  else if(a==='tr')window.open('https://translate.google.com/?sl=auto&tl='+encodeURIComponent((navigator.language||'en').slice(0,2))+'&text='+encodeURIComponent(selTxt)+'&op=translate','_blank','noopener');
  sp.classList.add('hide');
});
// ---------- page tools: reorder, rotate, delete, extract, merge ----------
let ptCards=[],ptDocs=[],ptDrag=-1,ptQ=Promise.resolve();const ptd=$('ptd');
const ptRot=c=>c.rot?'rotate('+c.rot+'deg)'+(c.rot%180?' scale(.72)':''):'';
function ptThumb(c){
  ptQ=ptQ.then(async()=>{
    try{
      const pg=await ptDocs[c.d].p.getPage(c.i+1),v1=pg.getViewport({scale:1}),vp=pg.getViewport({scale:130/v1.width}),cv=document.createElement('canvas');
      cv.width=vp.width|0;cv.height=vp.height|0;await pg.render({canvasContext:cv.getContext('2d',{alpha:false}),viewport:vp}).promise;
      c.cv=cv;cv.style.transform=ptRot(c);const pv=c.el&&c.el.querySelector('.pv');if(pv&&!pv.firstChild)pv.appendChild(cv);
    }catch(e){}
  });
}
function ptOpen(){
  if(!pdf)return;ptDocs=[{p:pdf,bytes:null}];ptCards=[];
  for(let i=0;i<pdf.numPages;i++)ptCards.push({d:0,i,rot:0,del:false,sel:false});
  $('pterr').textContent='';ptRender();modal(ptd);
}
function ptRender(){
  const g=$('ptg');g.textContent='';
  ptCards.forEach((c,k)=>{
    const el=document.createElement('div');el.className='pc'+(c.sel?' sel':'')+(c.del?' del':'');el.draggable=true;c.el=el;
    const pv=document.createElement('div');pv.className='pv';if(c.cv){pv.appendChild(c.cv);c.cv.style.transform=ptRot(c)}else if(!c.q){c.q=true;ptThumb(c)}
    const pn=document.createElement('span');pn.className='pn';pn.textContent=(k+1)+(c.d?' (added)':'');
    const pb=document.createElement('div');pb.className='pb';
    const mk=(t,l,fn)=>{const b=document.createElement('button');b.type='button';b.textContent=t;b.setAttribute('aria-label',l);b.title=l;b.onclick=e=>{e.stopPropagation();fn()};pb.appendChild(b)};
    mk('←','Move earlier',()=>{if(k>0){[ptCards[k-1],ptCards[k]]=[ptCards[k],ptCards[k-1]];ptRender()}});
    mk('→','Move later',()=>{if(k<ptCards.length-1){[ptCards[k+1],ptCards[k]]=[ptCards[k],ptCards[k+1]];ptRender()}});
    mk('Rot','Rotate 90 degrees',()=>{c.rot=(c.rot+90)%360;ptRender()});
    mk(c.del?'Undo':'Del',c.del?'Restore page':'Delete page',()=>{c.del=!c.del;ptRender()});
    el.append(pv,pn,pb);el.onclick=()=>{c.sel=!c.sel;ptRender()};
    el.addEventListener('dragstart',e=>{ptDrag=k;e.dataTransfer.effectAllowed='move';try{e.dataTransfer.setData('text/plain',String(k))}catch(x){}});
    el.addEventListener('dragover',e=>{e.preventDefault();el.classList.add('over')});
    el.addEventListener('dragleave',()=>el.classList.remove('over'));
    el.addEventListener('drop',e=>{e.preventDefault();if(ptDrag<0||ptDrag===k)return;const m=ptCards.splice(ptDrag,1)[0];ptCards.splice(k,0,m);ptDrag=-1;ptRender()});
    g.appendChild(el);
  });
}
async function ptBase(){const o=await outputBytes();if(!o)throw new Error('Could not prepare the current document');return o.data}
async function ptBuild(list){
  await ensurePdfLib();const {PDFDocument,degrees}=window.PDFLib,out=await PDFDocument.create(),src=[];
  for(const c of list){
    if(!src[c.d]){
      const b=c.d===0?await ptBase():ptDocs[c.d].bytes;
      try{src[c.d]=await PDFDocument.load(b)}catch(e){throw new Error(c.d?'Could not read an added PDF. Locked PDFs are not supported':'Locked PDFs cannot be edited')}
    }
    const pg=(await out.copyPages(src[c.d],[c.i]))[0];if(c.rot)pg.setRotation(degrees(((pg.getRotation().angle||0)+c.rot)%360));out.addPage(pg);
  }
  return await out.save();
}
const ptRun=async fn=>{$('pterr').textContent='';const bs=ptd.querySelectorAll('.ptrow button');bs.forEach(b=>b.disabled=true);try{await fn()}catch(e){$('pterr').textContent=e.message||'Something went wrong'}bs.forEach(b=>b.disabled=false)};
$('ptapply').onclick=()=>ptRun(async()=>{const list=ptCards.filter(c=>!c.del);if(!list.length)throw new Error('Keep at least one page');const out=await ptBuild(list);ptd.close();await openData(new Uint8Array(out),baseName()+'-edited.pdf');msg('Changes applied. Use Download to save the new file')});
$('ptsave').onclick=()=>ptRun(async()=>{const list=ptCards.filter(c=>!c.del);if(!list.length)throw new Error('Keep at least one page');downloadBytes(await ptBuild(list),baseName()+'-pages.pdf')});
$('ptext').onclick=()=>ptRun(async()=>{const list=ptCards.filter(c=>c.sel&&!c.del);if(!list.length)throw new Error('Select the pages to extract first');downloadBytes(await ptBuild(list),baseName()+'-extract.pdf')});
$('ptx').onclick=()=>ptd.close();$('ptall').onclick=()=>{ptCards.forEach(c=>c.sel=true);ptRender()};$('ptnone').onclick=()=>{ptCards.forEach(c=>c.sel=false);ptRender()};
$('ptadd').onchange=async e=>{
  const f=e.target.files[0];e.target.value='';if(!f)return;
  try{const b=new Uint8Array(await f.arrayBuffer()),p=await lib.getDocument({data:b.slice(0),isEvalSupported:false}).promise;ptDocs.push({p,bytes:b});const d=ptDocs.length-1;for(let i=0;i<p.numPages;i++)ptCards.push({d,i,rot:0,del:false,sel:false});ptRender()}
  catch(x){$('pterr').textContent='Could not read that PDF. Locked PDFs are not supported'}
};
ptd.addEventListener('close',()=>{ptDocs.slice(1).forEach(x=>{try{x.p.destroy()}catch(e){}})});
$('ptb').onclick=ptOpen;
// ---------- toolbar: fits any width; extra tools move into a MORE menu ----------
const bar=document.querySelector('.bar'),moreB=$('moreb'),moreP=$('more'),mnav=$('mnav'),mbtn=$('mbtn');
const ORDER=['pin','pr','dl','share','g-tools','g-view','g-search','ann','g-zoom','sb','g-nav'];
let moved=[];
const overflows=()=>bar.scrollWidth>bar.clientWidth+1;
function closePops(){[moreP,mnav].forEach(p=>p.classList.remove('open'));moreB.setAttribute('aria-expanded','false');mbtn.setAttribute('aria-expanded','false')}
function popAt(p,anchor,right){
  const open=!p.classList.contains('open');closePops();if(!open)return;
  const r=anchor.getBoundingClientRect(),vw=document.documentElement.clientWidth;
  p.style.top=(r.bottom+6)+'px';p.style.left='8px';p.style.right='auto';
  p.classList.add('open');anchor.setAttribute('aria-expanded','true');
  if(vw<=520&&p===moreP){p.style.right='8px'}      // phones: full-width sheet under the bar
  else{const w=p.offsetWidth;p.style.left=Math.max(8,Math.min(right?r.right-w:r.left,vw-w-8))+'px'}
}
function fitBar(){
  moved.forEach(m=>{m.ph.parentNode.insertBefore(m.el,m.ph);m.ph.remove()});moved=[];
  moreB.classList.add('hide');closePops();
  if(!overflows())return;
  moreB.classList.remove('hide');
  for(const id of ORDER){
    if(!overflows())break;
    const el=$(id);if(!el)continue;
    const ph=document.createComment('');el.parentNode.insertBefore(ph,el);moreP.appendChild(el);moved.push({el,ph});
  }
  if(!moved.length)moreB.classList.add('hide');
}
moreP.addEventListener('click',e=>{const b=e.target.closest('button');if(b&&['ann','sb','dl','pr','pin','fs'].includes(b.id))closePops()});
moreB.onclick=e=>{e.stopPropagation();popAt(moreP,moreB,true)};
mbtn.onclick=e=>{e.stopPropagation();popAt(mnav,mbtn,false)};
document.addEventListener('click',e=>{if(!e.target.closest('.pop,#moreb,#mbtn'))closePops()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePops()});
let fbT;addEventListener('resize',()=>{clearTimeout(fbT);fbT=setTimeout(fitBar,80)});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fitBar);
fitBar();
// top bar: pinned (always visible) or auto-hide (hides scrolling down, returns scrolling up)
const chrome=$('chrome');let mode='pin',lastY=0;
try{mode=localStorage.getItem('folix.bar')==='auto'?'auto':'pin'}catch(e){}
function showBar(){chrome.style.marginTop='0';chrome.inert=false;$('reveal').classList.add('hide')}
function hideBar(){closePops();chrome.style.marginTop=-chrome.offsetHeight+'px';chrome.inert=true;$('reveal').classList.remove('hide')}
function applyMode(){$('pin').classList.toggle('on',mode==='pin');$('pin').setAttribute('aria-pressed',mode==='pin');$('pinl').textContent=mode==='pin'?'PINNED':'AUTO-HIDE';if(mode==='pin')showBar()}
$('pin').onclick=()=>{mode=mode==='pin'?'auto':'pin';try{localStorage.setItem('folix.bar',mode)}catch(e){}applyMode();msg(mode==='pin'?'Top bar stays visible':'Top bar hides while you scroll')};
$('reveal').onclick=showBar;
main.addEventListener('scroll',()=>{
  const y=main.scrollTop,d=y-lastY;
  if(Math.abs(d)<10)return;lastY=y;
  if(mode!=='auto'||!pdf||Date.now()<noHide)return;
  if(d>0&&y>80)hideBar();else if(d<0)showBar();
},{passive:true});
applyMode();requestAnimationFrame(fitBar);
// events
const readFile=f=>{if(!f)return;if(f.type&&f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name))return msg('Please choose a PDF');f.arrayBuffer().then(b=>openData(new Uint8Array(b),f.name))};
$('file').onchange=e=>{readFile(e.target.files[0]);e.target.value=''};
$('openl').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();$('file').click()}};
$('prev').onclick=()=>go(cur-1);$('next').onclick=()=>go(cur+1);
$('pg').onchange=e=>go(+e.target.value);
$('zi').onclick=()=>setScale(scale*1.2);$('zo').onclick=()=>setScale(scale/1.2);
$('fit').onclick=()=>fitWidth();
$('fith').onclick=fitHeight;
$('rot').onclick=()=>{rot=(rot+90)%360;setScale(scale,true,true)};
// dark reading mode (inverts page colours), remembered
themeHooks.push(()=>{$('dark').classList.toggle('on',th!=='light');$('dark').setAttribute('aria-label','Theme: '+th+' (click to change)');$('dark').title='Theme: '+th});
$('dark').onclick=nextTheme;themeHooks.push(()=>{if(pdf&&io&&ctxFilter)resetPages(false,true)});applyTheme();
// two-page view
let two=false;try{two=localStorage.getItem('folix.two')==='1'}catch(e){}
const pp=()=>two?2:1;
function applyTwo(){pagesEl.classList.toggle('two',two);$('two').classList.toggle('on',two);$('two').setAttribute('aria-pressed',two)}
$('two').onclick=()=>{two=!two;try{localStorage.setItem('folix.two',two?'1':'0')}catch(e){}applyTwo();fitWidth()};applyTwo();
// fullscreen
const de=document.documentElement;
if(!de.requestFullscreen)$('fs').classList.add('hide');
$('fs').onclick=()=>document.fullscreenElement?document.exitFullscreen():de.requestFullscreen();
document.querySelectorAll('button[aria-label]').forEach(b=>b.title=b.getAttribute('aria-label'));
let st;$('q').oninput=()=>{clearTimeout(st);st=setTimeout(search,300)};
$('q').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();stepTo(sCur+(e.shiftKey?-1:1))}};
$('dl').onclick=download;$('pr').onclick=print;
['dragover','dragenter'].forEach(t=>document.addEventListener(t,e=>{e.preventDefault();empty.classList.add('drag')}));
['dragleave','drop'].forEach(t=>document.addEventListener(t,e=>{e.preventDefault();empty.classList.remove('drag')}));
document.addEventListener('drop',e=>readFile(e.dataTransfer.files[0]));
document.addEventListener('keydown',e=>{
  if(!pdf)return;
  const typing=/INPUT/.test(document.activeElement.tagName);
  if((e.ctrlKey||e.metaKey)&&e.key==='f'){e.preventDefault();showBar();$('q').focus();$('q').select()}
  else if((e.ctrlKey||e.metaKey)&&(e.key==='='||e.key==='+')){e.preventDefault();setScale(scale*1.2)}
  else if((e.ctrlKey||e.metaKey)&&e.key==='-'){e.preventDefault();setScale(scale/1.2)}
  else if(!typing&&e.key==='ArrowRight')go(cur+1);
  else if(!typing&&e.key==='ArrowLeft')go(cur-1);
  else if(!typing&&e.key==='Home')go(1);
  else if(!typing&&e.key==='End')go(pdf.numPages);
});
// pinch zoom: pages scale smoothly under your fingers, then re-render sharp when you let go
function anchorAt(cx,cy){
  const px=main.scrollLeft+cx,py=main.scrollTop+cy,ch=pagesEl.children;let best=0,bd=1e9;
  for(let i=0;i<ch.length;i++){const e=ch[i],dy=py<e.offsetTop?e.offsetTop-py:py>e.offsetTop+e.offsetHeight?py-e.offsetTop-e.offsetHeight:0;if(dy<bd){bd=dy;best=i;if(!dy)break}}
  const e=ch[best];return e?{i:best,rx:(px-e.offsetLeft)/e.offsetWidth,ry:(py-e.offsetTop)/e.offsetHeight}:null;
}
function scrollToAnchor(a,cx,cy){
  const e=a&&pagesEl.children[a.i];if(!e)return;
  main.scrollLeft=e.offsetLeft+a.rx*e.offsetWidth-cx;main.scrollTop=e.offsetTop+a.ry*e.offsetHeight-cy;
}
let pz=null;
const tdist=t=>Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY);
const tmid=(t,r)=>[(t[0].clientX+t[1].clientX)/2-r.left,(t[0].clientY+t[1].clientY)/2-r.top];
main.addEventListener('touchstart',e=>{
  if(!pdf||e.touches.length!==2)return;
  const r=main.getBoundingClientRect(),pr=pagesEl.getBoundingClientRect(),c=tmid(e.touches,r);
  pz={d0:tdist(e.touches),s0:scale,k:1,cx:c[0],cy:c[1],a:anchorAt(c[0],c[1])};
  pagesEl.style.transformOrigin=(c[0]+r.left-pr.left)+'px '+(c[1]+r.top-pr.top)+'px';
},{passive:true});
main.addEventListener('touchmove',e=>{
  if(!pz||e.touches.length!==2)return;
  const r=main.getBoundingClientRect(),c=tmid(e.touches,r);
  pz.k=Math.min(C.maxScale/pz.s0,Math.max(C.minScale/pz.s0,tdist(e.touches)/pz.d0));pz.cx=c[0];pz.cy=c[1];
  pagesEl.style.transform='scale('+pz.k+')';
},{passive:true});
const pzEnd=e=>{
  if(!pz||e.touches.length>=2)return;const z=pz;pz=null;
  pagesEl.style.transform='';pagesEl.style.transformOrigin='';
  const ns=Math.min(C.maxScale,Math.max(C.minScale,z.s0*z.k));if(Math.abs(ns-z.s0)<.005)return;
  setScale(ns);scrollToAnchor(z.a,z.cx,z.cy);
};
main.addEventListener('touchend',pzEnd,{passive:true});main.addEventListener('touchcancel',pzEnd,{passive:true});
// trackpad pinch / Ctrl + wheel on desktop
let wz=1,wRaf=0,wA=null,wC=[0,0];
main.addEventListener('wheel',e=>{
  if(!e.ctrlKey||!pdf)return;e.preventDefault();
  const r=main.getBoundingClientRect();wC=[e.clientX-r.left,e.clientY-r.top];if(!wA)wA=anchorAt(wC[0],wC[1]);
  const dy=e.deltaMode===1?e.deltaY*33:e.deltaY;wz*=Math.abs(dy)>=40?(dy<0?1.1:1/1.1):Math.exp(-dy*.008);
  if(!wRaf)wRaf=requestAnimationFrame(()=>{wRaf=0;const ns=Math.min(C.maxScale,Math.max(C.minScale,scale*Math.min(1.5,Math.max(.67,wz))));wz=1;const a=wA;wA=null;if(Math.abs(ns-scale)>.002){setScale(ns);scrollToAnchor(a,wC[0],wC[1])}});
},{passive:false});
// installed-app integration: open-with (file handler), share target, install button
if('launchQueue' in window)launchQueue.setConsumer(async p=>{if(!p.files||!p.files.length)return;try{readFile(await p.files[0].getFile())}catch(e){msg('Could not open that file')}});
if(/[?&]shared=1/.test(location.search)&&window.caches)caches.open('folix-share').then(async c=>{
  const r=await c.match('shared-file');if(!r)return;const buf=await r.arrayBuffer(),nm=decodeURIComponent(r.headers.get('x-name')||'shared.pdf');
  await c.delete('shared-file');history.replaceState(null,'',location.pathname);openData(new Uint8Array(buf),nm);
}).catch(()=>{});
let dip=null;const inst=$('install');
addEventListener('beforeinstallprompt',e=>{e.preventDefault();dip=e;inst.classList.remove('hide')});
addEventListener('appinstalled',()=>{dip=null;inst.classList.add('hide');msg('Folix installed')});
inst.onclick=async()=>{if(!dip)return;dip.prompt();try{await dip.userChoice}catch(e){}dip=null;inst.classList.add('hide')};
const u=new URLSearchParams(location.search).get('file');
if(u)fetch(u).then(r=>r.arrayBuffer()).then(b=>openData(new Uint8Array(b),u.split('/').pop())).catch(()=>msg('Could not load that URL'));
})();
