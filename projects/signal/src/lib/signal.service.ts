import {Inject, Injectable} from '@angular/core';
import {
  DeviceType,
  KeyHelper,
  KeyPairType,
  MessageType,
  PreKeyPairType,
  PreKeyType,
  SessionBuilder,
  SessionCipher,
  SignalProtocolAddress,
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

export const SIGNAL_PROTOCOL_STORE_INJECTION_TOKEN = 'SIGNAL_PROTOCOL_STORE_INJECTION_TOKEN';

@Injectable({
  providedIn: 'root'
})
export class SignalService {
  constructor(
    @Inject(SIGNAL_PROTOCOL_STORE_INJECTION_TOKEN)
    private store: Store) {
  }

  private generateRandomId(): number {
    return Math.ceil(10000 * Math.random())+1;
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

  async establishSession(bundle: DeviceType, recipientId: string, deviceId: number): Promise<SessionCipher | null> {
    try {
      const recipientAddress = new SignalProtocolAddress(recipientId, deviceId);
      const sessionBuilder = new SessionBuilder(this.store, recipientAddress);
      await sessionBuilder.processPreKey(bundle);
      return new SessionCipher(this.store, recipientAddress);
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  getSessionCipher(recipientId: string, deviceId: number): SessionCipher {
    const address = new SignalProtocolAddress(recipientId, deviceId);
    return new SessionCipher(this.store, address);
  }

  async decryptMessage(ciphertext: MessageType, sessionCipher: SessionCipher): Promise<ArrayBuffer | undefined> {

    let plaintext: ArrayBuffer | undefined;

    if (ciphertext.type === 3) {
      // It is a PreKeyWhisperMessage and will establish a session.
      try {
        plaintext = await sessionCipher.decryptPreKeyWhisperMessage(ciphertext.body as string, 'binary');
        console.log({plaintext});
      } catch (e) {
        console.error(e);
        // handle identity key conflict
      }
    } else if (ciphertext.type === 1) {
      // It is a WhisperMessage for an established session.
      plaintext = await sessionCipher.decryptWhisperMessage(ciphertext.body as string, 'binary');
    }
    return plaintext;
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
