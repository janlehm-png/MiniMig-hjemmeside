(() => {
'use strict';
const root = new URL('./', document.currentScript.src);
// (the language: on the website the page's own; in the game as the game has it - it runs after this, so it is worked out here too)
const en = (() => { if (!document.getElementById('scene')) return document.documentElement.lang === 'en';
 let l = new URLSearchParams(location.search).get('lang'); if (l !== 'en' && l !== 'da') { try { l = localStorage.getItem('minimig3d.sprog'); } catch (e) { l = null; } }
 return (l || (/^da\b/i.test(navigator.language || '') ? 'da' : 'en')) === 'en'; })();
const say = (da, english) => en ? english : da;
const panel = document.createElement('aside');
panel.className = 'pwa-tools';
panel.setAttribute('aria-label', say('Installation og offline', 'Installing and offline'));
panel.innerHTML = en ? `<button type="button" class="pwa-help">For grown-ups</button>
<dialog class="pwa-dialog" aria-labelledby="pwa-title">
<h2 id="pwa-title" tabindex="-1" autofocus>For grown-ups</h2>
<p>No account and no ads.</p>
<h3>A good screen for playing</h3>
<p>Right now MiniMig works best on a tablet, an iPad or a computer, with plenty of room for both the figure and the choices. A computer screen is even bigger – just open minimig.dk in the browser.</p>
<p>On an iPhone, try turning the phone sideways if the screen feels cramped. It depends on the size of the screen – choose the direction that works best for you.</p>
<h3>Add MiniMig to your home screen</h3>
<p>Then you can open the game directly from the MiniMig icon.</p>
<p class="pwa-installed" hidden><strong>✓ MiniMig is already on the home screen of this device.</strong> The instructions below can be used on your other devices.</p>
<button type="button" class="pwa-install" hidden>Install MiniMig</button>
<div class="pwa-instructions">
<h3>iPhone and iPad</h3>
<ol>
<li>Open MiniMig in your browser, for example Safari or Chrome.</li>
<li>Tap <strong>Share <svg class="pwa-share-icon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="M8 6l4-4 4 4M12 2v13M7 10H4v12h16V10h-3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></strong> — the symbol with a square and an up arrow — perhaps via the side menu, and choose <strong>Add to Home Screen</strong>.</li>
<li>Keep <strong>Open as Web App</strong> turned on if the choice appears, and tap <strong>Add</strong>.</li>
</ol>
<h3>Android</h3>
<p>Tap <strong>Install MiniMig</strong> if the button appears. Otherwise open the browser’s menu in Chrome and choose <strong>Install app</strong> or <strong>Add to Home screen</strong>. Confirm that you want to add it.</p>
</div>
<h3>Playing without internet</h3>
<p>MiniMig keeps the essentials on this device – about 25 MB with the figure, the standard hair, the icons and the backgrounds – so you can also play without internet. That is why it takes a little longer the first time. Clothes, hair, hats, moves and pets are saved the first time your child uses them, so they may take a moment to appear. If your child uses everything, the game takes up about 120 MB.</p>
<p>In the <strong>Message</strong> box below you can see whether the game is ready. Wait until it says <strong>“The game can now be used without internet”</strong> before you turn off your internet connection.</p>
<div class="pwa-message" role="status" aria-live="polite" aria-atomic="true"><strong>Message</strong>
<p class="pwa-status">The game is downloading. Please wait, and stay connected to the internet.</p></div>
<p>The browser may later clear the saved files if the device is short of space. If so, open MiniMig with internet again, and the files can download again.</p>
<h3>Pictures out of the game</h3>
<p>With the camera, your child can save a picture of the figure or a profile picture and share it. Before the picture leaves the game, a grown-up has to solve a small math problem.</p>
<p>After that you can choose to let your child share without asking for 1 hour, for the rest of the day or until you turn it off again (the last one needs a harder math problem). The camera then shows a small green padlock, and you can always turn it off with the <strong>Turn off again</strong> button when you tap the camera. The choice only applies to the device where it was turned on. A name on the top will be in the picture.</p>
<h3>Your figure and privacy</h3>
<p>The figures, names, stars and any recorded voice are kept in this browser only. The microphone is only used when your child taps 🎤 to record their name, and only once you have said yes. When MiniMig is added to the home screen, it may get its own separate storage, so the figure may not come along.</p>
<h3>Brothers, sisters and sound</h3>
<p>Under <strong>My figures → Children and players – for grown-ups</strong> each child gets their own MiniMig and their own stars. Under <strong>🔊 Sound</strong> you choose which sounds the game may make. Both are behind a small math problem.</p>
<p>MiniMig uses no analytics tools or tracking.</p>
<h3>Praise, complaints and good ideas</h3>
<p>MiniMig is new, and we would love to hear from you – what your children like, what isn’t working and what you are missing. Write to <a href="mailto:supportogfeedback@minimig.dk">supportogfeedback@minimig.dk</a>.</p>
<p><a class="pwa-support" target="_blank" rel="noopener">Help and support</a> · <a class="pwa-privacy" target="_blank" rel="noopener">Read about privacy</a></p>
<form method="dialog"><button>Close</button></form></dialog>` : `<button type="button" class="pwa-help">Til voksne</button>
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
<p>MiniMig gemmer det vigtigste på denne enhed – omkring 25 MB med figuren, standardhåret, ikonerne og baggrundene – så I også kan spille uden internet. Derfor tager det lidt længere tid første gang. Tøj, hår, hatte, bevægelser og kæledyr gemmes første gang barnet bruger dem, så der kan gå et øjeblik, før de dukker op. Bruger barnet det hele, fylder spillet omkring 120 MB.</p>
<p>I boksen <strong>Besked</strong> nedenfor kan du se, om spillet er klar. Vent, til der står <strong>“Spillet kan nu bruges uden internet”</strong>, før du slår internetforbindelsen fra.</p>
<div class="pwa-message" role="status" aria-live="polite" aria-atomic="true"><strong>Besked</strong>
<p class="pwa-status">Spillet hentes. Vent lidt, og behold internetforbindelsen.</p></div>
<p>Browseren kan senere rydde de gemte filer, hvis enheden mangler plads. Åbn i så fald MiniMig med internetforbindelse igen, så filerne kan hentes på ny.</p>
<h3>Billeder ud af spillet</h3>
<p>Med kameraet kan barnet gemme et billede af figuren eller et profilbillede og dele det. Før billedet forlader spillet, skal en voksen løse et lille regnestykke.</p>
<p>Bagefter kan I vælge, at barnet må dele uden at spørge i 1 time, resten af dagen eller indtil I slår det fra igen (det sidste kræver et sværere regnestykke). Så viser kameraet en lille grøn hængelås, og I kan altid slå det fra igen med knappen <strong>Slå fra igen</strong>, når I trykker på kameraet. Valget gælder kun på den enhed, hvor det er slået til. Et navn på trøjen kommer med på billedet.</p>
<h3>Jeres figur og privatliv</h3>
<p>Figurerne, navnene, stjernerne og en eventuel indtalt stemme gemmes kun i denne browser. Mikrofonen bruges kun, når barnet trykker 🎤 for at indtale sit navn, og først når I har sagt ja. Når MiniMig føjes til hjemmeskærmen, kan det få sin egen separate lagring, så figuren ikke nødvendigvis følger med.</p>
<h3>Søskende og lyd</h3>
<p>Under <strong>Mine figurer → Børn og spillere – for voksne</strong> får hvert barn sin egen MiniMig og sine egne stjerner. Under <strong>🔊 Lyd</strong> vælger I, hvilke lyde spillet må lave. Begge dele ligger bag et lille regnestykke.</p>
<p>MiniMig bruger ingen analyseværktøjer eller sporing.</p>
<h3>Ros, ris og gode idéer</h3>
<p>MiniMig er nyt, og vi vil meget gerne høre fra jer – hvad jeres børn kan lide, hvad der driller, og hvad I savner. Skriv til <a href="mailto:supportogfeedback@minimig.dk">supportogfeedback@minimig.dk</a>.</p>
<p><a class="pwa-support" target="_blank" rel="noopener">Hjælp og support</a> · <a class="pwa-privacy" target="_blank" rel="noopener">Læs om privatliv</a></p>
<form method="dialog"><button>Luk</button></form></dialog>`;
document.body.append(panel);
const dialog = panel.querySelector('dialog'), status = panel.querySelector('.pwa-status');
const install = panel.querySelector('.pwa-install');
panel.querySelector('.pwa-privacy').href = new URL(say('privatliv/', 'en/privacy/'), root);
panel.querySelector('.pwa-support').href = new URL(say('support/', 'en/support/'), root);
const NOT_READY = say('Spillet er ikke klar til brug uden internet. Kontrollér internetforbindelsen, og åbn MiniMig igen.', 'The game isn’t ready to use without internet. Check your internet connection and open MiniMig again.');
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
if (!('serviceWorker' in navigator) || !isSecureContext) { status.textContent = say('Denne browser kan ikke gøre spillet klar til brug uden internet. Prøv at åbne https://minimig.dk/ i en opdateret browser.', 'This browser can’t get the game ready to use without internet. Try opening https://minimig.dk/ in an up-to-date browser.'); return; }
navigator.serviceWorker.addEventListener('message', event => {
 if(event.data?.type === 'OFFLINE_STATUS') status.textContent = event.data.ready ? say('Spillet kan nu bruges uden internet.', 'The game can now be used without internet.') : NOT_READY;
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
  worker?.addEventListener('statechange', () => { waiting(); if(worker.state === 'redundant') status.textContent = NOT_READY; });
 });
 navigator.serviceWorker.ready.then(checkReady);
}).catch(() => { status.textContent = NOT_READY; });
})();
