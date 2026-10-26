(() => {
'use strict';
const root = new URL('./', document.currentScript.src);
const panel = document.createElement('aside');
panel.className = 'pwa-tools';
panel.setAttribute('aria-label', 'Installation og offline');
panel.innerHTML = `<button type="button" class="pwa-help">Til voksne</button>
<button type="button" class="pwa-update" hidden>Hent ny version</button>
<dialog class="pwa-dialog" aria-labelledby="pwa-title">
<h2 id="pwa-title">Til voksne</h2>
<p>Gratis, uden konto og uden reklamer.</p>
<h3>En god skærm til legen</h3>
<p>MiniMig er lige nu bedst egnet til en tablet eller iPad, hvor der er god plads til både figuren og valgene. På iPhone kan I prøve at vende telefonen vandret, hvis skærmen føles trang. Det afhænger af skærmstørrelsen – vælg den retning, der fungerer bedst for jer.</p>
<h3>Føj MiniMig til hjemmeskærmen</h3>
<button type="button" class="pwa-install" hidden>Installér MiniMig</button>
<div class="pwa-instructions">
<h3>iPhone og iPad</h3><ol><li>Åbn denne side i Safari.</li><li>Tryk på Del (eventuelt via sidemenuen).</li><li>Vælg Føj til hjemmeskærm. Behold Åbn som webapp slået til, hvis valget vises, og tryk Tilføj.</li></ol>
<h3>Android</h3><p>Brug knappen Installér MiniMig, når den vises. Ellers åbn browserens menu i Chrome og vælg Installér app eller Føj til startskærm. Bekræft tilføjelsen.</p>
</div>
<h3>Spil uden internet</h3>
<p>Spillet henter billeder og andre nødvendige filer til denne enhed. Vent på beskeden nedenfor om, at spillet kan bruges uden internet, før du slår nettet fra.</p>
<p class="pwa-status" role="status">Henter spillet til brug uden internet…</p>
<p>Browseren kan senere rydde gemte filer ved pladsmangel; åbn da spillet med internet igen.</p>
<p>Figuren og et eventuelt navn på trøjen gemmes kun i denne browser. Installation kan bruge separat lagring. Ingen analyseværktøjer eller sporing.</p>
<p><a class="pwa-privacy">Læs om privatliv</a></p>
<form method="dialog"><button>Luk</button></form></dialog>`;
document.body.append(panel);
const dialog = panel.querySelector('dialog'), status = panel.querySelector('.pwa-status');
const install = panel.querySelector('.pwa-install'), update = panel.querySelector('.pwa-update');
panel.querySelector('.pwa-privacy').href = new URL('privatliv/', root);
panel.querySelector('.pwa-help').onclick = () => dialog.showModal();
const standalone = matchMedia('(display-mode: standalone)');
let prompt, registration, reloading = false;
function installUI() {
 const installed = standalone.matches || navigator.standalone === true;
 install.hidden = !prompt || installed;
 panel.querySelector('.pwa-instructions').hidden = installed;
}
window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); prompt = event; installUI(); });
install.onclick = async () => { const event = prompt; prompt = null; installUI(); if(event) { await event.prompt(); await event.userChoice; } };
window.addEventListener('appinstalled', () => { prompt = null; installUI(); });
standalone.addEventListener('change', installUI); installUI();
function checkReady() { navigator.serviceWorker.controller?.postMessage({type:'CHECK_OFFLINE'}); }
if (!('serviceWorker' in navigator) || !isSecureContext) { status.textContent = 'Offlinebrug kræver en understøttet browser og HTTPS.'; return; }
navigator.serviceWorker.addEventListener('message', event => {
 if(event.data?.type === 'OFFLINE_STATUS') status.textContent = event.data.ready ? 'Spillet kan nu bruges uden internet.' : 'Offlinefiler mangler. Åbn med internet igen.';
});
navigator.serviceWorker.addEventListener('controllerchange', () => { if(reloading) location.reload(); else checkReady(); });
update.onclick = () => { if(registration?.waiting) { reloading = true; registration.waiting.postMessage({type:'SKIP_WAITING'}); } };
navigator.serviceWorker.register(new URL('service-worker.js', root), {scope:root.pathname, updateViaCache:'none'}).then(reg => {
 registration = reg;
 const waiting = () => { update.hidden = !reg.waiting; };
 waiting(); checkReady();
 reg.addEventListener('updatefound', () => {
  const worker = reg.installing;
  worker?.addEventListener('statechange', () => { waiting(); if(worker.state === 'redundant') status.textContent = 'Offlinehentning mislykkedes. Prøv igen med internet.'; });
 });
 navigator.serviceWorker.ready.then(checkReady);
}).catch(() => { status.textContent = 'Offlinebrug kunne ikke startes. Prøv igen med internet.'; });
})();
