(() => {
'use strict';
const root = new URL('./', document.currentScript.src), onTest = root.pathname.endsWith('/test/'), site = onTest ? new URL('../', root) : root;
// (the language: on the website the page's own; in the game as the game has it - it runs after this, so it is worked out here too)
const en = (() => { if (!document.getElementById('scene')) return document.documentElement.lang === 'en';
 let l = new URLSearchParams(location.search).get('lang'); if (l !== 'en' && l !== 'da') { try { l = localStorage.getItem((onTest ? 'minimig-test' : 'minimig3d') + '.sprog'); } catch (e) { l = null; } }
 return (l || (/^da\b/i.test(navigator.language || '') ? 'da' : 'en')) === 'en'; })();
const say = (da, english) => en ? english : da;
const panel = document.createElement('aside');
panel.className = 'pwa-tools';
panel.setAttribute('aria-label', say('Installation og offline', 'Installing and offline'));
panel.innerHTML = en ? `<button type="button" class="pwa-help">For grown-ups</button>
<dialog class="pwa-dialog" aria-labelledby="pwa-title">
<h2 id="pwa-title" tabindex="-1" autofocus>For grown-ups</h2>
<p>No account and no ads.</p>
<h3>MiniMig keeps getting better</h3>
<p>MiniMig is new, and we keep fixing and improving the game. Every so often we gather the improvements into a new version. It comes to minimig.dk first and to TestFlight a little later, because Apple has to approve each version.</p>
<p>If you have an iPad or iPhone, you can get MiniMig as an app through TestFlight:</p>
<ol>
<li>Get the <strong>TestFlight</strong> app from the App Store. It is free and made by Apple.</li>
<li>Open the link <a href="https://testflight.apple.com/join/SUvxdtq2" target="_blank" rel="noopener">testflight.apple.com/join/SUvxdtq2</a> on the iPad or iPhone, and tap <strong>Accept</strong> and <strong>Install</strong>.</li>
<li>Open MiniMig from the home screen.</li>
</ol>
<p>Already have MiniMig from TestFlight? Then there is nothing more to do. When a new version comes out, tap <strong>Update</strong> in the TestFlight app.</p>
<h3>Playing in the browser</h3>
<p>On a computer or an Android tablet, just play here on minimig.dk. The game is best on a big screen such as a tablet or a computer.</p>
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
<p>MiniMig can keep the whole game on this device, about 135 MB, so you can play without internet. Please use Wi-Fi the first time.</p>
<div class="pwa-message" role="status" aria-live="polite" aria-atomic="true" hidden><strong>Message</strong>
<p class="pwa-status">The game is downloading. Please wait, and stay connected to the internet.</p></div>
<h3>Pictures out of the game</h3>
<p>Before a picture of the figure leaves the game, a grown-up has to solve a small math problem. After that you can choose to let your child share without asking for 1 hour, for the rest of the day or until you turn it off again.</p>
<h3>Brothers, sisters and sound</h3>
<p>Under the <strong>Children and players</strong> button in the grown-ups’ row, each child gets their own MiniMig and their own stars. Under <strong>Sound</strong> you choose which sounds the game may make. Both are behind a small math problem.</p>
<h3>Privacy</h3>
<p>The figures, names and stars are kept on this device only. The microphone is only used when your child records their name, and only once you have said yes. MiniMig uses no analytics tools or tracking.</p>
<h3>Praise, complaints and good ideas</h3>
<p>Write to <a href="mailto:supportogfeedback@minimig.dk">supportogfeedback@minimig.dk</a>. If you test in TestFlight, you can also take a screenshot and send it as feedback straight from TestFlight.</p>
<p><a class="pwa-support" target="_blank" rel="noopener">Help and support</a> · <a class="pwa-privacy" target="_blank" rel="noopener">Read about privacy</a></p>
<p class="pwa-tm">MiniMig™ is a trademark of LehCo ApS.</p>
<form method="dialog"><button>Close</button></form></dialog>` : `<button type="button" class="pwa-help">Til voksne</button>
<dialog class="pwa-dialog" aria-labelledby="pwa-title">
<h2 id="pwa-title" tabindex="-1" autofocus>Til voksne</h2>
<p>Uden konto og uden reklamer.</p>
<h3>MiniMig bliver bedre hele tiden</h3>
<p>MiniMig er ny, og vi retter og udvikler spillet løbende. Med jævne mellemrum samler vi forbedringerne i en ny udgave. Den kommer først her på minimig.dk og lidt senere i TestFlight, fordi Apple skal godkende hver udgave.</p>
<p>Har I en iPad eller iPhone, kan I få MiniMig som app gennem TestFlight:</p>
<ol>
<li>Hent appen <strong>TestFlight</strong> i App Store. Den er gratis og kommer fra Apple.</li>
<li>Åbn linket <a href="https://testflight.apple.com/join/SUvxdtq2" target="_blank" rel="noopener">testflight.apple.com/join/SUvxdtq2</a> på iPad’en eller iPhonen, og tryk <strong>Acceptér</strong> og <strong>Installér</strong>.</li>
<li>Åbn MiniMig fra hjemmeskærmen.</li>
</ol>
<p>Har I allerede MiniMig fra TestFlight? Så skal I ikke gøre mere. Når der kommer en ny udgave, trykker I <strong>Opdatér</strong> i TestFlight-appen.</p>
<h3>Spil i browseren</h3>
<p>På en computer eller en Android-tablet spiller I bare her på minimig.dk. Spillet er bedst på en stor skærm som en tablet eller en computer.</p>
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
<p>MiniMig kan gemme hele spillet på denne enhed, omkring 135 MB, så I kan spille uden internet. Brug gerne wifi første gang.</p>
<div class="pwa-message" role="status" aria-live="polite" aria-atomic="true" hidden><strong>Besked</strong>
<p class="pwa-status">Spillet hentes. Vent lidt, og behold internetforbindelsen.</p></div>
<h3>Billeder ud af spillet</h3>
<p>Før et billede af figuren forlader spillet, skal en voksen løse et lille regnestykke. Bagefter kan I vælge, at barnet må dele uden at spørge i 1 time, resten af dagen eller indtil I slår det fra igen.</p>
<h3>Søskende og lyd</h3>
<p>Under knappen <strong>Børn og spillere</strong> i de voksnes række får hvert barn sin egen MiniMig og sine egne stjerner. Under <strong>Lyd</strong> vælger I, hvilke lyde spillet må lave. Begge dele ligger bag et lille regnestykke.</p>
<h3>Privatliv</h3>
<p>Figurerne, navnene og stjernerne gemmes kun på denne enhed. Mikrofonen bruges kun, når barnet indtaler sit navn, og først når I har sagt ja. MiniMig bruger ingen analyseværktøjer eller sporing.</p>
<h3>Ros, ris og gode idéer</h3>
<p>Skriv til <a href="mailto:supportogfeedback@minimig.dk">supportogfeedback@minimig.dk</a>. Tester I i TestFlight, kan I også tage et skærmbillede og sende det som feedback direkte fra TestFlight.</p>
<p><a class="pwa-support" target="_blank" rel="noopener">Hjælp og support</a> · <a class="pwa-privacy" target="_blank" rel="noopener">Læs om privatliv</a></p>
<p class="pwa-tm">MiniMig™ er et varemærke tilhørende LehCo ApS.</p>
<form method="dialog"><button>Luk</button></form></dialog>`;
document.body.append(panel);
const dialog = panel.querySelector('dialog'), status = panel.querySelector('.pwa-status');
const install = panel.querySelector('.pwa-install');
panel.querySelector('.pwa-privacy').href = new URL(say('privatliv/', 'en/privacy/'), site);
panel.querySelector('.pwa-support').href = new URL(say('support/', 'en/support/'), site);
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
const READY = say('Spillet kan nu bruges uden internet.', 'The game can now be used without internet.');
function showRest(have, total, stopped) { status.textContent = READY + ' ' + (have >= total ? say('Alt tøj og hår er også hentet.', 'All clothes and hair are downloaded too.') : stopped ? say('Noget tøj og hår mangler stadig. Det hentes, næste gang der er internet.', 'Some clothes and hair are still missing. They download next time there is internet.') : say(`Tøj og hår hentes stadig af sig selv: ${have} af ${total}.`, `Clothes and hair are still downloading by themselves: ${have} of ${total}.`)); }
// The rest - clothes, hair, hats, pets - one file at a time behind the game, each kept by the service worker as it passes
// through it. It stops without internet and goes on next time (the user's test, 05-11-2026: they were missing without internet).
let fetching = false;
async function getRest(missing, total) { if(fetching || !missing.length || navigator.connection?.saveData) return; fetching = true;
 let have = total - missing.length;
 try { for(const url of missing) { const response = await fetch(url); if(!response.ok) throw new Error(url); await response.arrayBuffer(); showRest(++have, total); } }
 catch(error) { showRest(have, total, true); }
 fetching = false; }
addEventListener('online', checkReady);
if (!('serviceWorker' in navigator) || !isSecureContext) { status.textContent = say('Denne browser kan ikke gøre spillet klar til brug uden internet. Prøv at åbne https://minimig.dk/ i en opdateret browser.', 'This browser can’t get the game ready to use without internet. Try opening https://minimig.dk/ in an up-to-date browser.'); return; }
navigator.serviceWorker.addEventListener('message', event => {
 if(event.data?.type !== 'OFFLINE_STATUS') return;
 const {ready, total, missing = []} = event.data;
 if(!ready) { status.textContent = NOT_READY; return; }
 if(total === undefined) { status.textContent = READY; return; } // (the previous version's service worker, until the new one takes over)
 showRest(total - missing.length, total); getRest(missing, total);
});
// (reloading the page lets a waiting version take over by itself, but the page it shows is still the old one - it took two
// reloads to see a new version. A page just opened and not yet touched goes straight on to the new one)
const hadController = !!navigator.serviceWorker.controller;
navigator.serviceWorker.addEventListener('controllerchange', () => { if(reloading || (hadController && !touched && performance.now() < 15000)) { reloading = true; location.reload(); } else checkReady(); });
// A new version is fetched quietly in the background and then put in by itself, never in the middle of play: at once
// if MiniMig has only just been opened and nobody has touched it yet, otherwise when it is put away (the app closed,
// another app opened, the screen locked). The figure is kept in local storage, so the reload loses nothing.
function applyUpdate() {
 if(!registration?.waiting || reloading) return;
 if(document.hidden || (!touched && performance.now() < 15000)) { reloading = true; registration.waiting.postMessage({type:'SKIP_WAITING'}); }
}
// (an installed app is rarely opened afresh - it just comes back from the background - so it looks for a new version then)
document.addEventListener('visibilitychange', () => { if(document.hidden) applyUpdate(); else registration?.update().catch(() => {}); });
navigator.storage?.persist?.().catch(() => {}); // (asks the browser not to clear the saved game when space runs short)
navigator.serviceWorker.register(new URL('service-worker.js', root), {scope:root.pathname, updateViaCache:'none'}).then(reg => {
 registration = reg;
 const waiting = applyUpdate;
 waiting(); checkReady();
 const watch = () => { const worker = reg.installing;
  worker?.addEventListener('statechange', () => { waiting(); if(worker.state === 'redundant') status.textContent = NOT_READY; }); };
 // (one may already be on its way: opening the page starts it before this runs, and it then waited till the page was closed)
 watch(); reg.addEventListener('updatefound', watch);
 reg.update().catch(() => {}); // (the browser looks by itself only now and then: the page kept showing the old version when reloaded)
 navigator.serviceWorker.ready.then(checkReady);
}).catch(() => { status.textContent = NOT_READY; });
})();
