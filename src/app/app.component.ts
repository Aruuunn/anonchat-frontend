import {Component} from '@angular/core';
import {Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, Event} from '@angular/router';
import {BehaviorSubject} from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../styles/palette.scss']
})
export class AppComponent {
  loading = new BehaviorSubject<boolean>(true);

  constructor(private router: Router) {
    router.events.subscribe((e) => {
      this.checkRouterEvent(e);
    });
  }

  checkRouterEvent(routerEvent: Event): void {
    if (routerEvent instanceof NavigationStart) {
      this.loading.next(true);
    }

    if (routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError) {
      this.loading.next(false);
    }
  }
}
