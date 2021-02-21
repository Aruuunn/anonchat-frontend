import {DeviceType} from '@privacyresearch/libsignal-protocol-typescript';
import {MessageInterface} from './message.interface';
import {ChatType} from './chat-type.enum';

export interface ChatInterface {
  id: string;
  bundle?: DeviceType<string>;
  messages: MessageInterface[];
  recipientId: string;
  type: ChatType;
  sessionEstablished: boolean;
  name?: string;
}
