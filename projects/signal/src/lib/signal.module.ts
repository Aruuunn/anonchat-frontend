import {NgModule} from '@angular/core';
import {SignalProtocolStore, STORAGE_BACKEND_INJECTION_TOKEN} from './signal-protocol-store/signal-protocol-store';
import {SIGNAL_PROTOCOL_STORE_INJECTION_TOKEN, SignalService} from './signal.service';
import {InMemoryStorage} from './signal-protocol-store/storages/in-memory';

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
  providers: [{
    useClass: InMemoryStorage,
    provide: STORAGE_BACKEND_INJECTION_TOKEN
  }, {
    useClass: SignalProtocolStore,
    provide: SIGNAL_PROTOCOL_STORE_INJECTION_TOKEN
  }, SignalService],
})
export class SignalModule {
}
