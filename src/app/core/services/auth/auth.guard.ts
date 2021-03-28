import {
  CanActivate,
  Router,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    if (!this.authService.isLoggedIn) {
      await this.router.navigateByUrl(`/welcome?next=${location.pathname}`);
      return false;
    }
    return true;
  }
}
