const { chromium } = require('playwright');
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.webmanifest':'application/manifest+json'};
let broken=false,version2=false;
const server=http.createServer((req,res)=>{
 let p=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/MiniMig-hjemmeside/,'');
 if(p.endsWith('/'))p+='index.html';
 if(broken && p==='/proev/dele/grund.png'){res.writeHead(503);res.end();return;}
 const file=path.join(root,p);
 if(!file.startsWith(root)||!fs.existsSync(file)){res.writeHead(404);res.end();return;}
 res.setHeader('Content-Type',mime[path.extname(file)]||'text/plain');
 res.setHeader('Cache-Control','no-cache');
 let data=fs.readFileSync(file);
 if(version2 && p==='/precache-manifest.js')data=Buffer.from(data.toString().replace(/MINIMIG_VERSION = '[^']+'/,"MINIMIG_VERSION = 'test-update'"));
 res.end(data);
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:390,height:844}});
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const base='http://127.0.0.1:'+server.address().port+(process.env.TEST_ROOT ? '/' : '/MiniMig-hjemmeside/');
 await page.goto(base+'proev/');
 await page.waitForFunction(()=>document.querySelector('.pwa-status')?.textContent==='Spillet kan nu bruges uden internet.',{},{timeout:60000});
 await page.locator('#tab-haar').waitFor();
 await page.getByRole('button',{name:'Til voksne',exact:true}).click();
 await page.getByRole('heading',{name:'Til voksne',exact:true}).waitFor();
 await page.getByRole('button',{name:'Luk',exact:true}).click();
 for(const size of [[320,568],[390,844],[768,1024],[844,390],[1440,900]]){
  await page.setViewportSize({width:size[0],height:size[1]});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'horizontal overflow '+size);
  assert(await page.locator('.box').evaluate(e=>e.clientHeight>80),'choices too small '+size);
 }
 await page.setViewportSize({width:390,height:844});
 await context.setOffline(true);
 await page.reload();
 await page.locator('#tab-baggrund').waitFor({timeout:60000});
 await page.locator('#tab-troeje').click();
 await page.locator('[data-val="troeje-haette"]').click();
 assert(await page.evaluate(()=>JSON.parse(localStorage.minimig2).top)==='troeje-haette');
 await page.locator('#tab-stilling').click();
 await page.locator('[data-val="hurra"]').click();
 assert(await page.evaluate(()=>JSON.parse(localStorage.minimig2).pose)==='hurra');
 await page.locator('#tab-baggrund').click();
 await page.locator('[data-val="rummet"]').click();
 assert(await page.evaluate(()=>JSON.parse(localStorage.minimig2).bg)==='rummet');
 const allAssets=await page.evaluate(async()=>{
  const keys=await caches.keys(),cache=await caches.open(keys.find(k=>k.startsWith('minimig-')));
  const requests=await cache.keys();
  const results=await Promise.all(requests.map(async request=>(await fetch(request.url)).ok));
  const retry=await fetch('dele/grund.png?v=56-3');
  return {count:results.length,ok:results.every(Boolean),retry:retry.ok};
 });
 assert(allAssets.ok&&allAssets.retry&&allAssets.count===166,JSON.stringify(allAssets));
 await page.screenshot({path:path.join(__dirname,'mobile-offline.png')});
 await page.goto(base);
 await page.getByRole('link',{name:/Spil MiniMig/}).click();
 await page.locator('#tab-haar').waitFor();
 assert(await page.evaluate(()=>JSON.parse(localStorage.minimig2).bg)==='rummet');
 await context.setOffline(false);
 version2=true;
 // (the page has been played with, so the new version waits until it is put away - a hidden page)
 await page.evaluate(async()=>{await (await navigator.serviceWorker.getRegistration()).update()});
 await page.waitForFunction(async()=>!!(await navigator.serviceWorker.getRegistration()).waiting,{},{timeout:60000});
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{value:true,configurable:true});document.dispatchEvent(new Event('visibilitychange'));});
 await page.waitForLoadState('load');
 await page.waitForFunction(()=>navigator.serviceWorker.controller && document.querySelector('.pwa-status')?.textContent==='Spillet kan nu bruges uden internet.');
 await page.waitForFunction(async()=> (await caches.keys()).some(k=>k.endsWith('test-update')));
 assert(await page.evaluate(()=>JSON.parse(localStorage.minimig2).bg)==='rummet');
 assert(!errors.length,errors.join('\n'));
 console.log('PASS: installation help, 5 screen sizes, offline reload/navigation, all 166 cached files, versioned image retry, background persistence, update acceptance.');
 // Failed installation must not advertise offline readiness.
 broken=true;
 const failing=await browser.newContext();
 const fp=await failing.newPage(); await fp.goto(base+'proev/');
 await fp.waitForFunction(()=>/mislykkedes|kunne ikke/.test(document.querySelector('.pwa-status')?.textContent),{},{timeout:60000});
 console.log('PASS: missing asset prevents offline-ready status.');
 await browser.close(); server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});


