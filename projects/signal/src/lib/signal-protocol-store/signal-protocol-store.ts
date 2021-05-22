import {
  StorageType,
  Direction,
  SessionRecordType,
  SignalProtocolAddress,
} from '@privacyresearch/libsignal-protocol-typescript';
import { Inject, Injectable } from '@angular/core';
import { arrayBufferToString } from '@privacyresearch/libsignal-protocol-typescript/lib/helpers';
import {
  StoreValue,
  KeyPairType,
} from './interfaces/signal-protocol-store.interfaces';
import { isArrayBuffer, isKeyPairType } from './type-gaurds.util';
import {
  IDENTITY_KEY,
  REGISTRATION_ID,
  PRE_KEY_PREFIX,
  SESSION_PREFIX,
  SIGNED_PRE_KEY_PREFIX,
  IDENTITY_PREFIX,
} from './constants';
import { StorageBackendInterface } from './interfaces/storage-backend.interface';

export interface Store extends StorageType {
  storeLocalRegistrationId: (registrationId: number) => Promise<void>;
  removeAllSessions: (identifier: string) => Promise<void>;
  storeIdentityKeyPair: (identityKeyPair: KeyPairType) => Promise<void>;
}

export const STORAGE_BACKEND_INJECTION_TOKEN =
  'STORAGE_BACKEND_INJECTION_TOKEN';

@Injectable()
export class SignalProtocolStore implements Store {
  constructor(
    @Inject(STORAGE_BACKEND_INJECTION_TOKEN)
    private storageBackend: StorageBackendInterface
  ) {}

  async get(key: string, defaultValue: StoreValue): Promise<StoreValue> {
    if (key === null || key === undefined) {
      throw new Error('Tried to get value for undefined/null key');
    }

    return (await this.storageBackend.get(key)) || defaultValue;
  }

  async remove(key: string): Promise<void> {
    if (key === null || key === undefined) {
      throw new Error('Tried to remove value for undefined/null key');
    }
    await this.storageBackend.remove(key);
  }

  async put(key: string, value: StoreValue): Promise<void> {
    if (
      key === undefined ||
      value === undefined ||
      key === null ||
      value === null
    ) {
      throw new Error('Tried to store undefined/null');
    }
    await this.storageBackend.save(key, value);
  }

  async storeIdentityKeyPair(identityKeyPair: KeyPairType): Promise<void> {
    await this.storageBackend.save(IDENTITY_KEY, identityKeyPair);
  }

  async getIdentityKeyPair(): Promise<KeyPairType | undefined> {
    const kp = await this.get(IDENTITY_KEY, undefined);
    if (isKeyPairType(kp) || typeof kp === 'undefined') {
      return kp;
    }
    throw new Error('Item stored as identity key of unknown type.');
  }

  async storeLocalRegistrationId(registrationId: number): Promise<void> {
    await this.storageBackend.save(REGISTRATION_ID, registrationId);
  }

  async getLocalRegistrationId(): Promise<number | undefined> {
    const rid = await this.get(REGISTRATION_ID, undefined);
    if (typeof rid === 'number' || typeof rid === 'undefined') {
      return rid;
    }
    throw new Error('Stored Registration ID is not a number');
  }

  async isTrustedIdentity(
    identifier: string,
    identityKey: ArrayBuffer,
    _: Direction
  ): Promise<boolean> {
    if (identifier === null || identifier === undefined) {
      throw new Error('tried to check identity key for undefined/null key');
    }
    const trusted = await this.get(IDENTITY_PREFIX + identifier, undefined);

    if (trusted === undefined) {
      return Promise.resolve(true);
    }
    return Promise.resolve(
      arrayBufferToString(identityKey) ===
        arrayBufferToString(trusted as ArrayBuffer)
    );
  }

  async loadPreKey(keyId: string | number): Promise<KeyPairType | undefined> {
    let res = await this.get(PRE_KEY_PREFIX + keyId, undefined);
    if (isKeyPairType(res)) {
      res = { pubKey: res.pubKey, privKey: res.privKey };
      return res;
    } else if (typeof res === 'undefined') {
      return res;
    }
    throw new Error(`stored key has wrong type`);
  }

  async loadSession(
    identifier: string
  ): Promise<SessionRecordType | undefined> {
    const rec = await this.get(SESSION_PREFIX + identifier, undefined);
    if (typeof rec === 'string') {
      return rec as string;
    } else if (typeof rec === 'undefined') {
      return rec;
    }
    throw new Error(
      `session record is not an ArrayBuffer ${JSON.stringify(rec)}`
    );
  }

  async loadSignedPreKey(
    keyId: number | string
  ): Promise<KeyPairType | undefined> {
    const res = await this.get(SIGNED_PRE_KEY_PREFIX + keyId, undefined);
    if (isKeyPairType(res)) {
      return { pubKey: res.pubKey, privKey: res.privKey };
    } else if (typeof res === 'undefined') {
      return res;
    }
    throw new Error(`stored key has wrong type`);
  }

  async removePreKey(keyId: number | string): Promise<void> {
    await this.remove(PRE_KEY_PREFIX + keyId);
  }

  async saveIdentity(
    identifier: string,
    identityKey: ArrayBuffer
  ): Promise<boolean> {
    if (identifier === null || identifier === undefined) {
      throw new Error('Tried to put identity key for undefined/null key');
    }

    const address = SignalProtocolAddress.fromString(identifier);

    const existing = await this.get(
      IDENTITY_PREFIX + address.getName(),
      undefined
    );
    await this.put(IDENTITY_PREFIX + address.getName(), identityKey);
    if (existing && !isArrayBuffer(existing)) {
      throw new Error('Identity Key is incorrect type');
    }

    return !!(
      existing &&
      arrayBufferToString(identityKey) !==
        arrayBufferToString(existing as ArrayBuffer)
    );
  }

  async storeSession(
    identifier: string,
    record: SessionRecordType
  ): Promise<void> {
    return this.put(SESSION_PREFIX + identifier, record);
  }

  async loadIdentityKey(identifier: string): Promise<ArrayBuffer | undefined> {
    if (identifier === null || identifier === undefined) {
      throw new Error('Tried to get identity key for undefined/null key');
    }

    const key = await this.get(IDENTITY_PREFIX + identifier, undefined);
    if (isArrayBuffer(key)) {
      return key as ArrayBuffer;
    } else if (typeof key === 'undefined') {
      return key;
    }
    throw new Error(`Identity key has wrong type`);
  }

  async storePreKey(
    keyId: number | string,
    keyPair: KeyPairType
  ): Promise<void> {
    return this.put(PRE_KEY_PREFIX + keyId, keyPair);
  }

  async storeSignedPreKey(
    keyId: number | string,
    keyPair: KeyPairType
  ): Promise<void> {
    return this.put(SIGNED_PRE_KEY_PREFIX + keyId, keyPair);
  }

  async removeSignedPreKey(keyId: number | string): Promise<void> {
    return this.remove(SIGNED_PRE_KEY_PREFIX + keyId);
  }

  async removeSession(identifier: string): Promise<void> {
    return this.remove(SESSION_PREFIX + identifier);
  }

  async removeAllSessions(identifier: string): Promise<void> {
    for (const key in await this.storageBackend.keys()) {
      if (key.startsWith(SESSION_PREFIX + identifier)) {
        await this.storageBackend.remove(key);
      }
    }
  }
}
