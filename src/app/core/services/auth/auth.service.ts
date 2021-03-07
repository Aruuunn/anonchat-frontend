import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface AuthState {
  accessToken: string | null;
  isLoggedIn: boolean;
}

const initialAuthState: AuthState = {
  accessToken: sessionStorage.getItem('accessToken'),
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
};

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  public state: BehaviorSubject<AuthState> = new BehaviorSubject<AuthState>(
    initialAuthState
  );

  constructor() {}

  get isLoggedIn(): boolean {
    return this.state.getValue().isLoggedIn;
  }

  set isLoggedIn(value) {
    localStorage.setItem('isLoggedIn', `${value}`);
    this.state.next({ ...this.state.getValue(), isLoggedIn: value });
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
    this.state.next({ ...this.state.getValue(), accessToken: newAccessToken });
  }

  ngOnDestroy(): void {
    this.state.complete();
  }
}
