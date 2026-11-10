/* Folix PDF Viewer - app logic (viewer runs only on index.html) */
(()=>{
const $=id=>document.getElementById(id);
const C=window.FOLIX_CONFIG;
document.querySelectorAll('[data-cfg]').forEach(e=>e.textContent=C[e.dataset.cfg]);
document.querySelectorAll('a[data-mail]').forEach(a=>a.href='mailto:'+C.email);
const cp=$('copy');if(cp)cp.onclick=()=>{(navigator.clipboard?navigator.clipboard.writeText(C.email):Promise.reject()).then(()=>{cp.textContent='Copied!'},()=>{cp.textContent=C.email});setTimeout(()=>cp.textContent='Copy email',2000)};
const burger=$('burger'),hdr=document.querySelector('.top');
if(burger)burger.onclick=()=>{const o=hdr.classList.toggle('open');burger.setAttribute('aria-expanded',o);burger.firstElementChild.src='assets/icons/'+(o?'close':'menu')+'.svg'};
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
const renderQueue=[];let activeRenders=0;
const ctrls=['prev','next','pg','zo','zi','fit','fith','rot','two','spotb','sb','ann','share','q','dl','pr'];
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
    rot=0;fitWidth(true);build();initSide();initAnn();initSpot();msg('');restoreLast();
  }catch(e){
    const was=pwCancelled;pwCancelled=false;
    msg(was?'Cancelled':'Could not open this PDF');
    if(!pdf){empty.classList.remove('hide');document.body.classList.remove('reading');requestAnimationFrame(fitBar)}
    if(!was)console.error(e);
  }
}
function build(){
  if(io)io.disconnect();
  pagesEl.innerHTML='';
  io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?render(e.target):drop(e.target)),{root:main,rootMargin:'650px 0px'});
  for(let i=1;i<=pdf.numPages;i++){
    const d=document.createElement('div');d.className='page';d.dataset.n=i;size(d);pagesEl.appendChild(d);io.observe(d);
  }
  $('zl').textContent=Math.round(scale*100)+'%';
}
const bw=()=>rot%180?base.height:base.width,bh=()=>rot%180?base.width:base.height;
function size(d){d.style.width=bw()*scale+'px';d.style.height=bh()*scale+'px'}
function render(d){
  if(d._busy||d._done)return;d._busy=true;d._drop=false;renderQueue.push(d);pumpRenders();
}
function pumpRenders(){
  while(activeRenders<2&&renderQueue.length){
    const d=renderQueue.shift();
    if(d._drop||!d.isConnected||!pdf){d._busy=false;continue}
    activeRenders++;
    renderPage(d).finally(()=>{activeRenders--;d._busy=false;if(d._drop)drop(d);pumpRenders()});
  }
}
async function renderPage(d){
  const myPdf=pdf;
  try{
    const page=await myPdf.getPage(+d.dataset.n);
    if(myPdf!==pdf)return;
    const v1=page.getViewport({scale:1});d._W=v1.width;d._H=v1.height;const vp=page.getViewport({scale,rotation:(page.rotate+rot)%360}),dpr=Math.min(window.devicePixelRatio||1,C.maxDpr);
    d.style.width=vp.width+'px';d.style.height=vp.height+'px';
    const cv=document.createElement('canvas');
    cv.width=Math.floor(vp.width*dpr);cv.height=Math.floor(vp.height*dpr);
    cv.style.width=vp.width+'px';cv.style.height=vp.height+'px';
    d.textContent='';d.appendChild(cv);
    await page.render({canvasContext:cv.getContext('2d'),viewport:vp,transform:dpr!==1?[dpr,0,0,dpr,0,0]:null}).promise;
    const tl=document.createElement('div');tl.className='textLayer';
    tl.style.setProperty('--scale-factor',scale);d.appendChild(tl);
    const tc=await page.getTextContent();
    await lib.renderTextLayer({textContentSource:tc,container:tl,viewport:vp,textDivs:[]}).promise;
    annAttach(d,vp);d._done=true;mark(d);
  }catch(e){if(e&&e.name!=='RenderingCancelledException')console.error(e)}
}
function drop(d){
  if(d._busy){d._drop=true;return}
  if(!d._done)return;
  d.textContent='';d._done=false;
}
function mark(d){
  const q=query.toLowerCase();
  d.querySelectorAll('.textLayer span').forEach(s=>s.classList.toggle('hit',!!q&&s.textContent.toLowerCase().includes(q)));
}
function setScale(s,km){
  if(!pdf)return;if(!km)fitMode=null;
  const mid=cur;scale=Math.min(C.maxScale,Math.max(C.minScale,s));
  pagesEl.querySelectorAll('.page').forEach(d=>{d._done=false;d._busy=false;d._drop=false;d.textContent='';size(d);io.unobserve(d);io.observe(d)});
  $('zl').textContent=Math.round(scale*100)+'%';
  go(mid);saveLast();
}
function fitWidth(silent){scale=Math.max(.25,Math.min(5,(main.clientWidth-24-(two?24:0))/(pp()*bw())));fitMode='w';if(!silent)setScale(scale,true)}
function fitHeight(){setScale((main.clientHeight-56)/bh(),true);fitMode='h'}
function go(n){
  n=Math.min(pdf.numPages,Math.max(1,n|0));
  noHide=Date.now()+700;const d=pagesEl.children[n-1];if(d)main.scrollTop=d.offsetTop-8;
  cur=n;$('pg').value=n;markCur();
}
let tick=false;
main.addEventListener('scroll',()=>{
  if(!pdf||tick)return;tick=true;
  requestAnimationFrame(()=>{
    tick=false;const mid=main.scrollTop+main.clientHeight/3;
    const ch=pagesEl.children;let lo=0,hi2=ch.length-1;
    while(lo<hi2){const m=(lo+hi2+1)>>1;ch[m].offsetTop<=mid?lo=m:hi2=m-1}
    while(lo>0&&ch[lo-1].offsetTop===ch[lo].offsetTop)lo--;cur=lo+1;if(document.activeElement!==$('pg'))$('pg').value=cur;markCur();saveLast();
  });
},{passive:true});

// search
async function search(){
  query=$('q').value.trim();hits=[];hi=-1;$('cnt').textContent='';
  pagesEl.querySelectorAll('.page').forEach(d=>d._done&&mark(d));
  if(!query||!pdf)return;
  const q=query.toLowerCase(),myPdf=pdf;$('cnt').textContent='…';
  for(let i=1;i<=myPdf.numPages;i++){
    const tc=await(await myPdf.getPage(i)).getTextContent();
    if(myPdf!==pdf||$('q').value.trim()!==query)return;
    const t=tc.items.map(x=>x.str).join(' ').toLowerCase();
    let k=t.indexOf(q);while(k>-1){hits.push(i);k=t.indexOf(q,k+q.length)}
  }
  $('cnt').textContent=hits.length?'':'0 found';
  if(hits.length)step(1);
}
function step(dir){
  if(!hits.length)return;
  hi=(hi+dir+hits.length)%hits.length;
  go(hits[hi]);$('cnt').textContent=(hi+1)+'/'+hits.length;
}

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
  work.classList.toggle('sb',o);$('sb').classList.toggle('on',o);$('sb').setAttribute('aria-pressed',o);
  if(save)try{localStorage.setItem('folix.side',o?'1':'0')}catch(e){}
  if(o){buildThumbs();markCur()}
}
function setTab(t){side.dataset.tab=t;$('tabp').classList.toggle('on',t==='pages');$('tabo').classList.toggle('on',t==='outline')}
$('sb').onclick=()=>setSidebar(!hasSb(),true);
$('tabp').onclick=()=>setTab('pages');$('tabo').onclick=()=>setTab('outline');
function resetSide(){fp=null;if(tio)tio.disconnect();thumbs.textContent='';outl.textContent='';thumbsFor=null;thumbsReady=false;curTh=null}
function buildThumbs(){
  if(!pdf||thumbsFor===pdf)return;thumbsFor=pdf;thumbs.textContent='';
  tio=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?thRender(e.target):thDrop(e.target)),{root:thumbs,rootMargin:'300px 0px'});
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
function thRender(el){
  if(!pdf||el._d||el._b)return;el._b=true;el._x=false;const my=pdf;
  my.getPage(+el.dataset.n).then(async pg=>{
    if(my!==pdf)return;
    const vp=pg.getViewport({scale:TW/pg.getViewport({scale:1}).width}),dpr=Math.min(devicePixelRatio||1,2);
    const cv=document.createElement('canvas');cv.width=vp.width*dpr|0;cv.height=vp.height*dpr|0;
    cv.style.width=vp.width+'px';cv.style.height=vp.height+'px';
    await pg.render({canvasContext:cv.getContext('2d'),viewport:vp,transform:dpr!==1?[dpr,0,0,dpr,0,0]:null}).promise;
    el.firstChild.textContent='';el.firstChild.appendChild(cv);el._d=true;
  }).catch(()=>{}).finally(()=>{el._b=false;if(el._x)thDrop(el)});
}
function thDrop(el){if(el._b){el._x=true;return}el._d=false;el.firstChild.textContent=''}
function markCur(){
  if(!thumbsReady)return;const el=thumbs.children[cur-1];if(!el||el===curTh)return;
  if(curTh)curTh.classList.remove('cur');curTh=el;el.classList.add('cur');
  if(hasSb()&&side.dataset.tab==='pages')el.scrollIntoView({block:'nearest'});
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
      b.innerHTML='<img src="assets/icons/note.svg" alt="">';
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
  const d=pagesEl.children[pi];if(d&&d._done)annDraw(d);
  $('undo').disabled=!hist.length;$('redo').disabled=!redoS.length;
  if(!toasted){toasted=true;msg('Annotations are saved in this browser')}
  clearTimeout(sv);sv=setTimeout(()=>{if(!fp)return;try{Object.values(ann).some(l=>l&&l.length)?localStorage.setItem('folix.ann.'+fp,JSON.stringify(ann)):localStorage.removeItem('folix.ann.'+fp)}catch(e){msg('Could not save: browser storage is full')}},300);
}
function initAnn(){
  fp=(pdf.fingerprints&&pdf.fingerprints[0])||null;ann={};hist.length=0;redoS.length=0;
  if(fp)try{ann=JSON.parse(localStorage.getItem('folix.ann.'+fp)||'{}')}catch(e){ann={}}
  $('undo').disabled=true;$('redo').disabled=true;
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
  ks.forEach(k=>addAnn(+k,{t:'hl',c:col,r:by[k]}));sel.removeAllRanges();
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
async function buildAnnotated(){
  try{
    if(!window.PDFLib)await new Promise((ok,no)=>{const s=document.createElement('script');s.src=C.pdfLibSrc;s.onload=ok;s.onerror=no;document.head.appendChild(s)});
    const {PDFDocument,rgb,StandardFonts,LineCapStyle}=window.PDFLib;
    let doc;try{doc=await PDFDocument.load(bytes)}catch(e){msg('Locked PDFs cannot include annotations');return null}
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
  if(!hasAnn())return msg('Nothing to save yet. Add an annotation first');
  msg('Preparing PDF…');const out=await buildAnnotated();
  if(out){downloadBytes(out,baseName()+'-annotated.pdf');msg('Saved a copy with your annotations')}
};
// share the PDF through the system share sheet (with your annotations if you added any)
$('share').onclick=async()=>{
  if(!pdf)return;
  let data=bytes,fname=baseName()+'.pdf';
  if(hasAnn()){msg('Preparing PDF with your annotations…');const out=await buildAnnotated();if(out){data=out;fname=baseName()+'-annotated.pdf'}}
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
  if(keepZoom){if(o.m==='h')fitHeight();else if(o.m===null&&o.s)setScale(o.s)}
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
  const f=({w:()=>fitWidth(),h:fitHeight,r:()=>$('rot').click(),t:nextTheme,'2':()=>$('two').click(),s:()=>$('sb').click(),a:()=>$('ann').click(),l:()=>$('spotb').click(),'[':()=>spOn&&spSize(spR-30),']':()=>spOn&&spSize(spR+30)})[e.key.toLowerCase()];
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
  spOn=o;main.dataset.spot=o?'1':'';document.body.dataset.spot=o?'1':'';spot.classList.toggle('hide',!o);spctl.classList.toggle('hide',!o);
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
// ---------- toolbar: fits any width; extra tools move into a MORE menu ----------
const bar=document.querySelector('.bar'),moreB=$('moreb'),moreP=$('more'),mnav=$('mnav'),mbtn=$('mbtn');
const ORDER=['pin','pr','dl','share','g-view','g-search','ann','g-zoom','sb','g-nav'];
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
$('rot').onclick=()=>{rot=(rot+90)%360;setScale(scale,true)};
// dark reading mode (inverts page colours), remembered
themeHooks.push(()=>{$('dark').classList.toggle('on',th!=='light');$('dark').setAttribute('aria-label','Theme: '+th+' (click to change)');$('dark').title='Theme: '+th});
$('dark').onclick=nextTheme;applyTheme();
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
$('q').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();step(e.shiftKey?-1:1)}};
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
  wz*=Math.exp(-e.deltaY*.01);
  if(!wRaf)wRaf=requestAnimationFrame(()=>{wRaf=0;const ns=Math.min(C.maxScale,Math.max(C.minScale,scale*wz));wz=1;const a=wA;wA=null;if(Math.abs(ns-scale)>.002){setScale(ns);scrollToAnchor(a,wC[0],wC[1])}});
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
