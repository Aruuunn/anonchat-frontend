import {Injectable} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import urlJoin from 'url-join';
import {HttpClient} from '@angular/common/http';
import {HttpOptions} from './http-options.interface';
import {API_BASE_URL} from '../../../config/api.config';


@Injectable()
export class HttpService {
  constructor(private authService: AuthService, private http: HttpClient) {
  }

  private mapData = map((body: any) => {
    this.authService.updateAccessToken(body?.accessToken);
    return ({
      ...body.data
    });
  });

  private combineUrl(url: string): string {
    return urlJoin(API_BASE_URL, url);
  }

  private mergeHttpOptionsWithCommonOptions(options?: HttpOptions): HttpOptions {
    const accessToken: string | null = this.authService.accessToken;
    return ({
      ...options,
      headers: {...options?.headers, authorization: `Bearer ${accessToken}`},
      withCredentials: true,
    });
  }


  get(
    url: string,
    options?: HttpOptions
  ): Observable<any> {

    return this.http.get(
      this.combineUrl(url),
      this.mergeHttpOptionsWithCommonOptions(options))
      .pipe(this.mapData);
  }


  post(
    url: string,
    body: any,
    options?: HttpOptions,
  ): Observable<any> {
    return this.http.post(
      this.combineUrl(url),
      body,
      this.mergeHttpOptionsWithCommonOptions(options))
      .pipe(this.mapData);
  }
}
