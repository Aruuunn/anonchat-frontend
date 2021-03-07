import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpService } from '../services/http/http.service';
import { AuthService } from '../services/auth/auth.service';
import { isValidJwt } from '../../shared/utils/is-valid-jwt';

@Injectable()
export class InvitationDetailsResolver implements Resolve<any> {
  constructor(
    private httpService: HttpService,
    private authService: AuthService,
    private router: Router
  ) {}

  private fetchInvitationDetails(invitationId: string): Promise<any> {
    return this.httpService
      .get(`/invitation/${invitationId.trim()}`)
      .toPromise();
  }

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    const invitationId = route.paramMap.get('invitationId');

    if (invitationId === null) {
      return;
    }

    if (!isValidJwt(this.authService.accessToken)) {
      await this.httpService.refreshAccessToken();
    }

    try {
      return await this.fetchInvitationDetails(invitationId);
    } catch (e) {
      if (e?.code === 401 || e?.error?.statusCode === 401) {
        await this.httpService.refreshAccessToken();
        return await this.fetchInvitationDetails(invitationId);
      } else if (e?.code === 400 || e?.error?.statusCode === 400) {
        await this.router.navigateByUrl('/');
      } else {
        await this.router.navigateByUrl(`/welcome?next=${location.pathname}`);
      }
    }
  }
}
