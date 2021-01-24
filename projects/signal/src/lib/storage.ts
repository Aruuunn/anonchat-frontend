import { Observable } from 'rxjs';

export interface Storage {
  save: (key: string, data: object) => void | Promise<void>;
  load: (
    key: string
  ) => object | undefined | Promise<object> | Observable<object>;
  remove: (key: string) => void | Promise<void>;
}
