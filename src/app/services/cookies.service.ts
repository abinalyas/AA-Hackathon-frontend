import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CookiesService {
  secureconnection = false;
  constructor(
    private cookie: CookieService,
    private router: Router
  ) { }

  getCookie(key: string): any {
    return this.cookie.get(key);
  }

  setCookie(key: string, value): void {
    // if (environment.production) { this.secureconnection = true; } //remove for prodection
    this.cookie.set(key, value, 1, '', '', this.secureconnection, 'None');
  }

  removeAllCookies() {
    this.cookie.deleteAll("/");
    localStorage.clear();
  }

}
