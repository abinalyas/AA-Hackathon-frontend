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

import { CreateTemplateReq } from '../models/create-template-req';
import { GuidResponse } from '../models/guid-response';
import { TemplateDetail } from '../models/template-detail';

@Injectable({
  providedIn: 'root',
})
export class TemplateService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiTemplatesGet
   */
  static readonly ApiTemplatesGetPath = '/api/templates';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiTemplatesGet$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiTemplatesGet$Plain$Response(params?: {
  }): Observable<StrictHttpResponse<Array<TemplateDetail>>> {

    const rb = new RequestBuilder(this.rootUrl, TemplateService.ApiTemplatesGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<TemplateDetail>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiTemplatesGet$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiTemplatesGet$Plain(params?: {
  }): Observable<Array<TemplateDetail>> {

    return this.apiTemplatesGet$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<Array<TemplateDetail>>) => r.body as Array<TemplateDetail>)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiTemplatesGet$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiTemplatesGet$Json$Response(params?: {
  }): Observable<StrictHttpResponse<Array<TemplateDetail>>> {

    const rb = new RequestBuilder(this.rootUrl, TemplateService.ApiTemplatesGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<TemplateDetail>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiTemplatesGet$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiTemplatesGet$Json(params?: {
  }): Observable<Array<TemplateDetail>> {

    return this.apiTemplatesGet$Json$Response(params).pipe(
      map((r: StrictHttpResponse<Array<TemplateDetail>>) => r.body as Array<TemplateDetail>)
    );
  }

  /**
   * Path part for operation apiTemplatesPost
   */
  static readonly ApiTemplatesPostPath = '/api/templates';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiTemplatesPost$Plain()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiTemplatesPost$Plain$Response(params?: {
    body?: CreateTemplateReq
  }): Observable<StrictHttpResponse<GuidResponse>> {

    const rb = new RequestBuilder(this.rootUrl, TemplateService.ApiTemplatesPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<GuidResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiTemplatesPost$Plain$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiTemplatesPost$Plain(params?: {
    body?: CreateTemplateReq
  }): Observable<GuidResponse> {

    return this.apiTemplatesPost$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<GuidResponse>) => r.body as GuidResponse)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiTemplatesPost$Json()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiTemplatesPost$Json$Response(params?: {
    body?: CreateTemplateReq
  }): Observable<StrictHttpResponse<GuidResponse>> {

    const rb = new RequestBuilder(this.rootUrl, TemplateService.ApiTemplatesPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<GuidResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiTemplatesPost$Json$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiTemplatesPost$Json(params?: {
    body?: CreateTemplateReq
  }): Observable<GuidResponse> {

    return this.apiTemplatesPost$Json$Response(params).pipe(
      map((r: StrictHttpResponse<GuidResponse>) => r.body as GuidResponse)
    );
  }

  /**
   * Path part for operation apiTemplatesTemplateIdGet
   */
  static readonly ApiTemplatesTemplateIdGetPath = '/api/templates/{templateId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiTemplatesTemplateIdGet$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiTemplatesTemplateIdGet$Plain$Response(params: {
    templateId: string;
  }): Observable<StrictHttpResponse<TemplateDetail>> {

    const rb = new RequestBuilder(this.rootUrl, TemplateService.ApiTemplatesTemplateIdGetPath, 'get');
    if (params) {
      rb.path('templateId', params.templateId, {});
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<TemplateDetail>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiTemplatesTemplateIdGet$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiTemplatesTemplateIdGet$Plain(params: {
    templateId: string;
  }): Observable<TemplateDetail> {

    return this.apiTemplatesTemplateIdGet$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<TemplateDetail>) => r.body as TemplateDetail)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiTemplatesTemplateIdGet$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiTemplatesTemplateIdGet$Json$Response(params: {
    templateId: string;
  }): Observable<StrictHttpResponse<TemplateDetail>> {

    const rb = new RequestBuilder(this.rootUrl, TemplateService.ApiTemplatesTemplateIdGetPath, 'get');
    if (params) {
      rb.path('templateId', params.templateId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<TemplateDetail>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiTemplatesTemplateIdGet$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiTemplatesTemplateIdGet$Json(params: {
    templateId: string;
  }): Observable<TemplateDetail> {

    return this.apiTemplatesTemplateIdGet$Json$Response(params).pipe(
      map((r: StrictHttpResponse<TemplateDetail>) => r.body as TemplateDetail)
    );
  }

  /**
   * Path part for operation apiTemplatesTemplateIdPut
   */
  static readonly ApiTemplatesTemplateIdPutPath = '/api/templates/{templateId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiTemplatesTemplateIdPut()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiTemplatesTemplateIdPut$Response(params: {
    templateId: string;
    body?: CreateTemplateReq
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, TemplateService.ApiTemplatesTemplateIdPutPath, 'put');
    if (params) {
      rb.path('templateId', params.templateId, {});
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiTemplatesTemplateIdPut$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiTemplatesTemplateIdPut(params: {
    templateId: string;
    body?: CreateTemplateReq
  }): Observable<void> {

    return this.apiTemplatesTemplateIdPut$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation apiTemplatesTemplateIdDelete
   */
  static readonly ApiTemplatesTemplateIdDeletePath = '/api/templates/{templateId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiTemplatesTemplateIdDelete()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiTemplatesTemplateIdDelete$Response(params: {
    templateId: string;
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, TemplateService.ApiTemplatesTemplateIdDeletePath, 'delete');
    if (params) {
      rb.path('templateId', params.templateId, {});
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiTemplatesTemplateIdDelete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiTemplatesTemplateIdDelete(params: {
    templateId: string;
  }): Observable<void> {

    return this.apiTemplatesTemplateIdDelete$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
