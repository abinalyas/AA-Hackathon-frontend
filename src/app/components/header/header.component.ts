import { Component, OnInit } from '@angular/core';
import { CookiesService } from 'src/vendor/commonImports';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(    
    private route: Router,
    private cookie: CookiesService) {   }

  ngOnInit(): void {
  }

  logout(){

    this.cookie.removeAllCookies()
    this.route.navigateByUrl('login')

  }

}
