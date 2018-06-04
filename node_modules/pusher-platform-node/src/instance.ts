import extend = require('extend');
import { IncomingMessage } from 'http';
import * as jwt from 'jsonwebtoken';

import Authenticator, { TokenWithExpiry } from './authenticator';
import BaseClient from './base_client';
import {
  AuthenticateOptions,
  AuthenticatePayload,
  AuthenticationResponse,
  RequestOptions,
  IncomingMessageWithBody,
  ErrorResponse,
} from './common';

const HOST_BASE = 'pusherplatform.io';
const HTTPS_PORT = 443;

export interface InstanceOptions {
  locator: string;
  key: string;
  serviceName: string;
  serviceVersion: string;

  port?: number;
  host?: string;
  client?: BaseClient;
}

export default class Instance {
  private client: BaseClient;
  private id: string;
  private serviceName: string;
  private serviceVersion: string;
  private cluster: string;
  private platformVersion: string;

  private keyId: string;
  private keySecret: string;
  private host: string;

  private authenticator: Authenticator;

  constructor(options: InstanceOptions) {

    if (!options.locator) throw new Error('Expected `instanceLocator` property in Instance options!');
    if (options.locator.split(":").length !== 3) throw new Error('The `locator` property is in the wrong format!');
    if(!options.serviceName) throw new Error('Expected `serviceName` property in Instance options!');
    if(!options.serviceVersion) throw new Error('Expected `serviceVersion` property in Instance otpions!');

    let splitInstance = options.locator.split(":");
    this.platformVersion = splitInstance[0];
    this.cluster = splitInstance[1];
    this.id = splitInstance[2];

    this.serviceName = options.serviceName;
    this.serviceVersion = options.serviceVersion;

    let keyParts = options.key.match(/^([^:]+):(.+)$/);
    if (!keyParts) {
      throw new Error('Invalid instance key');
    }
    this.keyId = keyParts[1];
    this.keySecret = keyParts[2];

    this.client = options.client || new BaseClient({
      host: options.host || `${this.cluster}.${HOST_BASE}`,
      instanceId: this.id,
      serviceName: this.serviceName,
      serviceVersion: this.serviceVersion,
      port: options.port || HTTPS_PORT
    });

    this.authenticator = new Authenticator(
      this.id, this.keyId, this.keySecret
    );
  }

  request(options: RequestOptions): Promise<IncomingMessageWithBody> {
    if (options.jwt == null) {
      options = extend(options, { jwt: `${this.authenticator.generateAccessToken({ su: true }).token}` });
    }
    return this.client.request(options);
  }

  authenticate(authenticatePayload: AuthenticatePayload, options: AuthenticateOptions): AuthenticationResponse {
    return this.authenticator.authenticate(authenticatePayload, options);
  }

  authenticateWithRefreshToken(authenticatePayload: AuthenticatePayload, options: AuthenticateOptions): AuthenticationResponse {
    return this.authenticator.authenticateWithRefreshToken(authenticatePayload, options);
  }

  generateAccessToken(options: AuthenticateOptions): TokenWithExpiry {
    return this.authenticator.generateAccessToken(options);
  }
}
