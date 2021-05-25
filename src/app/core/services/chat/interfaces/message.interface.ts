import { MessageType } from './message-type.interface';

/*
 * [ chatId, id ] - these fields are being used in storage implementations.
 * If you make change to the name of these fields make sure you update there also.
 * */
export interface MessageInterface {
  id: string;
  chatId: string;
  messageText: string;
  read: boolean;
  type: MessageType;
  sent?: boolean;
  timeStamp: Date;
}
