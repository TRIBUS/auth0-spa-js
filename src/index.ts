import { Auth0Client as Client } from './Auth0Client';
import { Auth0ClientOptions } from './global';

import './global';

export * from './global';

(function init() {
  _createButton();
  _handleCallback();
})();

async function _createButton() {
  const ezButton = document.getElementById('ezLogin');

  if (ezButton) {
    ezButton.style.position = 'relative';
    ezButton.style.width = '200px';

    const iframe = window.document.createElement('iframe');
    const html = `<html>
<body style="margin: 0px; padding: 0px;">
  <a href="javascript:"
     id="ezAnchor"
     style="display: block;
            background-color: #bfd;
            line-height: 40px;
            text-align: center">
    EZ Button
  </a>
</body>
</html>`;

    iframe.id = 'ezFrame';
    iframe.srcdoc = html;
    iframe.style.display = 'block';
    iframe.style.height = '40px';
    iframe.style.width = '200px';
    iframe.style.border = '0px';
    iframe.style.margin = '0px';
    iframe.style.padding = '0px';

    const overlay = window.document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0px';
    overlay.style.right = '0px';
    overlay.style.bottom = '0px';
    overlay.style.left = '0px';
    overlay.style.cursor = 'pointer';

    ezButton.innerHTML = '';
    ezButton.appendChild(iframe);
    ezButton.appendChild(overlay);

    overlay.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const ezClient = _newClient();

      if (ezButton.dataset.redirect_uri) {
        ezClient?.loginWithRedirect();
      }
      else if (ezButton.dataset.callback_fn) {
        // TODO: Login w/ popup requires response_mode: 'web_message' support w/ IDP
      }
    });
  }
}

async function _handleCallback() {
  const ezButton = document.getElementById('ezLogin');

  if (ezButton?.dataset?.callback_fn) {
    const ezClient = _newClient();

    if (ezClient) {
      if (location.search.includes("state=") &&
          (location.search.includes("code=") ||
          location.search.includes("error="))) {
        await ezClient.handleRedirectCallback();

        if (await ezClient.isAuthenticated()) {
          const fnStr = `${ezButton.dataset.callback_fn}`;
          let callBack = (window as { [key: string]: any })[fnStr] as Function;

          callBack(await ezClient.getUser());
        }
        else {
          // TODO: Error handling?
        }
      }
    }
  }
}

function _newClient() {
  const ezButton = document.getElementById('ezLogin');

  if (ezButton) {
    const options: Auth0ClientOptions = {
      domain: `${ezButton.dataset.domain}`,
      clientId: `${ezButton.dataset.client_id}`,
      issuer: ezButton.dataset.issuer,
      useRefreshTokens: true,
      authorizationParams: {
        redirect_uri: ezButton.dataset.redirect_uri || window.location.origin,
        scope: 'openid email profile'
      }
    };

    return new Client(options);
  }
}

export { Client };

export {
  GenericError,
  AuthenticationError,
  TimeoutError,
  PopupTimeoutError,
  PopupCancelledError,
  MfaRequiredError,
  MissingRefreshTokenError
} from './errors';

export {
  ICache,
  LocalStorageCache,
  InMemoryCache,
  Cacheable,
  DecodedToken,
  CacheEntry,
  WrappedCacheEntry,
  KeyManifestEntry,
  MaybePromise,
  CacheKey,
  CacheKeyData
} from './cache';
