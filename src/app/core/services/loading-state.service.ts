import {Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class LoadingStateService {
  loading = false;

  get isLoading(): boolean {
    return this.loading;
  }

  set isLoading(newValue) {
    this.loading = newValue;
  }

}
