'use strict';
importScripts('./precache-manifest.js?v=62BBA1E92C3EFDD0');
const PREFIX = 'minimig-' + encodeURIComponent(self.registration.scope) + '-';
// One cache for all versions. Each file is kept under its own hash, so a new version fetches only the files that changed
// (each new version used to throw away everything, so what had been played with no longer worked without internet).
const CACHE = PREFIX + 'filer';
const full = path => new URL(path, self.registration.scope).href;
const HASH = new Map(Object.entries(self.MINIMIG_HASHES).map(([path, hash]) => [full(path), hash]));
const key = href => href + '?h=' + HASH.get(href);
// What must be there before the game is called ready; the rest (MINIMIG_REST) is fetched by pwa.js afterwards.
const MUST = self.MINIMIG_FILES.map(full), REST = self.MINIMIG_REST.map(full);
const GAME = '/' + self.MINIMIG_GAME + '/';
self.addEventListener('install', event => {
 event.waitUntil((async () => {
  const cache = await caches.open(CACHE), todo = [];
  for(const url of MUST) if(!(await cache.match(key(url)))) todo.push(url);
  // (a few at a time: all at once could fail on a slow connection)
  await Promise.all(Array.from({length:6}, async () => {
   for(let url; (url = todo.shift());) {
    const response = await fetch(new Request(url,{cache:'reload'}));
    if(!response.ok) throw new Error(url);
    await cache.put(key(url),response);
   }
  }));
 })());
});
self.addEventListener('activate', event => {
 event.waitUntil((async () => {
  const keys = await caches.keys();
  await Promise.all(keys.filter(name => name.startsWith(PREFIX) && name !== CACHE).map(name => caches.delete(name)));
  // (files of older versions go now, not while the older version may still be running)
  const cache = await caches.open(CACHE), keep = new Set([...HASH.keys()].map(key));
  await Promise.all((await cache.keys()).filter(request => !keep.has(request.url)).map(request => cache.delete(request)));
  await self.clients.claim();
 })());
});
self.addEventListener('message', event => {
 if(event.data?.type === 'SKIP_WAITING') self.skipWaiting();
 if(event.data?.type === 'CHECK_OFFLINE') event.waitUntil((async () => {
  const cache = await caches.open(CACHE), have = async url => !!(await cache.match(key(url)));
  const ready = (await Promise.all(MUST.map(have))).every(Boolean);
  const got = await Promise.all(REST.map(have));
  event.source?.postMessage({type:'OFFLINE_STATUS',ready,total:REST.length,missing:REST.filter((url,i) => !got[i])});
 })());
});
self.addEventListener('fetch', event => {
 if(event.request.method !== 'GET') return;
 const url = new URL(event.request.url);
 if(url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
 // Version/retry query strings on game images resolve to this release's assets.
 url.search = ''; url.hash = '';
 if(url.pathname.endsWith('/')) url.pathname += 'index.html';
 if(!HASH.has(url.href)) return;
 // The website's own pages (front page, Til forældre, Support, Privatliv) are fetched fresh whenever there is a
 // connection, so new texts show at once; the saved copy is only for when there is none. The game itself keeps
 // its saved release until pwa.js puts the new one in (when MiniMig is opened or put away, never during play).
 if(event.request.mode === 'navigate' && !url.pathname.includes(GAME)) {
  event.respondWith((async () => {
   const cache = await caches.open(CACHE);
   try {
    const response = await fetch(event.request.url, {cache:'no-cache'}); // (a page request can't be re-sent with options, its address can)
    if(response.ok && response.type === 'basic') await cache.put(key(url.href),response.clone());
    return response;
   } catch(error) { return (await cache.match(key(url.href))) || Response.error(); }
  })());
  return;
 }
 event.respondWith((async () => {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(key(url.href));
  if(cached) return cached;
  const response = await fetch(url.href,{cache:'no-cache'}); // (never a browser's memory of an older version's file under this hash)
  if(response.ok && response.type === 'basic') await cache.put(key(url.href),response.clone()).catch(() => {});
  return response;
 })());
});
