import { StorageBackendInterface } from '../interfaces/storage-backend.interface';
import { Inject, Injectable } from '@angular/core';
import {
  convertAllArrayBufferToString,
  convertAllBufferStringToArrayBuffer,
} from '../../utils/array-buffer.utils';
import { AsyncKeyValueStorageInterface as AsyncKeyValueStorage } from '../interfaces/async-key-value-storage.interface';

export const ASYNC_KEY_VALUE_STORAGE_INJECTION_TOKEN = Symbol(
  'ASYNC_KEY_VALUE_STORAGE'
);

@Injectable()
export class KeyValueStorage implements StorageBackendInterface {
  constructor(
    @Inject(ASYNC_KEY_VALUE_STORAGE_INJECTION_TOKEN)
    private webStorage: AsyncKeyValueStorage
  ) {}

  private serializeData = (data: any): string => {
    return JSON.stringify(convertAllArrayBufferToString(data));
  };

  private deserializeData = (data: string): any => {
    const parsedData = JSON.parse(data);
    return convertAllBufferStringToArrayBuffer(parsedData);
  };

  async save(key: string, data: any): Promise<void> {
    await this.webStorage.setItem(key, this.serializeData(data));
  }

  async get(key: string): Promise<any> {
    const storedData = await this.webStorage.getItem(key);
    if (storedData === null) {
      return undefined;
    } else {
      return this.deserializeData(storedData);
    }
  }

  async remove(key: string): Promise<void> {
    await this.webStorage.removeItem(key);
  }

  async reset(): Promise<void> {
    await this.webStorage.clear();
  }

  async contains(key: string): Promise<boolean> {
    return (await this.webStorage.getItem(key)) !== null;
  }

  async keys(): Promise<string[]> {
    return (await this.webStorage.keys()) ?? [];
  }
}
