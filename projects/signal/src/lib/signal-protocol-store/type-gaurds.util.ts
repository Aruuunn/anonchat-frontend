import {
  PreKeyPairType,
  SignedPreKeyPairType,
  KeyPairType,
} from '@privacyresearch/libsignal-protocol-typescript';
import { StoreValue } from './interfaces/signal-protocol-store.interfaces';

export function isKeyPairType(kp: any): kp is KeyPairType {
  return !!(kp?.privKey && kp?.pubKey);
}

export function isPreKeyType(pk: any): pk is PreKeyPairType {
  return typeof pk?.keyId === 'number' && isKeyPairType(pk?.keyPair);
}

export function isSignedPreKeyType(spk: any): spk is SignedPreKeyPairType {
  return spk?.signature && isPreKeyType(spk);
}

export function isArrayBuffer(thing: StoreValue): thing is ArrayBuffer {
  const t = typeof thing;
  return (
    !!thing &&
    t !== 'string' &&
    t !== 'number' &&
    'byteLength' in (thing as any)
  );
}
