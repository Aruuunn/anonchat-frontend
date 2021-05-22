import { Injectable } from '@angular/core';
import { StorageBackendInterface } from '../interfaces/storage-backend.interface';

@Injectable()
export class InMemoryStorage implements StorageBackendInterface {
  private store: { [key: string]: any };

  constructor() {
    this.store = {};
  }
  async get(key: string): Promise<any> {
    return this.store[key];
  }

  async remove(key: string): Promise<void> {
    delete this.store[key];
  }

  async reset(): Promise<void> {
    this.store = {};
  }

  async contains(key: string): Promise<boolean> {
    return key in this.store;
  }

  async save(key: string, value: any): Promise<void> {
    this.store[key] = value;
  }
  async keys(): Promise<string[]> {
    return Object.keys(this.store);
  }
}
