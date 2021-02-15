import {
  binaryStringToArrayBuffer,
  arrayBufferToString,
} from '@privacyresearch/libsignal-protocol-typescript/lib/helpers';

export const ARRAY_BUFFER_PREFIX = '__ARRAY_BUFFER__';
export const ARRAY_BUFFER_PREFIX_REGEX = /^__ARRAY_BUFFER__/;

export function convertAllBufferStringToArrayBuffer(
  obj: any
): any {

  if (typeof obj === 'string' && RegExp(ARRAY_BUFFER_PREFIX_REGEX).test(obj)) {
    const binaryString = atob(obj.slice(ARRAY_BUFFER_PREFIX.length));
    return binaryStringToArrayBuffer(binaryString);
  } else if (typeof obj === 'object') {
    if (obj instanceof Array) {
      for (let i = 0; i < obj.length; i++) {
        obj[i] = convertAllBufferStringToArrayBuffer(obj[i]);
      }
      return [...obj];
    } else {
      const newObj: Record<any, any> = {};
      for (const key of Object.keys(obj)) {
        newObj[key] = convertAllBufferStringToArrayBuffer(obj[key]);
      }

      return newObj;
    }
  }

  return obj;
}

export function convertAllArrayBufferToString(
  obj: any
): any {
  if (typeof obj === 'object') {
    if (obj instanceof ArrayBuffer) {
      return ARRAY_BUFFER_PREFIX + btoa(arrayBufferToString(obj));
    } else if (obj instanceof Array) {
      for (let i = 0; i < obj.length; i++) {
        obj[i] = convertAllArrayBufferToString(obj[i]);
      }
      return [...obj];
    } else {
      const newObj: Record<any, any> = {};
      for (const key of Object.keys(obj)) {
        newObj[key] = convertAllArrayBufferToString(obj[key]);
      }

      return newObj;
    }
  }

  return obj;
}
