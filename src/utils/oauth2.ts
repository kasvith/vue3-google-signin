import type { CodeClientConfig, TokenResponse } from "@/interfaces/oauth2";

/**
 * Helper method for [google.accounts.oauth2.hasGrantedAllScopes](https://developers.google.com/identity/oauth2/web/reference/js-reference#google.accounts.oauth2.hasGrantedAllScopes)
 *
 * @export
 * @param {TokenResponse} tokenResponse - A valid access token
 * @param {string} firstScope - first scope
 * @param {...string[]} restScopes - other scopes
 * @return {*}  {boolean}
 */
export function hasGrantedAllScopes(
  tokenResponse: TokenResponse,
  firstScope: string,
  ...restScopes: string[]
): boolean {
  return (
    window.google?.accounts.oauth2.hasGrantedAllScopes(
      tokenResponse,
      firstScope,
      ...restScopes,
    ) || false
  );
}

/**
 * Helper method for [google.accounts.oauth2.hasGrantedAnyScopes](https://developers.google.com/identity/oauth2/web/reference/js-reference#google.accounts.oauth2.hasGrantedAnyScopes)
 *
 * @export
 * @param {TokenResponse} tokenResponse - A valid access token
 * @param {string} firstScope - first scope
 * @param {...string[]} restScopes - other scopes
 * @return {*}  {boolean}
 */
export function hasGrantedAnyScopes(
  tokenResponse: TokenResponse,
  firstScope: string,
  ...restScopes: string[]
): boolean {
  return (
    window.google?.accounts.oauth2.hasGrantedAnyScope(
      tokenResponse,
      firstScope,
      ...restScopes,
    ) || false
  );
}

/**
 * Helper method for [google.accounts.oauth2.revoke](https://developers.google.com/identity/oauth2/web/reference/js-reference#google.accounts.oauth2.revoke)
 *
 * @export
 * @param {string} accessToken
 * @param {() => void} [done]
 */
export function revokeAccessToken(accessToken: string, done?: () => void) {
  window.google?.accounts.oauth2.revoke(accessToken, () => {
    done?.();
  });
}

export type ImplicitFlowOptions = Omit<
  CodeClientConfig,
  "redirect" | "callback" | "ux_mode"
>;

/**
 * Get the OAuth2 redirect URL for login with implicit flow
 *
 * @export
 * @param {ImplicitFlowOptions} options
 * @return {string}
 */
export function buildCodeRequestRedirectUrl(
  options: ImplicitFlowOptions,
): string {
  const baseUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const queryParams = new URLSearchParams({
    gsiwebsdk: "3",
    client_id: options.client_id,
    scope: options.scope,
    include_granted_scopes: "true",
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
  });

  if (options.hint) queryParams.append("hint", options.hint);
  if (options.hosted_domain)
    queryParams.append("hosted_domain", options.hosted_domain);
  if (options.redirect_uri === undefined) {
    queryParams.append("redirect_uri", window.origin);
  } else {
    queryParams.append("redirect_uri", options.redirect_uri);
  }

  if (options.select_account === undefined) {
    queryParams.append("select_account", "false");
  } else {
    queryParams.append("select_account", `${options.select_account}`);
  }

  if (options.enable_serial_consent === undefined) {
    queryParams.append("enable_serial_consent", "false");
  } else {
    queryParams.append(
      "enable_serial_consent",
      `${options.enable_serial_consent}`,
    );
  }

  if (options.state) queryParams.append("state", options.state);

  return `${baseUrl}?${queryParams.toString()}`;
}
