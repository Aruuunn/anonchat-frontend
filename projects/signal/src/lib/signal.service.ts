import {Injectable} from '@angular/core';
import {
  KeyHelper,
  KeyPairType,
  PreKeyPairType,
  PreKeyType,
  SignedPreKeyPairType,
  SignedPublicPreKeyType
} from '@privacyresearch/libsignal-protocol-typescript';
import {Store} from './signal-protocol-store/signal-protocol-store';


export interface Bundle {
  registrationId: number;
  identityPubKey: ArrayBuffer;
  signedPreKey: SignedPublicPreKeyType;
  oneTimePreKeys: PreKeyType [];
}

@Injectable()
export class SignalService {
  constructor(private readonly store: Store) {
  }

  generateRandomId(): number {
    return Math.floor(10000 * Math.random());
  }

  async generateOnePreKey(): Promise<PreKeyPairType> {
    const id = this.generateRandomId();
    return await KeyHelper.generatePreKey(id);
  }

  async generateManyPreKeys(numberOfPreKeys: number = 100): Promise<PreKeyPairType[]> {
    const preKeys: PreKeyPairType[] = [];
    for (let i = 0; i < numberOfPreKeys; i++) {
      const preKey: PreKeyPairType = await this.generateOnePreKey();
      preKeys.push(preKey);
    }
    return preKeys;
  }

  async generatePreKeysAndSave(): Promise<PreKeyPairType[]> {
    const preKeys: PreKeyPairType[] = await this.generateManyPreKeys();
    for (const prekey of preKeys) {
      await this.store.storePreKey(prekey.keyId, prekey.keyPair);
    }
    return preKeys;
  }

  async generateSignedPreKey(identityKeyPair: KeyPairType): Promise<SignedPreKeyPairType> {
    const id = this.generateRandomId();
    return await KeyHelper.generateSignedPreKey(identityKeyPair, id);
  }

  async generateSignedPreKeyAndSave(identityKeyPair: KeyPairType): Promise<SignedPreKeyPairType> {
    const signedPreKey = await this.generateSignedPreKey(identityKeyPair);
    await this.store.storeSignedPreKey(signedPreKey.keyId, signedPreKey.keyPair);
    return signedPreKey;
  }

  async register(): Promise<Bundle> {
    const registrationId: number = KeyHelper.generateRegistrationId();
    await this.store.storeLocalRegistrationId(registrationId);
    const identityKeyPair: KeyPairType = await KeyHelper.generateIdentityKeyPair();
    await this.store.storeIdentityKeyPair(identityKeyPair);

    const signedPreKey = await this.generateSignedPreKeyAndSave(identityKeyPair);
    const preKeys = await this.generatePreKeysAndSave();

    const publicSignedPreKey: SignedPublicPreKeyType = {
      keyId: signedPreKey.keyId,
      publicKey: signedPreKey.keyPair.pubKey,
      signature: signedPreKey.signature,
    };
    const publicPreKeys: PreKeyType[] = preKeys.map((preKey) => ({
      keyId: preKey.keyId,
      publicKey: preKey.keyPair.pubKey,
    }));

    return ({
      registrationId,
      identityPubKey: identityKeyPair.pubKey,
      signedPreKey: publicSignedPreKey,
      oneTimePreKeys: publicPreKeys,
    });
  }
}
