export enum MessageType {
  SENT = 'SENT',
  RECEIVED = 'RECEIVED'
}


export interface MessageInterface {
  type: MessageType;
  message: string;
  read: boolean;
}
