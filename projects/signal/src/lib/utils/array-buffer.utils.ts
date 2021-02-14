import {
  binaryStringToArrayBuffer,
  arrayBufferToString,
} from '@privacyresearch/libsignal-protocol-typescript/lib/helpers';

export const ARRAY_BUFFER_PREFIX = '__ARRAY_BUFFER__';
export const ARRAY_BUFFER_PREFIX_REGEX = /^__ARRAY_BUFFER__/;

export function convertAllBufferStringToArrayBuffer(
  obj: Record<string, any>
): Record<string, any> {
  const objClone: Record<string, any> = Object.assign({}, obj);
  for (const key of Object.keys(objClone)) {
    if (typeof objClone[key] === 'string' && RegExp(ARRAY_BUFFER_PREFIX_REGEX).test(objClone[key])) {
      const binaryString = atob(objClone[key].slice(ARRAY_BUFFER_PREFIX.length));
      objClone[key] = binaryStringToArrayBuffer(binaryString);
      console.assert(objClone[key] instanceof ArrayBuffer);
    } else if (objClone[key] instanceof Array) {
      for (let i = 0; i < objClone[key].length; i++) {
        if (typeof objClone[key][i] === 'object') {
          objClone[key][i] = convertAllBufferStringToArrayBuffer(objClone[key][i]);
        }
      }
    } else if (typeof objClone[key] === 'object') {
      objClone[key] = convertAllBufferStringToArrayBuffer(objClone[key]);
    }
  }
  return objClone;
}

export function convertAllArrayBufferToString(
  obj: Record<string, any>
): Record<string, any> {
  const objClone: Record<string, any> = Object.assign({}, obj);
  for (const key of Object.keys(objClone)) {
    if (objClone[key] instanceof ArrayBuffer) {
      objClone[key] = ARRAY_BUFFER_PREFIX + btoa(arrayBufferToString(objClone[key]));
    } else if (objClone[key] instanceof Array) {
      for (let i = 0; i < objClone[key].length; i++) {
        if (typeof objClone[key][i] === 'object') {
          objClone[key][i] = convertAllArrayBufferToString(objClone[key][i]);
        }
      }
    } else if (typeof objClone[key] === 'object') {
      objClone[key] = convertAllArrayBufferToString(objClone[key]);
    }
  }
  return objClone;
}
