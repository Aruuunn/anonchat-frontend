import { DeviceType } from '@privacyresearch/libsignal-protocol-typescript';
import { MessageInterface } from './message.interface';
import { ChatType } from '../chat-type.enum';

/*
 * [ id, lastUpdatedAt ] - these fields are being used in storage implementations.
 * If you make change to the name of these fields make sure you update there also.
 * */
export interface ChatInterface {
  id: string;
  bundle?: DeviceType<string>;
  recipientId: string;
  type: ChatType;
  sessionEstablished: boolean;
  name?: string;
  lastUpdatedAt: Date;
}
