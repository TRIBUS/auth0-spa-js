import { Auth0Client } from './Auth0Client';
import { Auth0ClientOptions } from './global';

import './global';

export * from './global';

/**
 * Asynchronously creates the Auth0Client instance and calls `checkSession`.
 *
 * **Note:** There are caveats to using this in a private browser tab, which may not silently authenticae
 * a user on page refresh. Please see [the checkSession docs](https://auth0.github.io/auth0-spa-js/classes/Auth0Client.html#checksession) for more info.
 *
 * @param options The client options
 * @returns An instance of Auth0Client
 */
export async function createAuth0Client() {
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

    const ezClient = new Auth0Client(options);

    if (location.search.includes("state=") &&
        (location.search.includes("code=") ||
        location.search.includes("error="))) {
      await ezClient.handleRedirectCallback();

      if (await ezClient.isAuthenticated()) {
        if (ezButton.dataset.callback_fn) {
          const fnStr = `${ezButton.dataset.callback_fn}`;
          let callBack = (window as { [key: string]: any })[fnStr] as Function;

          callBack(await ezClient.getUser());
        }
      }
      else {
        // TODO: Error handling?
      }
    }

    ezButton.addEventListener("click", (e) => {
      e.preventDefault();

      if (ezButton.dataset.redirect_uri) {
        ezClient.loginWithRedirect();
      }
      else if (ezButton.dataset.callback_fn) {
        // TODO: Login w/ popup requires response_mode: 'web_message' support w/ IDP
      }
    });
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
