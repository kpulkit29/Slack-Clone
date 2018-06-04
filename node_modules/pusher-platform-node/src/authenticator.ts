import { IncomingMessage } from 'http';
import * as jwt from 'jsonwebtoken';

import {
  AuthenticateOptions,
  AuthenticatePayload,
  AuthenticationResponse,
  ErrorBody,
  TokenResponse,
} from './common';

const DEFAULT_TOKEN_EXPIRY = 24*60*60;
const CLIENT_CREDENTIALS_GRANT_TYPE = 'client_credentials';
const REFRESH_TOKEN_GRANT_TYPE = 'refresh_token';

export interface TokenWithExpiry {
  token: string;
  expires_in: number;
}

export interface RefreshToken {
  token: string;
}

export default class Authenticator {
  constructor(
    private instanceId: string,
    private instanceKeyId: string,
    private instanceKeySecret: string,

    // Customise token expiry
    private tokenExpiry?: number,
  ) {
    if(!this.tokenExpiry) { this.tokenExpiry = DEFAULT_TOKEN_EXPIRY; }
  }

  authenticate(authenticatePayload: AuthenticatePayload, options: AuthenticateOptions): AuthenticationResponse {
    let grantType = authenticatePayload['grant_type'];

    if (grantType !== CLIENT_CREDENTIALS_GRANT_TYPE) {
      return new AuthenticationResponse({
        status: 422,
        body: {
          error: 'token_provider/invalid_grant_type',
          error_description: `The grant_type provided, ${grantType}, is unsupported`,
        }
      })
    }

    return this.authenticateUsingClientCredentials(options);
  }

  authenticateWithRefreshToken(authenticatePayload: AuthenticatePayload, options: AuthenticateOptions): AuthenticationResponse {
    let grantType = authenticatePayload['grant_type'];

    switch (grantType) {
      case CLIENT_CREDENTIALS_GRANT_TYPE:
        return this.authenticateUsingClientCredentials(options, true);
      case REFRESH_TOKEN_GRANT_TYPE:
        let oldRefreshToken = authenticatePayload[REFRESH_TOKEN_GRANT_TYPE];
        return this.authenticateUsingRefreshToken(oldRefreshToken, options);
      default:
        return new AuthenticationResponse({
          status: 422,
          body: {
            error: 'token_provider/invalid_grant_type',
            error_description: `The grant_type provided, ${grantType}, is unsupported`,
          }
        })
    }
  }

  private authenticateUsingClientCredentials(options: AuthenticateOptions, withRefreshToken = false): AuthenticationResponse {
    let { token } = this.generateAccessToken(options);
    let tokenExpiry = options.tokenExpiry || this.tokenExpiry;

    let body: TokenResponse = {
      access_token: token,
      expires_in: tokenExpiry,
      token_type: 'bearer',
    }

    if (withRefreshToken) {
      let refreshToken = this.generateRefreshToken(options);
      body['refresh_token'] = refreshToken.token;
    }

    return new AuthenticationResponse({
      status: 200,
      body
    })
  }

  private authenticateUsingRefreshToken(oldRefreshToken: string, options: AuthenticateOptions): AuthenticationResponse {
      let decoded: any;
      let tokenExpiry = options.tokenExpiry || this.tokenExpiry;

      try {
        decoded = jwt.verify(oldRefreshToken, this.instanceKeySecret, {
          issuer: `api_keys/${this.instanceKeyId}`,
        });
      } catch (e) {
        let description: string = (e instanceof jwt.TokenExpiredError) ? 'Refresh token has expired' : 'Refresh token is invalid';

        return new AuthenticationResponse({
          status: 401,
          body: {
            error: 'token_provider/invalid_refresh_token',
            error_description: description,
          }
        })
      }

      if (decoded.refresh !== true) {
        return new AuthenticationResponse({
          status: 401,
          body: {
            error: 'token_provider/invalid_refresh_token',
            error_description: 'Refresh token does not have a refresh claim',
          }
        })
      }

      if (options.userId !== decoded.sub) {
        return new AuthenticationResponse({
          status: 401,
          body: {
            error: 'token_provider/invalid_refresh_token',
            error_description: 'Refresh token has an invalid user id',
          }
        })
      }

      let newAccessToken = this.generateAccessToken(options);
      let newRefreshToken = this.generateRefreshToken(options);

      return new AuthenticationResponse({
        status: 200,
        body: {
          access_token: newAccessToken.token,
          token_type: 'bearer',
          expires_in: tokenExpiry,
          refresh_token: newRefreshToken.token,
        }
      });
  }

  generateAccessToken(options: AuthenticateOptions): TokenWithExpiry {
    let now = Math.floor(Date.now() / 1000);
    let tokenExpiry = options.tokenExpiry || this.tokenExpiry;

    let claims = {
      instance: this.instanceId,
      iss: `api_keys/${this.instanceKeyId}`,
      iat: now,
      exp: now + tokenExpiry,
      sub: options.userId,
      su: options.su,
      ...options.serviceClaims
    };

    return {
      token: jwt.sign(claims, this.instanceKeySecret),
      expires_in: tokenExpiry,
    };
  }

  private generateRefreshToken(options: AuthenticateOptions): RefreshToken {
    let now = Math.floor(Date.now() / 1000);

    let claims = {
      instance: this.instanceId,
      iss: `api_keys/${this.instanceKeyId}`,
      iat: now,
      refresh: true,
      sub: options.userId,
    };

    return {
      token: jwt.sign(claims, this.instanceKeySecret),
    };
  }
}
