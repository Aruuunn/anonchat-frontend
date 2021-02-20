import {Injectable} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import urlJoin from 'url-join';
import {HttpClient} from '@angular/common/http';
import {HttpOptions} from './http-options.interface';
import {API_BASE_URL} from '../../../config/api.config';
import {Router} from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
  ) {
  }

  private mapData = map((body: any) => {
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

  async refreshAccessToken(): Promise<void> {
    try {
      const {accessToken} = await this.http.get(
        this.combineUrl('/auth/access-token/refresh'),
        this.mergeHttpOptionsWithCommonOptions({}),
      )
        .pipe(this.mapData).toPromise();

      this.authService.accessToken = accessToken;
    } catch (e) {
      await this.router.navigateByUrl('/welcome');
    }
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
