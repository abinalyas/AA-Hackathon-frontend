import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { CookiesService } from './cookies.service';

@Injectable({
    providedIn: 'root'
})
export class BackEndService {


    constructor(
        private http: HttpClient, private CookiesService: CookiesService,
    ) { }


    public post(path, data: any) {
        var access_token = this.CookiesService.getCookie('access_token');
        if(!access_token){
            access_token = localStorage.getItem('a_token');
        }
        const body = JSON.stringify(data);
        const httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token
        });
        return this.http.post(path, body, { headers: httpHeaders })
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }

    // public get(path, data = {}) {
    //     return this.http.get(path, { params: data }).map(this.extractData)
    //         .catch(this.handleErrorObservable);
    // }
    // public getFile(path, data = {}) {
    //     const body = JSON.stringify(data);
    //     const httpHeaders = new HttpHeaders({
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Bearer ' + this.CookiesService.getCookie('access_token')
    //     });
    //     return this.http.get(path, { params: data , headers: httpHeaders, responseType: 'blob'})
    //         .catch(this.handleErrorObservable);
    // }

    private extractData(res: Response) {
        let body = res;
        return body || {};
    }
    private handleErrorObservable(error: Response | any) {
       if (error.status === 401) {
           alert('Session expired!')
           window.location.assign("/")
        }else{
            return "error";
        }
    }

    // public uploadFile(formData, path) {
    //     const httpHeaders = new HttpHeaders({
    //         'Authorization': 'Bearer ' + this.CookiesService.getCookie('access_token')
    //     });
    //     return this.http.post(path, formData, { headers: httpHeaders })
    //         .map(this.extractData)
    //         .catch(this.handleErrorObservable);
    // }

}
