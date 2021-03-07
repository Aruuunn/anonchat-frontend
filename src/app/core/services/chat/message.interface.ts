export enum MessageType {
  SENT = 'SENT',
  RECEIVED = 'RECEIVED',
}

export interface MessageInterface {
  id: string;
  messageText: string;
  read: boolean;
  type: MessageType;
  sent?: boolean;
}
