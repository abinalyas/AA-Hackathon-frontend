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

import { BusinessDetail } from '../models/business-detail';

@Injectable({
  providedIn: 'root',
})
export class BusinessService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiBusinessesIdGet
   */
  static readonly ApiBusinessesIdGetPath = '/api/businesses/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessesIdGet$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessesIdGet$Plain$Response(params: {
    id: string;
  }): Observable<StrictHttpResponse<BusinessDetail>> {

    const rb = new RequestBuilder(this.rootUrl, BusinessService.ApiBusinessesIdGetPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<BusinessDetail>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiBusinessesIdGet$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessesIdGet$Plain(params: {
    id: string;
  }): Observable<BusinessDetail> {

    return this.apiBusinessesIdGet$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<BusinessDetail>) => r.body as BusinessDetail)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessesIdGet$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessesIdGet$Json$Response(params: {
    id: string;
  }): Observable<StrictHttpResponse<BusinessDetail>> {

    const rb = new RequestBuilder(this.rootUrl, BusinessService.ApiBusinessesIdGetPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<BusinessDetail>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiBusinessesIdGet$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessesIdGet$Json(params: {
    id: string;
  }): Observable<BusinessDetail> {

    return this.apiBusinessesIdGet$Json$Response(params).pipe(
      map((r: StrictHttpResponse<BusinessDetail>) => r.body as BusinessDetail)
    );
  }

}
