import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Router } from '@angular/router';
import { catchError, finalize, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CookiesService } from './cookies.service';
// import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(
    private _http: HttpClient,
    private cookie: CookiesService,
    // private dialog: MatDialog,
    private router: Router,
    // private loader: LoaderService
  ) {
  }

  private addTokenToHeader(authorize = true) {
    let header = new HttpHeaders()
    if(authorize){
      header = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + this.cookie.getCookie('Token'),
        // 'X-Token': this.cookie.getCookie('Token') === undefined ? 'undefined' : this.cookie.getCookie('Token'),
        // 'Role': this.cookie.getCookie('UserRole') === undefined ? 'undefined' : this.cookie.getCookie('UserRole')
      });
    }
    else{
      header = new HttpHeaders({
        'Content-Type': 'application/json',
      });
    }
    return header;
  }


  get(url: string, params?: object, authorize = true, showLoader = true): Observable<any> {
    let headers = new HttpHeaders();
    headers = this.addTokenToHeader(authorize);
// enable loader

    let httpParams = new HttpParams();
    if (params !== null && params !== undefined) {
      Object.keys(params).forEach(function (key) {
        httpParams = httpParams.append(key, params[key]);
      });
    }
    return this._http.get(url, { headers: headers, params: httpParams }).pipe(
      tap((response: HttpResponse<any>) => <any>response),
      catchError(err => this.handleError(err)),
      finalize(() => {
// disable loader
      })
    );
  }

  postUrlEncoded(url: string, query_params: any, model: any, showLoader: boolean = true): Observable<any> {
// enable loader

    const query_string = new URLSearchParams();
    if (query_params) {
      for (const key in query_params) {
        if (key) {
          query_string.set(key, query_params[key] === null ? '' : query_params[key]);
        }
      }
    }

    const body = JSON.stringify(model);
    url = url + '?' + query_string;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.post(url, body, { headers: headers }).pipe(
      tap((response: HttpResponse<any>) => <any>response),
      catchError(err => this.handleError(err)),
      finalize(() => {
// disable loader

      })
    );
  }
  post(url: string, model: any, authorize = true, showLoader = true): Observable<any> {
    const body = JSON.stringify(model);
    let headers = new HttpHeaders();
    headers = this.addTokenToHeader(authorize);
// enable loader
    return this._http.post(url, body, { headers: headers }).pipe(
      tap((response: HttpResponse<any>) => <any>response),
      catchError(err => this.handleError(err)),
      finalize(() => {
// disable loader

      })
    );
  }
  put(url: string, id: number, model: any, authorize?: boolean, showLoader: boolean = true): Observable<any> {
    const body = JSON.stringify(model);
    let headers = new HttpHeaders();
    headers = this.addTokenToHeader();
// enable loader

    return this._http.put(url + id, body, { headers: headers }).pipe(
      tap((response: HttpResponse<any>) => <any>response),
      catchError(err => this.handleError(err)),
      finalize(() => {
// disable loader

      })
    );
  }

  delete(url: string, id: number, showLoader: boolean = true): Observable<any> {
    let headers = new HttpHeaders();
    headers = this.addTokenToHeader();
    let uid;
// enable loader

    return this._http.delete(url + id, { headers: headers }).pipe(
      tap((response: HttpResponse<any>) => <any>response),
      catchError(err => this.handleError(err)),
      finalize(() => {
// disable loader

      })
    );
  }

  postFile(url: string, model: any, authorize?: boolean, showLoader: boolean = true): Observable<any> {
    const body = model;
    let headers = new HttpHeaders();
    headers = this.addTokenToHeader();
// enable loader

    return this._http.post(url, body, { headers: headers }).pipe(
      tap((response: HttpResponse<any>) => <any>response),
      catchError(err => this.handleError(err)),
      finalize(() => {
// disable loader

      })
    );
  }

  getFile(url: string, params?: object, authorize?: boolean, showLoader: boolean = true): Observable<any> {
    let headers = new HttpHeaders();
    headers = this.addTokenToHeader();
// enable loader

    return this._http.get(url, { headers: headers }).pipe(
      catchError(err => this.handleError(err)),
      finalize(() => {
// disable loader

      })
    );
  }

  // File byte array convertion
  base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      const ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }


  private handleError(error: HttpResponse<any>) {
    if (error.status === 401) {
      const message = 'The requested resource is not accessible';
      // const cusAlert = this.dialog.open(CustomAlertComponent);
      // cusAlert.componentInstance.AlertData = {
      //   ca_title: 'Access Denied',
      //   ca_header: '',
      //   ca_message: message,
      //   CriticalIcon: true,
      //   WarningIcon: false,
      //   InfoIcon: false,
      //   AlertType: AlertTypes.Info
      // };
    }
    // console.log(error);
    return throwError(error || 'Server error');
  }
}
