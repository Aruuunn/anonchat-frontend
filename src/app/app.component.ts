import {Component} from '@angular/core';
import {Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, Event} from '@angular/router';
import {LoadingStateService} from './core/services/loading-state.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../styles/palette.scss']
})
export class AppComponent {
  constructor(
    private router: Router,
    public loadingStateService: LoadingStateService
  ) {
    this.loadingStateService.isLoading = true;
    router.events.subscribe((e) => {
      this.checkRouterEvent(e);
    });
  }

  checkRouterEvent(routerEvent: Event): void {
    if (routerEvent instanceof NavigationStart) {
      this.loadingStateService.isLoading = true;
    }

    if (routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError) {
      this.loadingStateService.isLoading = false;
    }
  }
}
