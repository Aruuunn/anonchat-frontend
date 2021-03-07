import { HttpHeaders, HttpParams } from '@angular/common/http';

export interface HttpOptions {
  headers?: HttpHeaders | { [p: string]: string | string[] } | undefined;
  observe?: 'body' | undefined;
  params?: HttpParams | { [p: string]: string | string[] } | undefined;
  reportProgress?: boolean | undefined;
  responseType?: 'json' | undefined;
  withCredentials?: boolean | undefined;
}
