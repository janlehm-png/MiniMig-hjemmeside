'use strict';
importScripts('./precache-manifest.js');
const PREFIX = 'minimig-' + encodeURIComponent(self.registration.scope) + '-';
const CACHE = PREFIX + self.MINIMIG_VERSION;
const URLS = self.MINIMIG_FILES.map(path => new URL(path, self.registration.scope).href);
const KNOWN = new Set(URLS);
self.addEventListener('install', event => {
 event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(URLS.map(url => new Request(url,{cache:'reload'})))));
});
self.addEventListener('activate', event => {
 event.waitUntil((async () => {
  const keys = await caches.keys();
  await Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)));
  await self.clients.claim();
 })());
});
self.addEventListener('message', event => {
 if(event.data?.type === 'SKIP_WAITING') self.skipWaiting();
 if(event.data?.type === 'CHECK_OFFLINE') event.waitUntil((async () => {
  const cache = await caches.open(CACHE);
  const matches = await Promise.all(URLS.map(url => cache.match(url)));
  event.source?.postMessage({type:'OFFLINE_STATUS',ready:matches.every(Boolean)});
 })());
});
self.addEventListener('fetch', event => {
 if(event.request.method !== 'GET') return;
 const url = new URL(event.request.url);
 if(url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
 // Version/retry query strings on game images resolve to this release's assets.
 url.search = ''; url.hash = '';
 if(url.pathname.endsWith('/')) url.pathname += 'index.html';
 if(!KNOWN.has(url.href)) return;
 // The website's own pages (front page, Til forældre, Support, Privatliv) are fetched fresh whenever there is a
 // connection, so new texts show at once; the saved copy is only for when there is none. The game itself keeps
 // its saved release until "Hent ny version" is pressed.
 if(event.request.mode === 'navigate' && !url.pathname.includes('/proev/')) {
  event.respondWith((async () => {
   const cache = await caches.open(CACHE);
   try {
    const response = await fetch(event.request.url, {cache:'no-cache'}); // (a page request can't be re-sent with options, its address can)
    if(response.ok && response.type === 'basic') await cache.put(url.href,response.clone());
    return response;
   } catch(error) { return (await cache.match(url.href)) || Response.error(); }
  })());
  return;
 }
 event.respondWith((async () => {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(url.href);
  if(cached) return cached;
  const response = await fetch(event.request);
  if(response.ok && response.type === 'basic') await cache.put(url.href,response.clone());
  return response;
 })());
});
