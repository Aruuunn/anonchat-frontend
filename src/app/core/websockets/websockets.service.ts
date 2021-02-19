import {Injectable} from '@angular/core';
import io from 'socket.io-client';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import {Events} from './events.enum';

@Injectable({
  providedIn: 'root',
})
export class WebsocketsService {

  private ws: SocketIOClient.Socket | undefined;

  constructor(private authService: AuthService, private router: Router) {
  }

  public connectToWs(url: string): SocketIOClient.Socket {
    const accessToken = this.authService.accessToken ?? undefined;
    console.log({accessToken});
    const socket = io.connect(url, {
      query: {
        accessToken
      },
    });
    this.ws = socket;
    socket.on(Events.CONNECT, () => {
      console.log('Connected');
    });

    socket.on(Events.NEW_ACCESS_TOKEN, (payload: { accessToken: string }) => {
      this.authService.accessToken = payload.accessToken;
    });
    socket.on(Events.DISCONNECT, () => {
      console.log('Disconnected');
    });

    socket.on(Events.EXCEPTION, (data: { code: number, message: string }) => {
      console.error(data);
      if (data?.code === 401) {
        void this.router.navigateByUrl('/welcome');
      }
    });
    return socket;
  }

  public addEventListener(event: string, callback: (...data: any[]) => void): void {
    this.ws?.addEventListener(event, callback);
  }

  public emit(event: string, payload: object, ack: (...args: any[]) => void = () => {
  }): void {
    if (typeof this.ws === 'undefined') {
      throw new Error('Connect to websocket server before attempting to send data.');
    }
    console.log('Emitting...', event);
    this.ws.emit(event, {...payload}, ack);
  }

  public removeEventListener(event: string): void {
    this.ws?.off(event);
  }

  public closeConnection(): void {
    if (typeof this.ws !== 'undefined') {
      this.ws.close();
    }
  }
}
