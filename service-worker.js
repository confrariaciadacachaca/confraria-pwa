const CACHE_NAME = "confraria-pwa-v4";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];


self.addEventListener("install", event => {

  event.waitUntil(

    caches
      .open(CACHE_NAME)
      .then(cache => {

        return cache.addAll(APP_SHELL);

      })

  );

  self.skipWaiting();

});


self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(keys => {

      return Promise.all(

        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))

      );

    })

  );

  self.clients.claim();

});


self.addEventListener("fetch", event => {

  const request =
    event.request;

  const url =
    new URL(request.url);


  /*
   * O PWA só controla arquivos
   * da própria origem.
   *
   * O Google Apps Script continua
   * sendo carregado diretamente
   * pela internet.
   */

  if (url.origin !== self.location.origin) {
    return;
  }


  /*
   * Navegação:
   *
   * primeiro tenta buscar a versão
   * atual na rede.
   *
   * Se não houver internet,
   * utiliza o index.html armazenado.
   */

  if (request.mode === "navigate") {

    event.respondWith(

      fetch(
        request,
        {
          cache: "no-store"
        }
      )

      .then(response => {

        return response;

      })

      .catch(() => {

        return caches.match(
          "./index.html"
        );

      })

    );

    return;
  }


  /*
   * index.html e manifest:
   *
   * sempre tenta buscar a versão
   * atualizada na rede.
   */

  if (
    url.pathname.endsWith("/index.html") ||
    url.pathname.endsWith("/manifest.json")
  ) {

    event.respondWith(

      fetch(
        request,
        {
          cache: "no-store"
        }
      )

      .catch(() => {

        return caches.match(
          "./" +
          url.pathname.split("/").pop()
        );

      })

    );

    return;
  }


  /*
   * Outros arquivos:
   *
   * utiliza o cache quando disponível.
   *
   * Caso contrário, busca na rede.
   */

  event.respondWith(

    caches
      .match(request)
      .then(cached => {

        if (cached) {
          return cached;
        }


        return fetch(request)
          .then(response => {

            if (
              response &&
              response.ok
            ) {

              const copy =
                response.clone();

              caches
                .open(CACHE_NAME)
                .then(cache => {

                  cache.put(
                    request,
                    copy
                  );

                });

            }

            return response;

          });

      })

  );

});
