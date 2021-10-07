import { Component, OnInit } from '@angular/core';
import { HttpService, webApiUrls, map, catchError, of, CookiesService } from 'src/vendor/commonImports';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private themeWrapper = document.querySelector('body');

  constructor(
    private route: Router,
    private http: HttpService,
    private cookie: CookiesService,
  ) { }

  userModel = {
    name:"",
    businessName:"",
    email: "name@email.com",
    phone: "",
    industryType: "",
    password: ""
  }

  ngOnInit(): void {

  }

  login(){
    // this.http.post(webApiUrls.login,this.userModel,false).subscribe((result) => {
    //   this.cookie.setCookie('Token', result["token"]);
    //   // this.auth.isUserAuthenticated();
    //     this.route.navigateByUrl('home');
    //     // this.themeWrapper.style.setProperty('--cardColor', "#adfadaf");

    //   });

      this.route.navigateByUrl('home');

  }

  

}
