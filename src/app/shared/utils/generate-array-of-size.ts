export const generateArrayOfSize = <T>(size: number): Array<T> =>
  Array.from<T>({ length: size });
