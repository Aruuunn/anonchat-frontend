export interface KeyPairType {
  pubKey: ArrayBuffer;
  privKey: ArrayBuffer;
}

export interface PreKeyType {
  keyId: number;
  keyPair: KeyPairType;
}
interface SignedPreKeyType extends PreKeyType {
  signature: ArrayBuffer;
}


export type StoreValue =
  | string
  | number
  | KeyPairType
  | PreKeyType
  | SignedPreKeyType
  | ArrayBuffer
  | undefined;
