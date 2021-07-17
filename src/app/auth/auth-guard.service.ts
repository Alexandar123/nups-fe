import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import * as jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService{

  constructor(public auth: AuthService, router?: Router) {
  }
  canActivate(): boolean {
    let auth = false;
    let token = localStorage.getItem('token');

    if (token != undefined && token.length > 0) {
      let decoded = jwt_decode(token);
      let role = decoded['https://geoapp.nedovicm.com/user_authorization'][0]
      if (role == 'admin') {
        return true;
      } else {
        this.auth.router.navigate(['/'])
        return false;
      }
    } else {
      this.auth.router.navigate(['/'])
      return false;
    }
  }
}
