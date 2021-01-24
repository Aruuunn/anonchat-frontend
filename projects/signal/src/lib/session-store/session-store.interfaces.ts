import {KeyPairType, StorageType} from '@privacyresearch/libsignal-protocol-typescript';

export type PreKey = {
  keyId: string | number;
  keyPair: KeyPairType;
};

export type SignedPreKey = PreKey;

export interface Session {
  encodedAddress: string;
  record: string;
}


export interface Store extends StorageType {
  saveLocalRegistrationId: (registrationId: number) => void | Promise<void>;
}
