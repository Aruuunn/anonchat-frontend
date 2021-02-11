import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpService} from '../http/http.service';


@Injectable()
export class InvitationDetailsResolver implements Resolve<any> {
  constructor(private httpService: HttpService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const invitationId = route.paramMap.get('invitationId');

    if (invitationId === null) {
      return;
    }

    return this.httpService.get(`/invitation/${invitationId.trim()}`);
  }
}
