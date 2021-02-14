import {StorageBackend} from '../storage-backend';
import {Inject, Injectable} from '@angular/core';
import {convertAllArrayBufferToString, convertAllBufferStringToArrayBuffer} from '../../utils/array-buffer.utils';

export const WEB_STORAGE_INJECTION_TOKEN = 'WEB_STORAGE_INJECTION_TOKEN';

@Injectable()
export class WebstorageAdapter implements StorageBackend {
  constructor(
    @Inject(WEB_STORAGE_INJECTION_TOKEN)
    private webStorage: Storage) {
  }

  private serializeData(data: any): string {
    if (typeof data !== 'object') {
      return JSON.stringify(data);
    }
    const dataWithSerializedArrayBuffer = convertAllArrayBufferToString(data);
    return JSON.stringify(dataWithSerializedArrayBuffer);
  }

  private deserializeData(data: string): any {
    const parsedData = JSON.parse(data);
    if (typeof parsedData !== 'object') {
      return parsedData;
    }
    return convertAllBufferStringToArrayBuffer(parsedData);
  }

  async save(key: string, data: any): Promise<void> {
    this.webStorage.setItem(key, this.serializeData(data));
  }

  async get(key: string): Promise<any> {
    const data = this.webStorage.getItem(key);

    if (data === null) {
      return undefined;
    } else {
      return this.deserializeData(data);
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
    return Object.keys(this.webStorage);
  }

}
