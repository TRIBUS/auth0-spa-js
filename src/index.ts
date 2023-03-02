import { Auth0Client } from './Auth0Client';
import { Auth0ClientOptions } from './global';

import './global';

export * from './global';

(function init() {
    _createButton();
    _handleCallback();
})();

export async function bindButton() {
  const ezClient = newClient();

  if (ezClient) {
    const ezButton = document.getElementById('ezLogin');
    const ezFrame = document.querySelector<HTMLIFrameElement>("#ezFrame");

    ezFrame?.contentWindow?.document?.getElementById('ezAnchor')?.addEventListener("click", (e) => {
      e.preventDefault();

      if (ezButton?.dataset?.redirect_uri) {
        ezClient.loginWithRedirect();
      }
      else if (ezButton?.dataset?.callback_fn) {
        // TODO: Login w/ popup requires response_mode: 'web_message' support w/ IDP
      }
    });
  }
}

export function newClient() {
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

    return new Auth0Client(options);
  }
}

async function _createButton() {
  const ezButton = document.getElementById('ezLogin');

  if (ezButton) {
    const iframe = window.document.createElement('iframe');
    const html = `<html>
<body onload="parent.auth0.bindButton()" style="margin: 0px; padding: 0px;">
  <a href="javascript:"
     id="ezAnchor"
     style="display: block;
            background-color: #eee;
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

    ezButton.appendChild(iframe);
  }
}

async function _handleCallback() {
  const ezButton = document.getElementById('ezLogin');

  if (ezButton?.dataset?.callback_fn) {
    const ezClient = newClient();

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

export { Auth0Client };

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
