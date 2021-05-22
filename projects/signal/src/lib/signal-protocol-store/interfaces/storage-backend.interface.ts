export interface StorageBackendInterface {
  save: (key: string, data: any) => Promise<void>;
  get: (key: string) => Promise<any>;
  remove: (key: string) => Promise<void>;
  reset: () => Promise<void>;
  contains: (key: string) => Promise<boolean>;
  keys: () => Promise<string[]>;
}
