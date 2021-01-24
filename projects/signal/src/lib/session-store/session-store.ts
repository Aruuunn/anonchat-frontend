import {Direction, KeyPairType } from '@privacyresearch/libsignal-protocol-typescript';

import {Storage} from './storage';
import {
  IDENTITY_KEY_PAIR,
  REGISTRATION_ID,
  PRE_KEYS,
  SIGNED_PRE_KEY,
  SESSION_DATA
} from './session-store.constants';
import {
  PreKey,
  SignedPreKey,
  Session,
  Store
} from './session-store.interfaces';


export class SessionStore implements Store {
  constructor(private storage: Storage) {
  }

  private static getRandomElementOf(array: Array<any>): any {
    const lengthOfArray: number = array.length;
    return array[Math.floor(Math.random() * lengthOfArray)];
  }

  private static assertValueIsOfTypeKeyValuePair(value: any): void {
    console.assert(
      typeof value === 'undefined' ||
      (typeof value?.privKey !== 'undefined' && typeof value?.pubKey !== 'undefined'
      )
    );
  }

  async getIdentityKeyPair(): Promise<KeyPairType | undefined> {
    const identityKeyPair = await this.storage.load(IDENTITY_KEY_PAIR) as KeyPairType | undefined;
    this.constructor.prototype.assertValueIsOfTypeKeyValuePair(identityKeyPair);
    return identityKeyPair;
  }

  async isTrustedIdentity(identifier: string, identityKey: ArrayBuffer, direction: Direction): Promise<boolean> {
    // @TODO - Have to figure out the use of this
    return true;
  }

  async getLocalRegistrationId(): Promise<number | undefined> {
    return await this.storage.load(REGISTRATION_ID);
  }

  async loadPreKey(): Promise<KeyPairType | undefined> {
    const preKeys: PreKey[] = await this.storage.load(PRE_KEYS);
    const preKey: PreKey = this.constructor.prototype.getRandomElementOf(preKeys);
    this.constructor.prototype.assertValueIsOfTypeKeyValuePair(preKey?.keyPair);
    return preKey.keyPair;
  }

  async loadSession(encodedAddress: string): Promise<string | undefined> {
    const sessions: Session[] = await this.storage.load(SESSION_DATA);

    for (const session of sessions) {
      if (session.encodedAddress === encodedAddress) {
        return session.record;
      }
    }
    return undefined;
  }

  async loadSignedPreKey(): Promise<KeyPairType | undefined> {
    const {keyPair} = await this.storage.load(SIGNED_PRE_KEY) as SignedPreKey;
    this.constructor.prototype.assertValueIsOfTypeKeyValuePair(keyPair);
    return keyPair;
  }

  async removeSignedPreKey(): Promise<void> {
   await this.storage.remove(SIGNED_PRE_KEY);
  }

  async saveIdentity(encodedAddress: string, publicKey: ArrayBuffer, nonBlockingApproval?: boolean): Promise<boolean> {
    // @TODO complete Implementation
    return true;
  }

  async storePreKey(keyId: string | number, keyPair: KeyPairType): Promise<void> {

  }

  async storeSession(encodedAddress: string, record: string): Promise<void> {
    const sessions: Session[] = await this.storage.load(SESSION_DATA);
    const session: Session = {
      record,
      encodedAddress
    };
    await this.storage.save(SESSION_DATA, [...sessions, session]);
  }

  async storeSignedPreKey(keyId: string | number, keyPair: KeyPairType): Promise<void> {
    const signedPreKey: SignedPreKey = {
      keyId,
      keyPair
    };
    await this.storage.save(SIGNED_PRE_KEY, signedPreKey);
  }

  async removePreKey(keyId: number | string): Promise<void> {
      const preKeys: PreKey[] = await this.storage.load(PRE_KEYS);
      await this.storage.save(PRE_KEYS, preKeys.filter(preKey => preKey.keyId !== keyId));
  }

  async saveLocalRegistrationId(registrationId: number): Promise<void> {
    await this.storage.save(REGISTRATION_ID, registrationId);
  }
}
