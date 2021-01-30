import {
  binaryStringToArrayBuffer,
  arrayBufferToString,
} from '@privacyresearch/libsignal-protocol-typescript/lib/helpers';


export function convertAllStringToArrayBuffer(
  obj: Record<string, any>
): Record<string, any> {
  const objClone: Record<string, any> = Object.assign({}, obj);
  for (const key of Object.keys(objClone)) {
    if (objClone[key] instanceof String) {
      objClone[key] = binaryStringToArrayBuffer(objClone[key]);
    } else if (objClone[key] instanceof Object) {
      objClone[key] = convertAllArrayBufferToString(objClone[key]);
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
      objClone[key] = arrayBufferToString(objClone[key]);
    } else if (objClone[key] instanceof Object) {
      objClone[key] = convertAllArrayBufferToString(objClone[key]);
    }
  }
  return objClone;
}
