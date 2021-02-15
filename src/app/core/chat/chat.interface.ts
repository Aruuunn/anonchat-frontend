import {DeviceType} from '@privacyresearch/libsignal-protocol-typescript';
import {MessageInterface} from './message.interface';

export interface ChatInterface {
  id: string;
  bundle?: DeviceType<string>;
  messages: MessageInterface[];
  recipientId: string;
  name?: string;
}
