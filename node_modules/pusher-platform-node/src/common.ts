import { IncomingMessage } from 'http';

export type Headers = {
  [key: string]: string | string[];
};

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

export interface ErrorBody {
  error: string;
  error_description: string;
  error_uri?: string;
}

export class AuthenticationResponse {
  readonly status: number;
  readonly headers: Headers;
  readonly body: TokenResponse | ErrorBody;

  constructor(options: {
    status: number,
    headers?: Headers,
    body: TokenResponse | ErrorBody,
  }) {
    this.status = options.status;
    this.headers = options.headers || {};
    this.body = options.body;
  }
}

export class ErrorResponse {
  readonly status: number;
  readonly headers: Headers;
  readonly error: string;
  readonly error_description: string;
  readonly error_uri?: string;

  constructor(options: {
    status: number,
    headers?: Headers,
    error: string,
    error_description: string,
    error_uri?: string,
  }) {
    this.status = options.status;
    this.headers = options.headers || {};
    this.error = options.error;
    this.error_description = options.error_description;
    this.error_uri = options.error_uri;
  }
}

export interface RequestOptions {
  method: string;
  path: string;
  jwt?: string;
  headers?: Headers;
  body?: any;
  qs?: object;
}

export interface AuthenticateOptions {
  userId?: string;
  serviceClaims?: any;
  su?: boolean
  tokenExpiry?: number;
}

export interface AuthenticatePayload {
  grant_type: string;
  refresh_token?: string;
}

export interface IncomingMessageWithBody extends IncomingMessage {
  body?: any;
}
