import { NgModule } from '@angular/core';
import IndexedDBStorage from './session-store/storages/indexed-db/indexed-db.store';
import {SessionStore} from './session-store/session-store';

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
  providers: [IndexedDBStorage, SessionStore]
})
export class SignalModule {}
