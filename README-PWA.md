# MiniMig som PWA

Udgangspunkt: main, commit acb1aa8a87f909517077ac26d99aa25c429458f9.

## Udgivelse
Kopiér indholdet af denne mappe til repositoryets rod. Bevar CNAME og .nojekyll.
Kør ./build-pwa.ps1 efter ændringer i HTML, CSS, JavaScript eller billeder, og medtag
precache-manifest.js i samme commit. GitHub Pages skal servere hele udgaven via HTTPS.
Relative stier understøtter både minimig.dk og /MiniMig-hjemmeside/.

Appikonet åbner proev/. Installationen kræver brugerens godkendelse.
Ingen eksterne biblioteker, skrifttyper eller analysetjenester er tilføjet.

## Offline og opdateringer
Service workeren gemmer alle 166 spil- og hjemmesidefiler før installationen
betragtes som færdig. Status kontrollerer, at alle filer findes i cachen.
Spillets billedversioner og genforsøgsparametre bruger samme versionsbestemte cache.
En opdatering venter, til brugeren trykker Hent ny version eller alle gamle faner
lukkes. Lokal figurdata slettes ikke ved en opdatering.
Cache-navne er afgrænset til denne apps adresse. Browseren kan rydde lagring;
offline er derfor ikke en garanti for permanent opbevaring.

opdater-proev.ps1 kalder build-pwa.ps1, så en ny import af spillet også får
manifest, mobiljusteringer og PWA-betjening. Bygningen er idempotent.

## Test før offentlig udgivelse
- Åbn med internet, vent på Klar til offline.
- Slå net fra, genåbn spillet og afprøv tøj, stillinger og alle baggrunde.
- Installer på en fysisk iPhone/iPad via Safari og en Android via Chrome.
- Kontroller hjemmeskærmsikon, tastatur ved navn, rotation og tilbagevenden.
- Ryd webstedsdata og kontroller, at første besøg uden net ikke loves at virke.
- Udgiv en opdatering, kontrollér knappen og at figuren bevares.

## Kilder til installationsvejledningen
- Apple: https://support.apple.com/guide/iphone/open-as-web-app-iphea86e5236/ios
- Web.dev: https://web.dev/learn/pwa/installation-prompt
- MDN: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable
