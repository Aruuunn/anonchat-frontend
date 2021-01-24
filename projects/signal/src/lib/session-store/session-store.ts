import {Direction, KeyPairType, StorageType } from '@privacyresearch/libsignal-protocol-typescript';

import {Storage} from './storage';
import {
  IDENTITY_KEY_PAIR,
  REGISTRATION_ID,
} from './session-store.constants';

interface Session {
  encodedAddress: string;
  record: string;
}

interface Store extends  StorageType {
  saveLocalRegistrationId: (registrationId: number) => void | Promise<void>;
}

export class SessionStore implements Store {
  constructor(private storage: Storage) {
  }

  async getIdentityKeyPair(): Promise<KeyPairType | undefined> {
    const identityKeyPair = await this.storage.load(IDENTITY_KEY_PAIR) as KeyPairType | undefined;
    // Assert that identityKeyPair is of type KeyPairType | undefined
    console.assert(
      typeof identityKeyPair === 'undefined' ||
      (typeof identityKeyPair?.privKey !== 'undefined' && typeof identityKeyPair?.pubKey !== 'undefined'
      )
    );

    return identityKeyPair;
  }

  async isTrustedIdentity(identifier: string, identityKey: ArrayBuffer, direction: Direction): Promise<boolean> {
    // @TODO - Have to figure out use of this
    return true;
  }

  async getLocalRegistrationId(): Promise<number | undefined> {
    return this.storage.load(REGISTRATION_ID);
  }

  loadPreKey() {
    // @TODO complete implementation
  }

  loadSession() {
    // @TODO complete implementation
  }

  loadSignedPreKey() {
    // @TODO complete implementation
  }

  removeSignedPreKey() {
    // @TODO complete implementation
  }

  saveIdentity() {
    // @TODO complete implementation
  }

  storePreKey() {
    // @TODO complete implementation
  }

  storeSession() {
    // @TODO complete implementation
  }

  storeSignedPreKey() {
    // @TODO complete implementation
  }
}
