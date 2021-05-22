import {NgModule} from '@angular/core';
import {SignalProtocolStore, STORAGE_BACKEND_INJECTION_TOKEN} from './signal-protocol-store/signal-protocol-store';
import {SIGNAL_PROTOCOL_STORE_INJECTION_TOKEN, SignalService} from './signal.service';
import {ASYNC_KEY_VALUE_STORAGE, KeyValueStorage} from './signal-protocol-store/storages/key-value-storage';
import * as localforage from 'localforage';



@NgModule({
  declarations: [],
  imports: [],
  exports: [],
  providers: [{
    useClass: KeyValueStorage,
    provide: STORAGE_BACKEND_INJECTION_TOKEN
  }, {
    useValue: localforage,
    provide: ASYNC_KEY_VALUE_STORAGE
  }
    , {
      useClass: SignalProtocolStore,
      provide: SIGNAL_PROTOCOL_STORE_INJECTION_TOKEN
    }, SignalService],
})
export class SignalModule {
}
