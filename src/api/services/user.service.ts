/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { CreateUserWithBusinessReq } from '../models/create-user-with-business-req';
import { SignInReq } from '../models/sign-in-req';
import { StringResponse } from '../models/string-response';
import { UserDetail } from '../models/user-detail';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiUsersGet
   */
  static readonly ApiUsersGetPath = '/api/users';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiUsersGet$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiUsersGet$Plain$Response(params?: {
  }): Observable<StrictHttpResponse<Array<UserDetail>>> {

    const rb = new RequestBuilder(this.rootUrl, UserService.ApiUsersGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<UserDetail>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiUsersGet$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiUsersGet$Plain(params?: {
  }): Observable<Array<UserDetail>> {

    return this.apiUsersGet$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<Array<UserDetail>>) => r.body as Array<UserDetail>)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiUsersGet$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiUsersGet$Json$Response(params?: {
  }): Observable<StrictHttpResponse<Array<UserDetail>>> {

    const rb = new RequestBuilder(this.rootUrl, UserService.ApiUsersGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<UserDetail>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiUsersGet$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiUsersGet$Json(params?: {
  }): Observable<Array<UserDetail>> {

    return this.apiUsersGet$Json$Response(params).pipe(
      map((r: StrictHttpResponse<Array<UserDetail>>) => r.body as Array<UserDetail>)
    );
  }

  /**
   * Path part for operation apiUsersPost
   */
  static readonly ApiUsersPostPath = '/api/users';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiUsersPost$Plain()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiUsersPost$Plain$Response(params?: {
    body?: CreateUserWithBusinessReq
  }): Observable<StrictHttpResponse<StringResponse>> {

    const rb = new RequestBuilder(this.rootUrl, UserService.ApiUsersPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<StringResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiUsersPost$Plain$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiUsersPost$Plain(params?: {
    body?: CreateUserWithBusinessReq
  }): Observable<StringResponse> {

    return this.apiUsersPost$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<StringResponse>) => r.body as StringResponse)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiUsersPost$Json()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiUsersPost$Json$Response(params?: {
    body?: CreateUserWithBusinessReq
  }): Observable<StrictHttpResponse<StringResponse>> {

    const rb = new RequestBuilder(this.rootUrl, UserService.ApiUsersPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<StringResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiUsersPost$Json$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiUsersPost$Json(params?: {
    body?: CreateUserWithBusinessReq
  }): Observable<StringResponse> {

    return this.apiUsersPost$Json$Response(params).pipe(
      map((r: StrictHttpResponse<StringResponse>) => r.body as StringResponse)
    );
  }

  /**
   * Path part for operation apiUsersSigninPost
   */
  static readonly ApiUsersSigninPostPath = '/api/users/signin';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiUsersSigninPost$Plain()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiUsersSigninPost$Plain$Response(params?: {
    body?: SignInReq
  }): Observable<StrictHttpResponse<StringResponse>> {

    const rb = new RequestBuilder(this.rootUrl, UserService.ApiUsersSigninPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<StringResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiUsersSigninPost$Plain$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiUsersSigninPost$Plain(params?: {
    body?: SignInReq
  }): Observable<StringResponse> {

    return this.apiUsersSigninPost$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<StringResponse>) => r.body as StringResponse)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiUsersSigninPost$Json()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiUsersSigninPost$Json$Response(params?: {
    body?: SignInReq
  }): Observable<StrictHttpResponse<StringResponse>> {

    const rb = new RequestBuilder(this.rootUrl, UserService.ApiUsersSigninPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<StringResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiUsersSigninPost$Json$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiUsersSigninPost$Json(params?: {
    body?: SignInReq
  }): Observable<StringResponse> {

    return this.apiUsersSigninPost$Json$Response(params).pipe(
      map((r: StrictHttpResponse<StringResponse>) => r.body as StringResponse)
    );
  }

}
