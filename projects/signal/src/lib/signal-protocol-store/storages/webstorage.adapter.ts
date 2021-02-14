import {StorageBackend} from '../storage-backend';
import {Inject, Injectable} from '@angular/core';
import {convertAllArrayBufferToString, convertAllBufferStringToArrayBuffer} from '../../utils/array-buffer.utils';

export const WEB_STORAGE_INJECTION_TOKEN = 'WEB_STORAGE_INJECTION_TOKEN';

@Injectable()
export class WebStorageAdapter implements StorageBackend {
  constructor(
    @Inject(WEB_STORAGE_INJECTION_TOKEN)
    private webStorage: Storage) {
  }

  private serializeData = (data: any): string => {
    return JSON.stringify(convertAllArrayBufferToString(data));
  };

  private deserializeData = (data: string): any => {
    const parsedData = JSON.parse(data);
    return convertAllBufferStringToArrayBuffer(parsedData);
  };

  async save(key: string, data: any): Promise<void> {
    this.webStorage.setItem(key, this.serializeData(data));
  }

  async get(key: string): Promise<any> {
    const storedData = this.webStorage.getItem(key);
    if (storedData === null) {
      return undefined;
    } else {
      return this.deserializeData(storedData);
    }
  }

  async remove(key: string): Promise<void> {
    this.webStorage.removeItem(key);
  }

  async reset(): Promise<void> {
    this.webStorage.clear();
  }

  async contains(key: string): Promise<boolean> {
    return this.webStorage.getItem(key) !== null;
  }

  async keys(): Promise<string[]> {
    console.assert(this.webStorage !== null && typeof this.webStorage !== 'undefined', 'WebStorage is undefined');
    return Object.keys(this.webStorage);
  }

}
