import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookiesService } from './cookies.service';
import { HttpService } from './http.service';
import { webApiUrls} from 'src/vendor/commonImports';


@Injectable({
  providedIn: 'root'
})
@Injectable()
export class AuthService {

  Token: string = null;
  UserInfo: object = null;

  constructor(private cookie: CookiesService,
    private router: Router,
    private http: HttpService) { }

  // isUserAuthenticated() {
  //   this.Token = this.cookie.getCookie('Token');
    
  //   return new Promise<boolean>((resolve, reject) => {
  //     if (this.Token) {
  //       this.http.get(environment.apiUrl + 'isValidUser',{}).subscribe((res) => {
  //         resolve(res);
  //       });
  //     } else {
  //       resolve(false);
  //     }
  //   });
  // }

  isUserAuthenticated() {

    this.Token = this.cookie.getCookie('Token');
    return new Promise<boolean>((resolve, reject) => {
      if (this.Token) {
        this.http.get(webApiUrls.verifyToken, {}, true).subscribe((res) => {
          resolve(res);
        });
      } else {
        resolve(false);
      }
    });
  }

}

