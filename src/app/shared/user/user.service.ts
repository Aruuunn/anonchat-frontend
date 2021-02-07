import {Inject, Injectable} from '@angular/core';
import {User} from './user.interface';
import {BehaviorSubject} from 'rxjs';

interface UserServiceState {
  user?: User;
}

export const USER_SERVICE_STORAGE_INJECTION_TOKEN = 'USER_SERVICE_STORAGE_INJECTION_TOKEN';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_SERVICE_STORAGE_INJECTION_TOKEN)
    private storage: Storage) {
  }

  public state: BehaviorSubject<UserServiceState> = new BehaviorSubject<UserServiceState>({
    user: this.fetchUserFromStorage()
  });

  private fetchUserFromStorage(): User | undefined {
    return JSON.parse(this.storage.getItem('user') as string) ?? undefined;
  }


  get userId(): string | undefined {
    return this.state.getValue().user?.id;
  }

  get user(): User | undefined {
    return this.state.getValue().user;
  }

  setUser(user: User): void {
    this.storage.setItem('user', JSON.stringify(user));
    this.state.next({...this.state.getValue(), user});
  }
}
