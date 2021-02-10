import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject,} from 'rxjs';

interface AuthState {
  accessToken: string | null;
}

const initialAuthState: AuthState = {
  accessToken: sessionStorage.getItem('accessToken'),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  public state: BehaviorSubject<AuthState> = new BehaviorSubject<AuthState>(initialAuthState);

  constructor() {
  }

  get accessToken(): string | null {
    return this.state.getValue().accessToken;
  }

  set accessToken(newValue: string | null) {
    this.updateAccessToken(newValue);
  }

  updateAccessToken(newAccessToken: string | undefined | null): void {
    if (!newAccessToken) {
      return;
    }
    sessionStorage.setItem('accessToken', newAccessToken);
    this.state.next({...this.state.getValue(), accessToken: newAccessToken});
  }

  ngOnDestroy(): void {
    this.state.complete();
  }
}
