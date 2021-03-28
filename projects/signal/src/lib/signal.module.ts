import {NgModule} from '@angular/core';
import {SignalProtocolStore, STORAGE_BACKEND_INJECTION_TOKEN} from './signal-protocol-store/signal-protocol-store';
import {SIGNAL_PROTOCOL_STORE_INJECTION_TOKEN, SignalService} from './signal.service';
import {WEB_STORAGE_INJECTION_TOKEN, WebStorageAdapter} from './signal-protocol-store/storages/webstorage.adapter';



@NgModule({
  declarations: [],
  imports: [],
  exports: [],
  providers: [{
    useClass: WebStorageAdapter,
    provide: STORAGE_BACKEND_INJECTION_TOKEN
  }, {
    useValue: localStorage,
    provide: WEB_STORAGE_INJECTION_TOKEN
  }
    , {
      useClass: SignalProtocolStore,
      provide: SIGNAL_PROTOCOL_STORE_INJECTION_TOKEN
    }, SignalService],
})
export class SignalModule {
}
