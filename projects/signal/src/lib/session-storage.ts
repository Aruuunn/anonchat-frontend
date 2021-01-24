import { StorageType } from '@privacyresearch/libsignal-protocol-typescript';

export class SessionStore implements StorageType {
  async getIdentityKeyPair() {
    return undefined;
  }

  isTrustedIdentity() {}
  getLocalRegistrationId() {}
  loadPreKey() {}
  loadSession() {}
  loadSignedPreKey() {}
  removeSignedPreKey() {}
  saveIdentity() {}
  storePreKey() {}
  storeSession() {}
  storeSignedPreKey() {}
}
