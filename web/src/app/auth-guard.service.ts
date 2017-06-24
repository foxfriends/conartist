import { Injectable, Inject } from '@angular/core';
import * as decode from 'jwt-decode';
import { CanActivate, Router } from '@angular/router';
import APIService from './api/api.service';

@Injectable()
export default class AuthGuardService implements CanActivate {
  constructor(@Inject(APIService) private api: APIService, @Inject(Router) private router: Router) {}

  async canActivate(): Promise<boolean> {
    // if the token exists and has not expired, skip sign in page
    const token = localStorage.getItem('authtoken');
    if(!token) { return false; }
    try {
      const { exp } = decode(token);
      if(new Date(exp * 1000) < new Date()) {
        return false;
      }

      const newToken = await this.api.reauthorize().toPromise();
      localStorage.setItem('authtoken', newToken);
      return true;
    } catch(_) {
      localStorage.removeItem('authtoken');
      this.router.navigate(['sign-in']);
      return false;
    }
  }
}
