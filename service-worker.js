const CACHE_NAME = "confraria-pwa-v5";


const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];



/* =====================================================
   INSTALAÇÃO
   ===================================================== */

self.addEventListener(
  "install",
  function(event) {

    event.waitUntil(

      caches
        .open(CACHE_NAME)
        .then(
          function(cache) {

            return cache.addAll(
              APP_SHELL
            );

          }
        )

    );


    /*
     * Ativa imediatamente a nova versão.
     */

    self.skipWaiting();

  }
);



/* =====================================================
   ATIVAÇÃO
   ===================================================== */

self.addEventListener(
  "activate",
  function(event) {

    event.waitUntil(

      caches
        .keys()
        .then(
          function(keys) {

            return Promise.all(

              keys
                .filter(
                  function(key) {

                    return (
                      key !==
                      CACHE_NAME
                    );

                  }
                )

                .map(
                  function(key) {

                    return caches.delete(
                      key
                    );

                  }
                )

            );

          }
        )

    );


    /*
     * Assume imediatamente o controle
     * das páginas abertas.
     */

    self.clients.claim();

  }
);



/* =====================================================
   IMPORTANTE
   =====================================================

   NÃO HÁ EVENTO "fetch" NESTA VERSÃO.

   O navegador fará normalmente:

   GitHub Pages
        ↓
   index.html
        ↓
   Apps Script
        ↓
   JSON

   O Service Worker não vai interferir
   nesse processo.

   ===================================================== */
