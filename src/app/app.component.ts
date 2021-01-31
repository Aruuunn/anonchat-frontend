import {Component, OnInit} from '@angular/core';
import {Bundle, SignalService} from '../../projects/signal/src/lib/signal.service';
import {convertAllArrayBufferToString} from '../../projects/signal/src/lib/signal-protocol-store/array-buffer.utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../styles/palette.scss']
})
export class AppComponent implements OnInit {
  constructor(private signalService: SignalService) {
  }

  async ngOnInit(): Promise<void> {

    const bundle: Bundle = await this.signalService.register();
    console.log((convertAllArrayBufferToString(bundle)));
  }
}
