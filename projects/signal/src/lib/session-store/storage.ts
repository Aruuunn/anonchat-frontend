export interface Storage {
  save: (key: string, data: any) => void | Promise<void>;
  load: (
    key: string
  ) => any | undefined | Promise<any>;
  remove: (key: string) => void | Promise<void>;
}
