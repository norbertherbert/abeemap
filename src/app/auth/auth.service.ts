import { CONFIG } from '../../environments/environment';
import { ConfigService } from '../config.service';

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as jwtDecode from 'jwt-decode';

import {
  setCookie, getCookie, deleteCookie, generateState, getQueryParams,
} from './auth-tools.module';

@Injectable()
export class AuthService {

  token: string;

  // iss: string;
  // iat: number;
  exp: number;
  userId: string;
  scope: string;
  // customerId: number;

  // roles: string[];

  loggedIn = false;
  loggedIn$ = new BehaviorSubject<boolean>(false);
  // loggedInAsAdmin = false;

  constructor(
    private configService: ConfigService,
  ) {
    const token = getCookie('access_token_' + CONFIG.client_id);
    if (token) {
      this.setSession(token);
    }
  }

  login(redirectURI?: string): void {
    const state = generateState();
    setCookie('state_' + CONFIG.client_id, state, 600, CONFIG.redirect_uri);
    window.location.href = CONFIG.authorizationUrl +
      '?response_type=' + encodeURIComponent(CONFIG.response_type) +
      '&redirect_uri=' + encodeURIComponent(redirectURI ? redirectURI : CONFIG.redirect_uri) +
      '&client_id=' + encodeURIComponent(CONFIG.client_id) +
      '&scope=' + encodeURIComponent(CONFIG.scope) +
      '&state=' + encodeURIComponent(state)
    ;
  }

  setSession(token: string, state?: string) {

    if ( state ) {
      const state1 = getCookie('state_' + CONFIG.client_id);

      if (state1) {
        deleteCookie('state_' + CONFIG.client_id, CONFIG.redirect_uri);
      } else {
        return false;
      }
      if (state !== state1) {
        return false;
      }
    }

    const decodedToken: any = jwtDecode(token);
    if (!decodedToken) {
      return false;
    }

    this.token = token;

    // this.iss = decodedToken.iss;
    // this.iat = +decodedToken.iat;
    this.exp = +decodedToken.exp;
    this.userId = decodedToken.client_id;
    this.scope = decodedToken.scope;
    // this.customerId = +decodedToken.customerId;

    // this.roles = this.scope.split(' ');
    // this.loggedInAsAdmin = ( this.roles.indexOf('admin') !== -1 );

    if (state) {
      setCookie('access_token_' + CONFIG.client_id, this.token, 3600, CONFIG.redirect_uri);
    }

    this.setLoggedIn(true);

    return true;

  }

  deleteSession() {

    this.token = undefined;

    // this.iss = undefined;
    // this.iat = undefined;
    this.exp = undefined;
    this.userId = undefined;
    this.scope = undefined;
    // this.customerId = undefined;

    // this.roles = undefined;
    // this.loggedInAsAdmin = undefined;

    deleteCookie('access_token_' + CONFIG.client_id, CONFIG.redirect_uri);
    this.setLoggedIn(false);

  }

  setLoggedIn(value: boolean) {
    this.loggedIn$.next(value);
    this.loggedIn = value;
  }


  getExp() {
    const d = new Date(1000 * this.exp);
    return (new Date(d.getTime() - d.getTimezoneOffset() * 60000)).toISOString().slice(0, 19).replace('T', ' ');
  }
}
