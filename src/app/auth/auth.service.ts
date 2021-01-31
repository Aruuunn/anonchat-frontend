import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';


interface HttpOptions {
  headers?: HttpHeaders | { [p: string]: string | string[] } | undefined;
  observe?: 'body' | undefined;
  params?: HttpParams | { [p: string]: string | string[] } | undefined;
  reportProgress?: boolean | undefined;
  responseType?: 'json' | undefined;
  withCredentials?: boolean | undefined;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  accessToken: string | null;
  user?: User;
}

const initialAuthState: AuthState = {
  accessToken: null
};

@Injectable()
export class AuthService implements OnDestroy {
  private readonly API_BASE_URL = 'http://localhost:8000';
  public state: BehaviorSubject<AuthState> = new BehaviorSubject<AuthState>(initialAuthState);

  constructor(
    private http: HttpClient) {
  }

  setUser(user: User): void {
    this.state.next({...this.state.getValue(), user});
  }

  updateAccessToken(newAccessToken: string | undefined): void {
    if (!newAccessToken) {
      return;
    }
    this.state.next({...this.state.getValue(), accessToken: newAccessToken});
  }

  post(
    url: string,
    body: any,
    options?: HttpOptions
  ): Observable<any> {
    const accessToken: string | null = this.state.getValue().accessToken;
    return this.http.post(this.API_BASE_URL + url, body, {
      ...options,
      headers: {...options?.headers, authorization: `Bearer ${accessToken}`},
      withCredentials: true,
      // tslint:disable-next-line:no-shadowed-variable
    }).pipe(map((body: any) => {
        this.updateAccessToken(body?.accessToken);
        return ({
          ...body.data
        });
      })
    );
  }

  ngOnDestroy(): void {
    this.state.unsubscribe();
  }
}
