/* Folix service worker: offline app shell + PDF share target. */
const CACHE='folix-bac510bd',SHARE='folix-share';
const ASSETS=[
 "./",
 "./about.html",
 "./app.js",
 "./assets/apple-touch-icon.png",
 "./assets/branding.png",
 "./assets/favicon-32.png",
 "./assets/floppersblop-product.png",
 "./assets/folix-lockup-dark.png",
 "./assets/folix-lockup.png",
 "./assets/fonts/archivo-black-latin-400-normal.woff2",
 "./assets/fonts/dancing-script-latin-600-normal.woff2",
 "./assets/fonts/space-mono-latin-400-normal.woff2",
 "./assets/fonts/space-mono-latin-700-normal.woff2",
 "./assets/icon-192.png",
 "./assets/icon-512.png",
 "./assets/icon-maskable-512.png",
 "./assets/icon.png",
 "./assets/icons/close.svg",
 "./assets/icons/contrast.svg",
 "./assets/icons/download.svg",
 "./assets/icons/eraser.svg",
 "./assets/icons/fit-height.svg",
 "./assets/icons/fit-width.svg",
 "./assets/icons/fullscreen.svg",
 "./assets/icons/highlight.svg",
 "./assets/icons/marker.svg",
 "./assets/icons/menu.svg",
 "./assets/icons/more.svg",
 "./assets/icons/next.svg",
 "./assets/icons/note.svg",
 "./assets/icons/open.svg",
 "./assets/icons/pen.svg",
 "./assets/icons/pin.svg",
 "./assets/icons/prev.svg",
 "./assets/icons/print.svg",
 "./assets/icons/redo.svg",
 "./assets/icons/rotate.svg",
 "./assets/icons/search.svg",
 "./assets/icons/share.svg",
 "./assets/icons/sidebar.svg",
 "./assets/icons/signature.svg",
 "./assets/icons/spotlight.svg",
 "./assets/icons/textbox.svg",
 "./assets/icons/two-page.svg",
 "./assets/icons/undo.svg",
 "./assets/icons/zoom-in.svg",
 "./assets/icons/zoom-out.svg",
 "./config.js",
 "./contact.html",
 "./copyright.html",
 "./disclaimer.html",
 "./faq.html",
 "./index.html",
 "./lib/pdf-lib.min.js",
 "./lib/pdf.min.js",
 "./lib/pdf.worker.min.js",
 "./privacy.html",
 "./site.webmanifest",
 "./styles.css",
 "./terms.html"
];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE&&n!==SHARE).map(n=>caches.delete(n)))).then(()=>self.clients.claim())));
async function handleShare(req){
  try{
    const fd=await req.formData(),f=fd.get('pdf');
    if(f&&f.size){const c=await caches.open(SHARE);await c.put('shared-file',new Response(f,{headers:{'content-type':'application/pdf','x-name':encodeURIComponent(f.name||'shared.pdf')}}))}
  }catch(e){}
  return Response.redirect(new URL('index.html?shared=1',self.registration.scope).href,303);
}
self.addEventListener('fetch',e=>{
  const req=e.request,url=new URL(req.url);
  if(req.method==='POST'&&url.pathname.endsWith('/share-target')){e.respondWith(handleShare(req));return}
  if(req.method!=='GET'||url.origin!==location.origin)return;
  e.respondWith((async()=>{
    const c=await caches.open(CACHE),key=url.origin+url.pathname,hit=await c.match(key);
    const net=fetch(req).then(r=>{if(r&&r.ok&&r.type==='basic')c.put(key,r.clone());return r}).catch(()=>null);
    if(hit){e.waitUntil(net);return hit}
    const r=await net;if(r)return r;
    if(req.mode==='navigate'){const i=await c.match(new URL('index.html',self.registration.scope).href);if(i)return i}
    return Response.error();
  })());
});
