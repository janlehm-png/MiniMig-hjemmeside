(() => {
'use strict';
const root = new URL('./', document.currentScript.src);
const panel = document.createElement('aside');
panel.className = 'pwa-tools';
panel.setAttribute('aria-label', 'Installation og offline');
panel.innerHTML = `<button type="button" class="pwa-help">Til voksne</button>
<dialog class="pwa-dialog" aria-labelledby="pwa-title">
<h2 id="pwa-title" tabindex="-1" autofocus>Til voksne</h2>
<p>Uden konto og uden reklamer.</p>
<h3>En god skærm til legen</h3>
<p>MiniMig er lige nu bedst egnet til en tablet, en iPad eller en computer, hvor der er god plads til både figuren og valgene. På en computer er skærmen endnu større – åbn blot minimig.dk i browseren.</p>
<p>På iPhone kan I prøve at vende telefonen vandret, hvis skærmen føles trang. Det afhænger af skærmstørrelsen – vælg den retning, der fungerer bedst for jer.</p>
<h3>Føj MiniMig til hjemmeskærmen</h3>
<p>Så kan I åbne spillet direkte fra MiniMig-ikonet.</p>
<p class="pwa-installed" hidden><strong>✓ MiniMig ligger allerede på hjemmeskærmen på denne enhed.</strong> Vejledningen nedenfor kan bruges på jeres andre enheder.</p>
<button type="button" class="pwa-install" hidden>Installér MiniMig</button>
<div class="pwa-instructions">
<h3>iPhone og iPad</h3>
<ol>
<li>Åbn MiniMig i din browser, for eksempel Safari eller Chrome.</li>
<li>Tryk på <strong>Del <svg class="pwa-share-icon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="M8 6l4-4 4 4M12 2v13M7 10H4v12h16V10h-3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></strong> — symbolet med en firkant og en pil op — eventuelt via sidemenuen, og vælg <strong>Føj til hjemmeskærmen</strong>.</li>
<li>Behold <strong>Åbn som webapp</strong> slået til, hvis valget vises, og tryk på <strong>Tilføj</strong>.</li>
</ol>
<h3>Android</h3>
<p>Tryk på <strong>Installér MiniMig</strong>, hvis knappen vises. Ellers åbner du browserens menu i Chrome og vælger <strong>Installér app</strong> eller <strong>Føj til startskærm</strong>. Bekræft tilføjelsen.</p>
</div>
<h3>Spil uden internet</h3>
<p>MiniMig henter billeder og andre nødvendige filer til denne enhed, så I også kan spille uden internet.</p>
<p>I boksen <strong>Besked</strong> nedenfor kan du se, om spillet er klar. Vent, til der står <strong>“Spillet kan nu bruges uden internet”</strong>, før du slår internetforbindelsen fra.</p>
<div class="pwa-message" role="status" aria-live="polite" aria-atomic="true"><strong>Besked</strong>
<p class="pwa-status">Spillet hentes. Vent lidt, og behold internetforbindelsen.</p></div>
<p>Browseren kan senere rydde de gemte filer, hvis enheden mangler plads. Åbn i så fald MiniMig med internetforbindelse igen, så filerne kan hentes på ny.</p>
<h3>Billeder ud af spillet</h3>
<p>Med kameraet kan barnet gemme et billede af figuren eller et profilbillede og dele det. Før billedet forlader spillet, skal en voksen løse et lille regnestykke.</p>
<p>Bagefter kan I vælge, at barnet må dele uden at spørge i 1 time, resten af dagen eller indtil I slår det fra igen (det sidste kræver et sværere regnestykke). Så viser kameraet en lille grøn hængelås, og I kan altid slå det fra igen med knappen <strong>Slå fra igen</strong>, når I trykker på kameraet. Valget gælder kun på den enhed, hvor det er slået til. Et navn på trøjen kommer med på billedet.</p>
<h3>Jeres figur og privatliv</h3>
<p>Figuren og et eventuelt navn på trøjen gemmes kun i denne browser. Når MiniMig føjes til hjemmeskærmen, kan det få sin egen separate lagring, så figuren ikke nødvendigvis følger med.</p>
<p>MiniMig bruger ingen analyseværktøjer eller sporing.</p>
<h3>Ros, ris og gode idéer</h3>
<p>MiniMig er nyt, og vi vil meget gerne høre fra jer – hvad jeres børn kan lide, hvad der driller, og hvad I savner. Skriv til <a href="mailto:minimig@lehmann.dk">minimig@lehmann.dk</a>.</p>
<p><a class="pwa-support" target="_blank" rel="noopener">Hjælp og support</a> · <a class="pwa-privacy" target="_blank" rel="noopener">Læs om privatliv</a></p>
<form method="dialog"><button>Luk</button></form></dialog>`;
document.body.append(panel);
const dialog = panel.querySelector('dialog'), status = panel.querySelector('.pwa-status');
const install = panel.querySelector('.pwa-install');
panel.querySelector('.pwa-privacy').href = new URL('privatliv/', root);
panel.querySelector('.pwa-support').href = new URL('support/', root);
panel.querySelector('.pwa-help').onclick = () => dialog.showModal();
const standalone = matchMedia('(display-mode: standalone)');
let prompt, registration, reloading = false, touched = false;
['pointerdown', 'keydown'].forEach(type => addEventListener(type, () => { touched = true; }, {capture:true, once:true}));
function installUI() {
 const installed = standalone.matches || navigator.standalone === true;
 install.hidden = !prompt || installed;
 // (the steps stay visible when MiniMig is already installed - they are needed for the family's other devices)
 panel.querySelector('.pwa-installed').hidden = !installed;
}
window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); prompt = event; installUI(); });
install.onclick = async () => { const event = prompt; prompt = null; installUI(); if(event) { await event.prompt(); await event.userChoice; } };
window.addEventListener('appinstalled', () => { prompt = null; installUI(); });
standalone.addEventListener('change', installUI); installUI();
function checkReady() { navigator.serviceWorker.controller?.postMessage({type:'CHECK_OFFLINE'}); }
if (!('serviceWorker' in navigator) || !isSecureContext) { status.textContent = 'Denne browser kan ikke gøre spillet klar til brug uden internet. Prøv at åbne https://minimig.dk/ i en opdateret browser.'; return; }
navigator.serviceWorker.addEventListener('message', event => {
 if(event.data?.type === 'OFFLINE_STATUS') status.textContent = event.data.ready ? 'Spillet kan nu bruges uden internet.' : 'Spillet er ikke klar til brug uden internet. Kontrollér internetforbindelsen, og åbn MiniMig igen.';
});
navigator.serviceWorker.addEventListener('controllerchange', () => { if(reloading) location.reload(); else checkReady(); });
// A new version is fetched quietly in the background and then put in by itself, never in the middle of play: at once
// if MiniMig has only just been opened and nobody has touched it yet, otherwise when it is put away (the app closed,
// another app opened, the screen locked). The figure is kept in local storage, so the reload loses nothing.
function applyUpdate() {
 if(!registration?.waiting || reloading) return;
 if(document.hidden || (!touched && performance.now() < 15000)) { reloading = true; registration.waiting.postMessage({type:'SKIP_WAITING'}); }
}
// (an installed app is rarely opened afresh - it just comes back from the background - so it looks for a new version then)
document.addEventListener('visibilitychange', () => { if(document.hidden) applyUpdate(); else registration?.update().catch(() => {}); });
navigator.serviceWorker.register(new URL('service-worker.js', root), {scope:root.pathname, updateViaCache:'none'}).then(reg => {
 registration = reg;
 const waiting = applyUpdate;
 waiting(); checkReady();
 reg.addEventListener('updatefound', () => {
  const worker = reg.installing;
  worker?.addEventListener('statechange', () => { waiting(); if(worker.state === 'redundant') status.textContent = 'Spillet er ikke klar til brug uden internet. Kontrollér internetforbindelsen, og åbn MiniMig igen.'; });
 });
 navigator.serviceWorker.ready.then(checkReady);
}).catch(() => { status.textContent = 'Spillet er ikke klar til brug uden internet. Kontrollér internetforbindelsen, og åbn MiniMig igen.'; });
})();
