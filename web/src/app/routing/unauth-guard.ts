import { Injectable, Inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import * as decode from 'jwt-decode';

@Injectable()
export default class UnauthGuard implements CanActivate {
  constructor(
    @Inject(Router) private router: Router,
  ) {}

  async canActivate(): Promise<boolean> {
    const token = localStorage.getItem('authtoken');
    if(!token) { return true; }
    try {
      const { exp } = decode(token);
      if(new Date(exp * 1000) < new Date()) {
        return false;
      }

      this.router.navigate(['dashboard']);
      return false;
    } catch(_) {
      localStorage.removeItem('authtoken');
      return true;
    }
  }
}
